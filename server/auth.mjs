import crypto from 'node:crypto';
import { db, now } from './db.mjs';

const SESSION_COOKIE = 'admin_session';
const SESSION_DAYS = 7;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

export function ensureAdminUser() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM admin_users').get().n;
  if (count > 0) return;
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  db.prepare('INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)')
    .run(username, hashPassword(password), now());
  console.log(`[admin] 已创建后台账号 ${username} / ${password}（可通过 ADMIN_USERNAME / ADMIN_PASSWORD 修改）`);
}

export function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function createSession(res) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare('INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)')
    .run(token, now(), expiresAt);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  );
  return token;
}

export function getSession(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const row = db.prepare('SELECT token, expires_at FROM admin_sessions WHERE token = ?').get(token);
  if (!row) return null;
  if (row.expires_at <= now()) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
    return null;
  }
  return row;
}

export function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (token) db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

export function login(req, res) {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    res.status(400).json({ error: '请输入账号和密码' });
    return;
  }
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(String(username));
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    res.status(401).json({ error: '账号或密码不正确' });
    return;
  }
  createSession(res);
  res.json({ username: user.username });
}

export function requireAdmin(req, res, next) {
  if (!getSession(req)) {
    res.status(401).json({ error: '未登录或登录已过期' });
    return;
  }
  next();
}

export function me(req, res) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  res.json({ ok: true });
}
