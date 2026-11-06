import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { db, jsonParse, now, DATA_DIR_PATH } from './db';
import { ensureAdminUser, login, me, destroySession, requireAdmin } from './auth';
import { accountRouter, adminCustomersRouter } from './accounts';
import { seedIfEmpty } from './seed';
import {
  getContent,
  getCounts,
  getAudioHealth,
  getConfig,
  saveConfig,
  clearBackgroundConfig,
  getPronunciation,
  savePronunciation,
  getTrash,
  mapUnit,
  mapLesson,
  mapVocab,
  mapSentence,
} from './contentDb';
import {
  syncAudio,
  regenerate,
  saveRecording,
  setAudioEnabled,
  getAudioIndex,
  getAudioRow,
  listAudioGroups,
} from './audio';

const PORT = Number(process.env.PORT ?? 8787);
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const app = express();
// 部署在反向代理（Railway / Nginx 等）之后时，必须信任代理转发的 X-Forwarded-For，
// 否则 req.ip 恒为代理地址，注册限流会变成所有用户共享的全局额度。
app.set('trust proxy', process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : 1);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});
const BACKGROUND_FILE = path.join(DATA_DIR_PATH, 'background.img');
const IMAGE_MIMES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '20mb' }));

let syncTimer: NodeJS.Timeout | null = null;
function scheduleAudioSync(delay = 600) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    syncAudio();
  }, delay);
}

function fail(res: Response, status: number, message: string) {
  res.status(status).json({ error: message });
}

function requireBody(body: Record<string, any>, fields: string[]) {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      return `${field} 不能为空`;
    }
  }
  return null;
}

function idError(id: unknown) {
  return /^[A-Za-z0-9_-]{2,64}$/.test(String(id ?? '')) ? null : 'ID 只能包含字母、数字、_ 和 -，长度 2-64';
}

function uniqueError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (message.includes('UNIQUE')) return 'ID 已存在，请换一个';
  return null;
}

/* ---------- 登录 ---------- */

app.post('/api/auth/login', login);
app.post('/api/auth/logout', (req: Request, res: Response) => {
  destroySession(req, res);
  res.json({ ok: true });
});
app.get('/api/auth/me', me);

/* ---------- 客户账号 ---------- */

app.use('/api/account', accountRouter);

/* ---------- 前端公开内容 ---------- */

app.get('/api/content', (_req: Request, res: Response) => {
  res.json(getContent());
});

app.get('/api/config', (_req: Request, res: Response) => {
  res.json(getConfig());
});

app.get('/api/background', (_req: Request, res: Response) => {
  const config = getConfig();
  if (!config.backgroundImage || !fs.existsSync(BACKGROUND_FILE)) {
    return fail(res, 404, '未设置背景图');
  }
  res.setHeader('Content-Type', config.backgroundMime || 'image/jpeg');
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(BACKGROUND_FILE).pipe(res);
});

app.get('/api/audio/index', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(getAudioIndex());
});

app.get('/api/audio/:id', (req: Request, res: Response) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row || !row.enabled || row.status !== 'ready' || !row.data?.length) {
    fail(res, 404, '音频不存在');
    return;
  }
  res.setHeader('Content-Type', row.mime || 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.send(Buffer.from(row.data));
});

/* ---------- 后台 ---------- */

app.use('/api/admin', requireAdmin);

app.use('/api/admin/customers', adminCustomersRouter);

app.get('/api/admin/overview', (_req: Request, res: Response) => {
  res.json({
    counts: getCounts(),
    audio: getAudioHealth(),
    config: getConfig(),
  });
});

/* 单元 */

app.get('/api/admin/units', (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === '1';
  const rows = db.prepare(
    `SELECT * FROM units ${includeDeleted ? '' : 'WHERE deleted_at IS NULL'} ORDER BY level, sort_order`,
  ).all();
  res.json(rows.map(mapUnit));
});

