import crypto from 'node:crypto';
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { db, now } from './db';
import { getConfig } from './contentDb';
import { cookieAttrs, hashPassword, parseCookies, verifyPassword } from './auth';

const USER_COOKIE = 'user_session';
const DAY_MS = 24 * 60 * 60 * 1000;
const BOX_DAYS = [0, 1, 2, 4, 7, 15];
const LOCK_AFTER_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const REGISTER_LIMIT = 10;

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  status: 'normal' | 'disabled';
  created_at: number;
  last_login_at: number | null;
  last_study_at: number | null;
  failed_attempts: number;
  locked_until: number | null;
}

type AuthedRequest = Request & { user?: UserRow };

function fail(res: Response, status: number, message: string) {
  res.status(status).json({ error: message });
}

function normalizeUsername(value: unknown) {
  return String(value ?? '').trim();
}

function normalizePassword(value: unknown) {
  return String(value ?? '').trim();
}

function usernameError(username: string) {
  return /^[A-Za-z0-9_]{4,20}$/.test(username)
    ? null
    : '用户名需 4–20 位，仅限字母、数字和下划线';
}

function passwordError(password: string) {
  const ok = password.length >= 8 && password.length <= 64 && /[A-Za-z]/.test(password) && /\d/.test(password);
  return ok ? null : '密码需 8–64 位，且同时包含字母和数字';
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    username: user.username,
    status: user.status,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
    lastStudyAt: user.last_study_at,
  };
}

function findUserByUsername(username: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username) as
    | UserRow
    | undefined;
}

function findUserById(id: number): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

/* ---------- 会话 ---------- */

