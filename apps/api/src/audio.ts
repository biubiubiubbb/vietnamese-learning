import { db, now } from './db';
import { collectReadableTexts } from './contentDb';
import { synthesize, VOICES } from './tts';

type AudioJob = { text: string; voice: string };
type Row = Record<string, any>;

const VOICE_KEYS = Object.keys(VOICES);
const queue: AudioJob[] = [];
const queued = new Set<string>();
let running = 0;
const CONCURRENCY = Number(process.env.AUDIO_CONCURRENCY) || 4;

function keyOf(text: string, voice: string) {
  return `${voice}:${text}`;
}

function enqueue(text: string, voice: string) {
  const key = keyOf(text, voice);
  if (queued.has(key)) return;
  queued.add(key);
  queue.push({ text, voice });
  pump();
}

async function synthesizeWithRetry(text: string, voice: string) {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await synthesize(text, voice);
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      // Edge 语音服务偶发连接超时，指数退避后重试
      const delay = Math.min(20_000, 2_000 * 2 ** (attempt - 1)) + Math.random() * 1_000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('音频生成失败');
}

async function runJob(job: AudioJob) {
  const { text, voice } = job;
  try {
    const buffer = await synthesizeWithRetry(text, voice);
    db.prepare(
      `UPDATE audio_assets
       SET data = ?, mime = 'audio/mpeg', source = CASE WHEN source = 'recorded' THEN source ELSE 'generated' END,
           status = 'ready', enabled = 1, error = NULL, updated_at = ?
       WHERE text = ? AND voice = ?`,
    ).run(buffer, now(), text, voice);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    db.prepare(
      `UPDATE audio_assets SET status = 'failed', error = ?, updated_at = ? WHERE text = ? AND voice = ?`,
    ).run(message, now(), text, voice);
    console.error(`[audio] 生成失败 ${voice} / ${text}：`, message);
  } finally {
    queued.delete(keyOf(text, voice));
  }
}

function pump() {
  while (running < CONCURRENCY && queue.length > 0) {
    const job = queue.shift();
    if (!job) break;
    running += 1;
    runJob(job).finally(() => {
      running -= 1;
      pump();
    });
  }
}

function ensureRow(text: string, voice: string): Row {
  const row = db.prepare('SELECT status FROM audio_assets WHERE text = ? AND voice = ?').get(text, voice) as Row | undefined;
  if (row) return row;
  db.prepare(
    `INSERT INTO audio_assets (text, voice, data, mime, source, status, enabled, updated_at)
     VALUES (?, ?, ?, 'audio/mpeg', 'generated', 'pending', 1, ?)`,
  ).run(text, voice, Buffer.alloc(0), now());
  return { status: 'pending' };
}

/** 扫描全部可朗读文本，补齐缺失或失败的双音色音频。 */
export function syncAudio({ force = false }: { force?: boolean } = {}) {
  const texts = collectReadableTexts();
  let added = 0;
  for (const text of texts) {
    for (const voice of VOICE_KEYS) {
      const row = ensureRow(text, voice);
      if (row.status === 'generating') continue;
      if (force || row.status === 'pending' || row.status === 'failed') {
        db.prepare(
          `UPDATE audio_assets SET status = 'pending', error = NULL WHERE text = ? AND voice = ?`,
        ).run(text, voice);
        enqueue(text, voice);
        added += 1;
      }
    }
  }
  return { texts: texts.length, queued: added };
}

export function regenerate(text: string, voice: string) {
  const row = db.prepare('SELECT id FROM audio_assets WHERE text = ? AND voice = ?').get(text, voice);
  if (!row) {
    ensureRow(text, voice);
  }
  db.prepare(
    `UPDATE audio_assets SET status = 'pending', error = NULL, enabled = 1 WHERE text = ? AND voice = ?`,
  ).run(text, voice);
  enqueue(text, voice);
}

export function saveRecording(text: string, voice: string, buffer: Buffer, mime = 'audio/webm') {
  db.prepare(
    `INSERT INTO audio_assets (text, voice, data, mime, source, status, enabled, updated_at)
     VALUES (?, ?, ?, ?, 'recorded', 'ready', 1, ?)
     ON CONFLICT(text, voice) DO UPDATE SET
       data = excluded.data, mime = excluded.mime, source = 'recorded',
       status = 'ready', enabled = 1, error = NULL, updated_at = excluded.updated_at`,
  ).run(text, voice, buffer, mime, now());
}

export function setAudioEnabled(id: string | number, enabled: boolean) {
  db.prepare('UPDATE audio_assets SET enabled = ?, updated_at = ? WHERE id = ?')
    .run(enabled ? 1 : 0, now(), id);
}

export function getAudioIndex() {
  const rows = db.prepare(
    `SELECT id, text, voice FROM audio_assets
     WHERE enabled = 1 AND status = 'ready' AND length(data) > 0`,
  ).all() as Row[];
  const index: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!index[row.text]) index[row.text] = {};
    index[row.text][row.voice] = `/api/audio/${row.id}`;
  }
  return index;
}

export function getAudioRow(id: string | number) {
  return db.prepare('SELECT * FROM audio_assets WHERE id = ?').get(id);
}

function mapAudioAsset(row: Row) {
  if (!row) return null;
  return {
    id: row.id,
    voice: row.voice,
    mime: row.mime,
    source: row.source,
    status: row.status,
    enabled: Boolean(row.enabled),
    error: row.error ?? null,
    updatedAt: row.updated_at,
    bytes: row.bytes,
  };
}

/** 按文本分组分页：同一句/词只占一行，包含女声、男声、人声三列。 */
export function listAudioGroups(
  { status, q, page = 1, pageSize = 20 }: { status?: string; q?: string; page?: number; pageSize?: number } = {},
) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (q) {
    where.push('text LIKE ?');
    params.push(`%${q}%`);
  }
  if (status === 'disabled') {
    where.push('enabled = 0');
  } else if (status) {
    where.push('status = ? AND enabled = 1');
    params.push(status);
  }
  const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = db.prepare(`SELECT COUNT(DISTINCT text) AS n FROM audio_assets ${filter}`).get(...params).n;
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(10, Number(pageSize) || 20));
  const offset = (safePage - 1) * safeSize;
  const texts = db.prepare(
    `SELECT text, MAX(updated_at) AS last FROM audio_assets ${filter}
     GROUP BY text ORDER BY last DESC, text LIMIT ? OFFSET ?`,
  ).all(...params, safeSize, offset);

  const items = texts.map(({ text }) => {
    const assets = db.prepare(
      `SELECT id, voice, mime, source, status, enabled, error, updated_at, length(data) AS bytes
       FROM audio_assets WHERE text = ?`,
    ).all(text);
    const byVoice = Object.fromEntries(assets.map((row) => [row.voice, mapAudioAsset(row)]));
    return {
      text,
      female: byVoice.female ?? null,
      male: byVoice.male ?? null,
      human: byVoice.human ?? null,
    };
  });

  return { items, total, page: safePage, pageSize: safeSize };
}