app.post('/api/admin/units', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['id', 'level', 'title']);
  if (error) return fail(res, 400, error);
  const invalid = idError(req.body.id);
  if (invalid) return fail(res, 400, invalid);
  try {
    db.prepare('INSERT INTO units (id, level, sort_order, title, subtitle) VALUES (?, ?, ?, ?, ?)')
      .run(req.body.id, req.body.level, Number(req.body.order ?? 0), req.body.title, req.body.subtitle ?? '');
  } catch (e) {
    return fail(res, 409, uniqueError(e) ?? '保存失败');
  }
  const row = db.prepare('SELECT * FROM units WHERE id = ?').get(req.body.id);
  res.status(201).json(mapUnit(row));
});

app.put('/api/admin/units/:id', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['level', 'title']);
  if (error) return fail(res, 400, error);
  const result = db.prepare(
    'UPDATE units SET level = ?, sort_order = ?, title = ?, subtitle = ? WHERE id = ?',
  ).run(req.body.level, Number(req.body.order ?? 0), req.body.title, req.body.subtitle ?? '', req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json(mapUnit(db.prepare('SELECT * FROM units WHERE id = ?').get(req.params.id)));
});

app.delete('/api/admin/units/:id', (req: Request, res: Response) => {
  const lessons = db.prepare('SELECT COUNT(*) AS n FROM lessons WHERE unit_id = ? AND deleted_at IS NULL').get(req.params.id).n;
  if (lessons > 0) return fail(res, 409, `该单元下还有 ${lessons} 节课，请先移动或删除课程`);
  const result = db.prepare('UPDATE units SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json({ ok: true });
});

app.post('/api/admin/units/:id/restore', (req: Request, res: Response) => {
  const result = db.prepare('UPDATE units SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json({ ok: true });
});

app.post('/api/admin/units/reorder', (req: Request, res: Response) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  db.exec('BEGIN');
  try {
    ids.forEach((id: string, index: number) => {
      db.prepare('UPDATE units SET sort_order = ? WHERE id = ?').run(index, id);
    });
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return fail(res, 500, '排序保存失败');
  }
  res.json({ ok: true });
});

/* 课程 */

app.get('/api/admin/lessons', (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === '1';
  const unitId = req.query.unitId;
  const where = [];
  const params = [];
  if (!includeDeleted) where.push('deleted_at IS NULL');
  if (unitId) {
    where.push('unit_id = ?');
    params.push(unitId);
  }
  const rows = db.prepare(
    `SELECT * FROM lessons ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY unit_id, sort_order`,
  ).all(...params);
  res.json(rows.map(mapLesson));
});

app.post('/api/admin/lessons', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['id', 'unitId', 'title']);
  if (error) return fail(res, 400, error);
  const invalid = idError(req.body.id);
  if (invalid) return fail(res, 400, invalid);
  if (!db.prepare('SELECT id FROM units WHERE id = ? AND deleted_at IS NULL').get(req.body.unitId)) {
    return fail(res, 400, '所属单元不存在');
  }
  try {
    db.prepare(
      `INSERT INTO lessons
       (id, unit_id, sort_order, title, goals, vocab_ids, grammar, dialogues, exercises)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      req.body.id,
      req.body.unitId,
      Number(req.body.order ?? 0),
      req.body.title,
      JSON.stringify(req.body.goals ?? []),
      JSON.stringify(req.body.vocabIds ?? []),
      JSON.stringify(req.body.grammar ?? []),
      JSON.stringify(req.body.dialogues ?? []),
      JSON.stringify(req.body.exercises ?? []),
    );
  } catch (e) {
    return fail(res, 409, uniqueError(e) ?? '保存失败');
  }
  const row = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.body.id);
  res.status(201).json(mapLesson(row));
});

app.put('/api/admin/lessons/:id', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['unitId', 'title']);
  if (error) return fail(res, 400, error);
  if (!db.prepare('SELECT id FROM units WHERE id = ? AND deleted_at IS NULL').get(req.body.unitId)) {
    return fail(res, 400, '所属单元不存在');
  }
  const result = db.prepare(
    `UPDATE lessons SET unit_id = ?, sort_order = ?, title = ?, goals = ?, vocab_ids = ?,
       grammar = ?, dialogues = ?, exercises = ? WHERE id = ?`,
  ).run(
    req.body.unitId,
    Number(req.body.order ?? 0),
    req.body.title,
    JSON.stringify(req.body.goals ?? []),
    JSON.stringify(req.body.vocabIds ?? []),
    JSON.stringify(req.body.grammar ?? []),
    JSON.stringify(req.body.dialogues ?? []),
    JSON.stringify(req.body.exercises ?? []),
    req.params.id,
  );
  if (!result.changes) return fail(res, 404, '课程不存在');
  scheduleAudioSync();
  res.json(mapLesson(db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id)));
});

app.delete('/api/admin/lessons/:id', (req: Request, res: Response) => {
  const sentences = db.prepare('SELECT COUNT(*) AS n FROM sentences WHERE lesson_id = ? AND deleted_at IS NULL').get(req.params.id).n;
  if (sentences > 0) return fail(res, 409, `该课程下还有 ${sentences} 个句子，请先移动或删除句子`);
  const result = db.prepare('UPDATE lessons SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '课程不存在');
  res.json({ ok: true });
});

/**
 * 恢复课程前的依赖校验（单元、关联词条必须存在）。
 * 专属恢复接口与回收站批量恢复都必须走同一套校验，否则会产生无归属单元的孤儿课程。
 */
function lessonRestoreIssue(id: string): { status: number; message: string } | null {
  const lesson = db.prepare('SELECT unit_id, vocab_ids FROM lessons WHERE id = ?').get(id);
  if (!lesson) return { status: 404, message: '课程不存在' };
  const unit = db.prepare('SELECT id FROM units WHERE id = ? AND deleted_at IS NULL').get(lesson.unit_id);
  if (!unit) return { status: 409, message: '所属单元已删除，请先恢复单元' };
  const missingVocab = jsonParse<string[]>(lesson.vocab_ids, [])
    .filter((vocabId) => !db.prepare('SELECT id FROM vocab WHERE id = ? AND deleted_at IS NULL').get(vocabId));
  if (missingVocab.length > 0) {
    return { status: 409, message: `引用的词条已删除：${missingVocab.join('、')}，请先恢复词条` };
  }
  return null;
}

app.post('/api/admin/lessons/:id/restore', (req: Request, res: Response) => {
  const issue = lessonRestoreIssue(String(req.params.id));
  if (issue) return fail(res, issue.status, issue.message);
  db.prepare('UPDATE lessons SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/lessons/reorder', (req: Request, res: Response) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  db.exec('BEGIN');
  try {
    ids.forEach((id: string, index: number) => {
      db.prepare('UPDATE lessons SET sort_order = ? WHERE id = ?').run(index, id);
    });
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return fail(res, 500, '排序保存失败');
  }
  res.json({ ok: true });
});

/* 词汇 */

app.get('/api/admin/vocab', (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === '1';
  const q = req.query.q ? `%${req.query.q}%` : null;
  const where = [];
  const params = [];
  if (!includeDeleted) where.push('deleted_at IS NULL');
  if (q) {
    where.push('(id LIKE ? OR vi LIKE ? OR zh LIKE ?)');
    params.push(q, q, q);
  }
  const rows = db.prepare(
    `SELECT * FROM vocab ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id`,
  ).all(...params);
  res.json(rows.map(mapVocab));
});

app.post('/api/admin/vocab', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['id', 'vi', 'zh', 'pos']);
  if (error) return fail(res, 400, error);
  const invalid = idError(req.body.id);
  if (invalid) return fail(res, 400, invalid);
  try {
    db.prepare(
      `INSERT INTO vocab (id, vi, zh, pos, han_viet, example_vi, example_zh, note, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      req.body.id,
      req.body.vi.trim(),
      req.body.zh.trim(),
      req.body.pos,
      req.body.hanViet || null,
      req.body.example?.vi || null,
      req.body.example?.zh || null,
      req.body.note || null,
      JSON.stringify(req.body.tags ?? []),
    );
  } catch (e) {
    return fail(res, 409, uniqueError(e) ?? '保存失败');
  }
  scheduleAudioSync();
  const row = db.prepare('SELECT * FROM vocab WHERE id = ?').get(req.body.id);
  res.status(201).json(mapVocab(row));
});