function createSession(res: Response, userId: number) {
  const token = crypto.randomBytes(32).toString('hex');
  const days = getConfig().customerSessionDays;
  const expiresAt = now() + days * DAY_MS;
  db.prepare('INSERT INTO user_sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .run(token, userId, now(), expiresAt);
  res.setHeader('Set-Cookie', `${USER_COOKIE}=${token}; ${cookieAttrs(days * 24 * 60 * 60)}`);
}

function clearSessionCookie(res: Response) {
  res.setHeader('Set-Cookie', `${USER_COOKIE}=; ${cookieAttrs(0)}`);
}

function sessionToken(req: Request) {
  return parseCookies(req.headers.cookie)[USER_COOKIE] ?? null;
}

function dropCurrentSession(req: Request) {
  const token = sessionToken(req);
  if (token) db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
}

function getSessionUser(req: Request): UserRow | null {
  const token = sessionToken(req);
  if (!token) return null;
  const session = db
    .prepare('SELECT user_id, expires_at FROM user_sessions WHERE token = ?')
    .get(token) as { user_id: number; expires_at: number } | undefined;
  if (!session || session.expires_at <= now()) {
    if (session) db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
    return null;
  }
  return findUserById(session.user_id) ?? null;
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  if (!user) {
    fail(res, 401, '未登录或登录已过期');
    return;
  }
  if (user.status !== 'normal') {
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(user.id);
    clearSessionCookie(res);
    fail(res, 403, '账号已被禁用，请联系管理员');
    return;
  }
  (req as AuthedRequest).user = user;
  next();
}

/* ---------- 登录限流 ---------- */

const registrationHits = new Map<string, number[]>();

function allowRegistration(ip: string) {
  const cutoff = now() - 60 * 60 * 1000;
  const hits = (registrationHits.get(ip) ?? []).filter((time) => time > cutoff);
  if (hits.length >= REGISTER_LIMIT) return false;
  hits.push(now());
  registrationHits.set(ip, hits);
  return true;
}

/* ---------- 注册 / 登录 ---------- */

export const accountRouter = Router();

accountRouter.post('/register', (req: Request, res: Response) => {
  const ip = req.ip ?? 'unknown';
  if (!allowRegistration(ip)) {
    fail(res, 429, '操作过于频繁，请稍后再试');
    return;
  }
  const username = normalizeUsername(req.body?.username);
  const password = normalizePassword(req.body?.password);
  const invalid = usernameError(username) ?? passwordError(password);
  if (invalid) {
    fail(res, 400, invalid);
    return;
  }
  if (findUserByUsername(username)) {
    fail(res, 409, '该用户名已被使用');
    return;
  }
  const result = db
    .prepare("INSERT INTO users (username, password_hash, status, created_at) VALUES (?, ?, 'normal', ?)")
    .run(username, hashPassword(password), now());
  if (!result.changes) {
    fail(res, 500, '注册失败，请稍后重试');
    return;
  }
  const user = findUserByUsername(username);
  if (!user) {
    fail(res, 500, '注册失败，请稍后重试');
    return;
  }
  dropCurrentSession(req);
  createSession(res, user.id);
  const loginAt = now();
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(loginAt, user.id);
  user.last_login_at = loginAt;
  res.status(201).json({ user: publicUser(user) });
});

accountRouter.post('/login', (req: Request, res: Response) => {
  const username = normalizeUsername(req.body?.username);
  const password = normalizePassword(req.body?.password);
  if (!username || !password) {
    fail(res, 400, '请输入用户名和密码');
    return;
  }
  const user = findUserByUsername(username);
  if (!user) {
    fail(res, 401, '用户名或密码不正确');
    return;
  }
  if (user.status !== 'normal') {
    fail(res, 403, '账号已被禁用，请联系管理员');
    return;
  }
  if (user.locked_until && user.locked_until > now()) {
    const minutes = Math.max(1, Math.ceil((user.locked_until - now()) / 60_000));
    fail(res, 423, `尝试次数过多，请 ${minutes} 分钟后再试`);
    return;
  }
  if (user.locked_until) {
    // 锁定时间已过，失败计数重新开始。
    db.prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?').run(user.id);
    user.failed_attempts = 0;
    user.locked_until = null;
  }
  if (!verifyPassword(password, user.password_hash)) {
    const attempts = user.failed_attempts + 1;
    if (attempts >= LOCK_AFTER_FAILURES) {
      db.prepare('UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?')
        .run(attempts, now() + LOCK_MS, user.id);
    } else {
      db.prepare('UPDATE users SET failed_attempts = ? WHERE id = ?').run(attempts, user.id);
    }
    fail(res, 401, '用户名或密码不正确');
    return;
  }
  dropCurrentSession(req);
  createSession(res, user.id);
  db.prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = ? WHERE id = ?')
    .run(now(), user.id);
  res.json({ user: publicUser({ ...user, last_login_at: now(), failed_attempts: 0, locked_until: null }) });
});

accountRouter.post('/logout', (req: Request, res: Response) => {
  dropCurrentSession(req);
  clearSessionCookie(res);
  res.json({ ok: true });
});

accountRouter.get('/me', requireUser, (req: Request, res: Response) => {
  res.json({ user: publicUser((req as AuthedRequest).user!) });
});

/* ---------- 学习进度 ---------- */

function readProgress(userId: number) {
  const completed = db
    .prepare('SELECT lesson_id FROM user_lesson_completions WHERE user_id = ?')
    .all(userId) as Array<{ lesson_id: string }>;
  const scores = db
    .prepare('SELECT lesson_id, correct, total, at FROM user_scores WHERE user_id = ?')
    .all(userId) as Array<{ lesson_id: string; correct: number; total: number; at: number }>;
  const cards = db
    .prepare('SELECT kind, item_id, box, due FROM user_cards WHERE user_id = ?')
    .all(userId) as Array<{ kind: string; item_id: string; box: number; due: number }>;

  const cardMap: Record<string, { box: number; due: number }> = {};
  const sentenceMap: Record<string, { box: number; due: number }> = {};
  for (const card of cards) {
    (card.kind === 'sentence' ? sentenceMap : cardMap)[card.item_id] = { box: card.box, due: card.due };
  }

  const scoreMap: Record<string, { correct: number; total: number; at: number }> = {};
  for (const score of scores) {
    scoreMap[score.lesson_id] = { correct: score.correct, total: score.total, at: score.at };
  }

  return {
    completedLessons: completed.map((row) => row.lesson_id),
    scores: scoreMap,
    cards: cardMap,
    sentenceCards: sentenceMap,
  };
}

function touchStudy(userId: number) {
  db.prepare('UPDATE users SET last_study_at = ? WHERE id = ?').run(now(), userId);
}

function lessonExists(lessonId: string) {
  return Boolean(
    db.prepare('SELECT id FROM lessons WHERE id = ? AND deleted_at IS NULL').get(lessonId),
  );
}

accountRouter.get('/progress', requireUser, (req: Request, res: Response) => {
  res.json(readProgress((req as AuthedRequest).user!.id));
});

accountRouter.post('/progress/lesson', requireUser, (req: Request, res: Response) => {
  const user = (req as AuthedRequest).user!;
  const lessonId = String(req.body?.lessonId ?? '').trim();
  if (!lessonId || !lessonExists(lessonId)) {
    fail(res, 404, '课次不存在或已被删除');
    return;
  }
  db.prepare(
    'INSERT OR IGNORE INTO user_lesson_completions (user_id, lesson_id, completed_at) VALUES (?, ?, ?)',
  ).run(user.id, lessonId, now());
  touchStudy(user.id);
  res.json({ ok: true, completedLessons: readProgress(user.id).completedLessons });
});

accountRouter.post('/progress/score', requireUser, (req: Request, res: Response) => {
  const user = (req as AuthedRequest).user!;
  const lessonId = String(req.body?.lessonId ?? '').trim();
  const correct = Number(req.body?.correct);
  const total = Number(req.body?.total);
  if (!lessonId || !lessonExists(lessonId)) {
    fail(res, 404, '课次不存在或已被删除');
    return;
  }
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0 || correct < 0 || correct > total) {
    fail(res, 400, '测评成绩格式不正确');
    return;
  }
  const at = now();
  db.prepare(
    `INSERT INTO user_scores (user_id, lesson_id, correct, total, at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET correct = excluded.correct, total = excluded.total, at = excluded.at`,
  ).run(user.id, lessonId, correct, total, at);
  touchStudy(user.id);
  res.json({ ok: true, score: { correct, total, at } });
});

