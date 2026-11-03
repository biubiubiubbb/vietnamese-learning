import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DATA_DIR = path.join(ROOT, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const ROOT_DIR = ROOT;
export const DATA_DIR_PATH = DATA_DIR;
type DbResult = { changes: number };
type DbStatement = {
  run(...params: any[]): DbResult;
  get(...params: any[]): any;
  all(...params: any[]): any[];
};
type DbClient = {
  prepare(sql: string): DbStatement;
  exec(sql: string): void;
};

const rawDb = new DatabaseSync(path.join(DATA_DIR, 'app.db'));

/** node:sqlite 的入参/返回值类型过于严格，这里统一按动态类型封装。 */
export const db = rawDb as unknown as DbClient;

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    level TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    deleted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    unit_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    goals TEXT NOT NULL DEFAULT '[]',
    vocab_ids TEXT NOT NULL DEFAULT '[]',
    grammar TEXT NOT NULL DEFAULT '[]',
    dialogues TEXT NOT NULL DEFAULT '[]',
    exercises TEXT NOT NULL DEFAULT '[]',
    deleted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS vocab (
    id TEXT PRIMARY KEY,
    vi TEXT NOT NULL,
    zh TEXT NOT NULL,
    pos TEXT NOT NULL,
    han_viet TEXT,
    example_vi TEXT,
    example_zh TEXT,
    note TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    deleted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS sentences (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    vi TEXT NOT NULL,
    zh TEXT NOT NULL,
    tag TEXT NOT NULL,
    chunks TEXT NOT NULL DEFAULT '[]',
    note TEXT,
    exercises TEXT NOT NULL DEFAULT '[]',
    deleted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS pronunciation (
    key TEXT PRIMARY KEY,
    payload TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audio_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    voice TEXT NOT NULL,
    data BLOB NOT NULL,
    mime TEXT NOT NULL DEFAULT 'audio/mpeg',
    source TEXT NOT NULL DEFAULT 'generated',
    status TEXT NOT NULL DEFAULT 'ready',
    enabled INTEGER NOT NULL DEFAULT 1,
    error TEXT,
    updated_at INTEGER NOT NULL,
    UNIQUE (text, voice)
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons (unit_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_sentences_lesson ON sentences (lesson_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_audio_status ON audio_assets (status, enabled);
`);

export function jsonParse<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function now(): number {
  return Date.now();
}
