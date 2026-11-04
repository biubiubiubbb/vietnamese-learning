import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db, now } from './db';

const SESSION_COOKIE = 'admin_session';
const SESSION_DAYS = 7;

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

export function cookieAttrs(maxAge: number) {
  const sameSite = process.env.COOKIE_SAMESITE ?? 'Lax';
  const secure = process.env.COOKIE_SECURE === '1' ? '; Secure' : '';
  return `HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=${maxAge}${secure}`;
}

export function ensureAdminUser() {
  const count = (db.prepare('SELECT COUNT(*) AS n FROM admin_users').get() as { n: number }).n;
  if (count > 0) return;
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  db.prepare('INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)')
    .run(username, hashPassword(password), now());
  console.log(`[admin] 已创建后台账号 ${username} / ${password}（可通过 ADMIN_USERNAME / ADMIN_PASSWORD 修改）`);
}

export function parseCookies(header = '') {
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function createSession(res: Response) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare('INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)')
    .run(token, now(), expiresAt);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; ${cookieAttrs(SESSION_DAYS * 24 * 60 * 60)}`,
  );
  return token;
}

export function getSession(req: Request) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const row = db.prepare('SELECT token, expires_at FROM admin_sessions WHERE token = ?').get(token) as
    | { token: string; expires_at: number }
    | undefined;
  if (!row) return null;
  if (row.expires_at <= now()) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
    return null;
  }
  return row;
}

export function destroySession(req: Request, res: Response) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (token) db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; ${cookieAttrs(0)}`);
}

export function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    res.status(400).json({ error: '请输入账号和密码' });
    return;
  }
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(String(username)) as
    | { username: string; password_hash: string }
    | undefined;
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    res.status(401).json({ error: '账号或密码不正确' });
    return;
  }
  createSession(res);
  res.json({ username: user.username });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!getSession(req)) {
    res.status(401).json({ error: '未登录或登录已过期' });
    return;
  }
  next();
}

export function me(req: Request, res: Response) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  res.json({ ok: true });
}