accountRouter.post('/progress/card', requireUser, (req: Request, res: Response) => {
  const user = (req as AuthedRequest).user!;
  const kind = String(req.body?.kind ?? '');
  const itemId = String(req.body?.itemId ?? '').trim();
  const grade = String(req.body?.grade ?? '');
  if (kind !== 'vocab' && kind !== 'sentence') {
    fail(res, 400, '卡片类型不正确');
    return;
  }
  if (grade !== 'again' && grade !== 'good') {
    fail(res, 400, '评分不正确');
    return;
  }
  const table = kind === 'vocab' ? 'vocab' : 'sentences';
  if (!itemId || !db.prepare(`SELECT id FROM ${table} WHERE id = ? AND deleted_at IS NULL`).get(itemId)) {
    fail(res, 404, '复习内容不存在或已被删除');
    return;
  }
  const prev = db
    .prepare('SELECT box FROM user_cards WHERE user_id = ? AND kind = ? AND item_id = ?')
    .get(user.id, kind, itemId) as { box: number } | undefined;
  const box = grade === 'good' ? Math.min((prev?.box ?? 0) + 1, 5) : 1;
  const due = now() + BOX_DAYS[box] * DAY_MS;
  db.prepare(
    `INSERT INTO user_cards (user_id, kind, item_id, box, due) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, kind, item_id) DO UPDATE SET box = excluded.box, due = excluded.due`,
  ).run(user.id, kind, itemId, box, due);
  touchStudy(user.id);
  res.json({ ok: true, card: { box, due } });
});

accountRouter.delete('/progress', requireUser, (req: Request, res: Response) => {
  const user = (req as AuthedRequest).user!;
  db.prepare('DELETE FROM user_lesson_completions WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM user_scores WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM user_cards WHERE user_id = ?').run(user.id);
  res.json({ ok: true });
});

/* ---------- 中后台客户管理 ---------- */