app.put('/api/admin/vocab/:id', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['vi', 'zh', 'pos']);
  if (error) return fail(res, 400, error);
  const result = db.prepare(
    `UPDATE vocab SET vi = ?, zh = ?, pos = ?, han_viet = ?, example_vi = ?, example_zh = ?, note = ?, tags = ?
     WHERE id = ?`,
  ).run(
    req.body.vi.trim(),
    req.body.zh.trim(),
    req.body.pos,
    req.body.hanViet || null,
    req.body.example?.vi || null,
    req.body.example?.zh || null,
    req.body.note || null,
    JSON.stringify(req.body.tags ?? []),
    req.params.id,
  );
  if (!result.changes) return fail(res, 404, '词条不存在');
  scheduleAudioSync();
  res.json(mapVocab(db.prepare('SELECT * FROM vocab WHERE id = ?').get(req.params.id)));
});

function vocabReferences(id: string) {
  const lessons = db.prepare('SELECT id, title, deleted_at FROM lessons').all()
    .filter((row: any) => jsonParse<string[]>(row.vocab_ids, []).includes(id))
    .map((row: any) => ({ type: 'lesson', id: row.id, title: row.title, deleted: Boolean(row.deleted_at) }));
  const sentences = db.prepare('SELECT id, vi, chunks, deleted_at FROM sentences').all()
    .filter((row: any) => jsonParse<any[]>(row.chunks, []).some((chunk: any) => chunk.vocabId === id))
    .map((row: any) => ({ type: 'sentence', id: row.id, title: row.vi, deleted: Boolean(row.deleted_at) }));
  return [...lessons, ...sentences];
}