function lessonMeta() {
  const rows = db
    .prepare(
      `SELECT l.id, l.title, l.unit_id, l.sort_order, u.title AS unit_title, u.level,
              u.sort_order AS unit_sort, u.id AS unit_id2
       FROM lessons l LEFT JOIN units u ON u.id = l.unit_id
       WHERE l.deleted_at IS NULL`,
    )
    .all() as Array<{
    id: string;
    title: string;
    unit_id: string;
    sort_order: number;
    unit_title: string | null;
    level: string | null;
    unit_sort: number | null;
    unit_id2: string | null;
  }>;
  return new Map(rows.map((row) => [row.id, row]));
}

function unitsWithLessons() {
  return db
    .prepare(
      `SELECT u.id, u.title, u.level, u.sort_order,
              (SELECT COUNT(*) FROM lessons l WHERE l.unit_id = u.id AND l.deleted_at IS NULL) AS total
       FROM units u WHERE u.deleted_at IS NULL ORDER BY u.level, u.sort_order`,
    )
    .all() as Array<{ id: string; title: string; level: string; sort_order: number; total: number }>;
}

function customerSummary(userId: number) {
  const user = findUserById(userId);
  if (!user) return null;

  const lessons = lessonMeta();
  const totalLessons = lessons.size;

  const completions = db
    .prepare('SELECT lesson_id, completed_at FROM user_lesson_completions WHERE user_id = ? ORDER BY completed_at DESC')
    .all(userId) as Array<{ lesson_id: string; completed_at: number }>;
  const completed = completions.filter((row) => lessons.has(row.lesson_id));

  const scores = db
    .prepare('SELECT lesson_id, correct, total, at FROM user_scores WHERE user_id = ? ORDER BY at DESC')
    .all(userId) as Array<{ lesson_id: string; correct: number; total: number; at: number }>;
  const validScores = scores.filter((row) => lessons.has(row.lesson_id));
  const scoreCorrect = validScores.reduce((sum, row) => sum + row.correct, 0);
  const scoreTotal = validScores.reduce((sum, row) => sum + row.total, 0);

  const cardRows = db
    .prepare('SELECT kind, box, due FROM user_cards WHERE user_id = ?')
    .all(userId) as Array<{ kind: string; box: number; due: number }>;
  const cardSummary = (kind: 'vocab' | 'sentence') => {
    const rows = cardRows.filter((row) => row.kind === kind);
    const boxes = [0, 0, 0, 0, 0];
    rows.forEach((row) => {
      if (row.box >= 1 && row.box <= 5) boxes[row.box - 1] += 1;
    });
    return {
      total: rows.length,
      boxes,
      due: rows.filter((row) => row.due <= now()).length,
    };
  };

  const units = unitsWithLessons()
    .filter((unit) => unit.total > 0)
    .map((unit) => {
      const done = completed.filter((row) => lessons.get(row.lesson_id)?.unit_id === unit.id).length;
      return {
        id: unit.id,
        title: unit.title,
        level: unit.level,
        order: unit.sort_order,
        done,
        total: unit.total,
        pct: unit.total ? Math.ceil((done / unit.total) * 100) : 0,
      };
    });

  const completionRate = totalLessons ? Math.ceil((completed.length / totalLessons) * 100) : 0;
  const accuracy = scoreTotal ? Math.round((scoreCorrect / scoreTotal) * 100) : null;

  return {
    user: publicUser(user),
    totalLessons,
    completedCount: completed.length,
    completionRate,
    accuracy,
    dueVocab: cardSummary('vocab').due,
    dueSentence: cardSummary('sentence').due,
    units,
    completedLessons: completed.map((row) => ({
      lessonId: row.lesson_id,
      title: lessons.get(row.lesson_id)?.title ?? row.lesson_id,
      unitTitle: lessons.get(row.lesson_id)?.unit_title ?? '',
      completedAt: row.completed_at,
    })),
    scores: validScores.map((row) => ({
      lessonId: row.lesson_id,
      title: lessons.get(row.lesson_id)?.title ?? row.lesson_id,
      unitTitle: lessons.get(row.lesson_id)?.unit_title ?? '',
      correct: row.correct,
      total: row.total,
      rate: row.total ? Math.round((row.correct / row.total) * 100) : 0,
      at: row.at,
    })),
    cards: {
      vocab: cardSummary('vocab'),
      sentence: cardSummary('sentence'),
    },
  };
}