app.get('/api/admin/vocab/:id/references', (req: Request, res: Response) => {
  res.json(vocabReferences(String(req.params.id)));
});

app.delete('/api/admin/vocab/:id', (req: Request, res: Response) => {
  const refs = vocabReferences(String(req.params.id));
  if (refs.length > 0) {
    const trashed = refs.filter((ref) => ref.deleted).length;
    const suffix = trashed > 0 ? `（其中 ${trashed} 处在回收站）` : '';
    return fail(res, 409, `该词条被 ${refs.length} 处引用${suffix}，请先解除引用`);
  }
  const result = db.prepare('UPDATE vocab SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '词条不存在');
  res.json({ ok: true });
});

app.post('/api/admin/vocab/:id/restore', (req: Request, res: Response) => {
  const result = db.prepare('UPDATE vocab SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '词条不存在');
  res.json({ ok: true });
});

/* 句子 */

app.get('/api/admin/sentences', (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === '1';
  const lessonId = req.query.lessonId;
  const where = [];
  const params = [];
  if (!includeDeleted) where.push('deleted_at IS NULL');
  if (lessonId) {
    where.push('lesson_id = ?');
    params.push(lessonId);
  }
  const rows = db.prepare(
    `SELECT * FROM sentences ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY lesson_id, sort_order`,
  ).all(...params);
  res.json(rows.map(mapSentence));
});

app.post('/api/admin/sentences', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['id', 'lessonId', 'vi', 'zh', 'tag']);
  if (error) return fail(res, 400, error);
  const invalid = idError(req.body.id);
  if (invalid) return fail(res, 400, invalid);
  if (!db.prepare('SELECT id FROM lessons WHERE id = ? AND deleted_at IS NULL').get(req.body.lessonId)) {
    return fail(res, 400, '所属课程不存在');
  }
  try {
    db.prepare(
      `INSERT INTO sentences (id, lesson_id, sort_order, vi, zh, tag, chunks, note, exercises)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      req.body.id,
      req.body.lessonId,
      Number(req.body.order ?? 0),
      req.body.vi.trim(),
      req.body.zh.trim(),
      req.body.tag,
      JSON.stringify(req.body.chunks ?? []),
      req.body.note || null,
      JSON.stringify(req.body.exercises ?? []),
    );
  } catch (e) {
    return fail(res, 409, uniqueError(e) ?? '保存失败');
  }
  scheduleAudioSync();
  res.status(201).json(mapSentence(db.prepare('SELECT * FROM sentences WHERE id = ?').get(req.body.id)));
});

app.put('/api/admin/sentences/:id', (req: Request, res: Response) => {
  const error = requireBody(req.body, ['lessonId', 'vi', 'zh', 'tag']);
  if (error) return fail(res, 400, error);
  const result = db.prepare(
    `UPDATE sentences SET lesson_id = ?, sort_order = ?, vi = ?, zh = ?, tag = ?, chunks = ?, note = ?, exercises = ?
     WHERE id = ?`,
  ).run(
    req.body.lessonId,
    Number(req.body.order ?? 0),
    req.body.vi.trim(),
    req.body.zh.trim(),
    req.body.tag,
    JSON.stringify(req.body.chunks ?? []),
    req.body.note || null,
    JSON.stringify(req.body.exercises ?? []),
    req.params.id,
  );
  if (!result.changes) return fail(res, 404, '句子不存在');
  scheduleAudioSync();
  res.json(mapSentence(db.prepare('SELECT * FROM sentences WHERE id = ?').get(req.params.id)));
});

app.delete('/api/admin/sentences/:id', (req: Request, res: Response) => {
  const result = db.prepare('UPDATE sentences SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '句子不存在');
  res.json({ ok: true });
});

app.post('/api/admin/sentences/:id/restore', (req: Request, res: Response) => {
  const sentence = db.prepare('SELECT lesson_id FROM sentences WHERE id = ?').get(req.params.id);
  if (!sentence) return fail(res, 404, '句子不存在');
  const lesson = db.prepare('SELECT id FROM lessons WHERE id = ? AND deleted_at IS NULL').get(sentence.lesson_id);
  if (!lesson) return fail(res, 409, '所属课程已删除，请先恢复课程');
  db.prepare('UPDATE sentences SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* 发音中心 */

app.get('/api/admin/pronunciation', (_req: Request, res: Response) => {
  res.json(getPronunciation());
});

app.put('/api/admin/pronunciation/:key', (req: Request, res: Response) => {
  const allowed = ['alphabet', 'tones', 'consonantGroups', 'vowelGroups', 'minimalPairs', 'toneRules'];
  if (!allowed.includes(String(req.params.key))) return fail(res, 400, '未知的发音模块');
  if (!Array.isArray(req.body.payload)) return fail(res, 400, '内容必须是数组');
  savePronunciation(String(req.params.key), req.body.payload);
  scheduleAudioSync();
  res.json({ ok: true });
});

/* 音频 */

app.get('/api/admin/audio', (req: Request, res: Response) => {
  res.json(listAudioGroups({
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    type: typeof req.query.type === 'string' ? req.query.type : undefined,
    page: Number(req.query.page) || undefined,
    pageSize: Number(req.query.pageSize) || undefined,
  }));
});

app.post('/api/admin/audio/regenerate', (req: Request, res: Response) => {
  const text = String(req.body.text ?? '').trim();
  const voices = (Array.isArray(req.body.voices) ? req.body.voices : [])
    .filter((voice: unknown) => voice === 'female' || voice === 'male');
  const uniqueVoices = [...new Set(voices)];
  if (!text || uniqueVoices.length === 0) return fail(res, 400, '缺少朗读文本或音色');
  for (const voice of uniqueVoices) regenerate(text, String(voice));
  res.json({ queued: uniqueVoices.length });
});

app.post('/api/admin/audio/:id/regenerate', (req: Request, res: Response) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row) return fail(res, 404, '音频不存在');
  if (row.voice === 'human') return fail(res, 400, '人声音频请重新录音');
  regenerate(row.text, row.voice);
  res.json({ ok: true });
});

app.post('/api/admin/audio/regenerate-all', (_req: Request, res: Response) => {
  const result = syncAudio();
  res.json(result);
});

app.post('/api/admin/audio/record', upload.single('file'), (req: Request, res: Response) => {
  const text = String(req.body.text ?? '').trim();
  const voice =
    req.body.voice === 'male' ? 'male'
      : req.body.voice === 'female' ? 'female'
        : req.body.voice === 'human' ? 'human'
          : null;
  if (!text || !voice || !req.file?.buffer?.length) {
    return fail(res, 400, '缺少朗读文本、音色或录音文件');
  }
  saveRecording(text, voice, req.file.buffer, req.file.mimetype || 'audio/webm');
  res.json({ ok: true });
});

app.patch('/api/admin/audio/:id', (req: Request, res: Response) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row) return fail(res, 404, '音频不存在');
  setAudioEnabled(row.id, Boolean(req.body.enabled));
  res.json({ ok: true });
});

app.get('/api/admin/audio/:id/stream', (req: Request, res: Response) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row || !row.data?.length) return fail(res, 404, '音频不存在');
  res.setHeader('Content-Type', row.mime || 'audio/mpeg');
  res.setHeader('Cache-Control', 'no-store');
  res.send(Buffer.from(row.data));
});

/* 配置与回收站 */

app.get('/api/admin/config', (_req: Request, res: Response) => {
  res.json(getConfig());
});

app.put('/api/admin/config', (req: Request, res: Response) => {
  res.json(saveConfig(req.body ?? {}));
});

app.post('/api/admin/config/background', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return fail(res, 400, '请选择图片');
  const mime = req.file.mimetype;
  if (!IMAGE_MIMES[mime]) return fail(res, 400, '仅支持 JPG / PNG / WebP / GIF / AVIF');
  fs.writeFileSync(BACKGROUND_FILE, req.file.buffer);
  res.json(
    saveConfig({
      backgroundImage: `/api/background?v=${Date.now()}`,
      backgroundMime: mime,
    }),
  );
});

app.delete('/api/admin/config/background', (_req: Request, res: Response) => {
  fs.rmSync(BACKGROUND_FILE, { force: true });
  res.json(clearBackgroundConfig());
});

app.get('/api/admin/trash', (_req: Request, res: Response) => {
  res.json(getTrash());
});

app.post('/api/admin/trash/:type/:id/restore', (req: Request, res: Response) => {
  const tables: Record<string, string> = { units: 'units', lessons: 'lessons', vocab: 'vocab', sentences: 'sentences' };
  const type = String(req.params.type);
  const table = tables[type];
  if (!table) return fail(res, 400, '未知类型');
  // 回收站批量恢复与专属恢复接口共用同一套依赖校验，避免恢复出孤儿内容。
  if (type === 'lessons') {
    const issue = lessonRestoreIssue(String(req.params.id));
    if (issue) return fail(res, issue.status, issue.message);
  }
  if (type === 'sentences') {
    const sentence = db.prepare('SELECT lesson_id FROM sentences WHERE id = ?').get(req.params.id);
    if (!sentence) return fail(res, 404, '内容不存在');
    const lesson = db.prepare('SELECT id FROM lessons WHERE id = ? AND deleted_at IS NULL').get(sentence.lesson_id);
    if (!lesson) return fail(res, 409, '所属课程已删除，请先恢复课程');
  }
  const result = db.prepare(`UPDATE ${table} SET deleted_at = NULL WHERE id = ?`).run(req.params.id);
  if (!result.changes) return fail(res, 404, '内容不存在');
  res.json({ ok: true });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server]', err);
  res.status(500).json({ error: err?.message ?? '服务器错误' });
});

ensureAdminUser();
await seedIfEmpty();
syncAudio();

app.listen(PORT, () => {
  console.log(`[server] 中后台 API 已启动：http://127.0.0.1:${PORT}`);
});