function customerListRow(userId: number) {
  const completed = db
    .prepare(
      `SELECT COUNT(*) AS n FROM user_lesson_completions c
       JOIN lessons l ON l.id = c.lesson_id AND l.deleted_at IS NULL
       WHERE c.user_id = ?`,
    )
    .get(userId) as { n: number };
  const dueVocab = db
    .prepare("SELECT COUNT(*) AS n FROM user_cards WHERE user_id = ? AND kind = 'vocab' AND due <= ?")
    .get(userId, now()) as { n: number };
  const dueSentence = db
    .prepare("SELECT COUNT(*) AS n FROM user_cards WHERE user_id = ? AND kind = 'sentence' AND due <= ?")
    .get(userId, now()) as { n: number };
  return { completed: completed.n, dueVocab: dueVocab.n, dueSentence: dueSentence.n };
}

export const adminCustomersRouter = Router();

adminCustomersRouter.get('/', (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const pageSize = 20;
  const search = String(req.query.q ?? '').trim();
  const status = String(req.query.status ?? '');

  const where: string[] = [];
  const params: unknown[] = [];
  if (search) {
    where.push('u.username LIKE ?');
    params.push(`%${search}%`);
  }
  if (status === 'normal' || status === 'disabled') {
    where.push('u.status = ?');
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = (db.prepare(`SELECT COUNT(*) AS n FROM users u ${whereSql}`).get(...params) as { n: number }).n;
  const totalLessons = (db.prepare('SELECT COUNT(*) AS n FROM lessons WHERE deleted_at IS NULL').get() as { n: number }).n;

  const users = db
    .prepare(
      `SELECT id, username, status, created_at, last_login_at, last_study_at
       FROM users u ${whereSql}
       ORDER BY (last_study_at IS NULL), last_study_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, pageSize, (page - 1) * pageSize) as UserRow[];

  res.json({
    users: users.map((user) => ({
      ...publicUser(user),
      ...customerListRow(user.id),
    })),
    total,
    totalLessons,
    page,
    pageSize,
  });
});

adminCustomersRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const summary = Number.isInteger(id) ? customerSummary(id) : null;
  if (!summary) {
    fail(res, 404, '客户不存在或已被删除');
    return;
  }
  res.json(summary);
});

adminCustomersRouter.patch('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? findUserById(id) : undefined;
  if (!user) {
    fail(res, 404, '客户不存在或已被删除');
    return;
  }
  const status = String(req.body?.status ?? '');
  if (status !== 'normal' && status !== 'disabled') {
    fail(res, 400, '状态不正确');
    return;
  }
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
  if (status === 'disabled') {
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id);
  }
  res.json({ ok: true, status });
});

adminCustomersRouter.post('/:id/reset-password', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? findUserById(id) : undefined;
  if (!user) {
    fail(res, 404, '客户不存在或已被删除');
    return;
  }
  const password = normalizePassword(req.body?.password);
  const confirm = normalizePassword(req.body?.confirmPassword);
  const invalid = passwordError(password);
  if (invalid) {
    fail(res, 400, invalid);
    return;
  }
  if (confirm !== password) {
    fail(res, 400, '两次输入的密码不一致');
    return;
  }
  db.prepare('UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?')
    .run(hashPassword(password), id);
  db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id);
  res.json({ ok: true });
});

adminCustomersRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? findUserById(id) : undefined;
  if (!user) {
    fail(res, 404, '客户不存在或已被删除');
    return;
  }
  const confirmName = normalizeUsername(req.body?.username);
  if (!confirmName || confirmName.toLowerCase() !== user.username.toLowerCase()) {
    fail(res, 400, '请输入完整用户名以确认删除');
    return;
  }
  db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM user_lesson_completions WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM user_scores WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM user_cards WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ ok: true });
});
