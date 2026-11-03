import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { db, jsonParse, now, ROOT_DIR } from './db.mjs';
import { ensureAdminUser, login, me, destroySession, requireAdmin } from './auth.mjs';
import {
  getContent,
  getCounts,
  getAudioHealth,
  getConfig,
  saveConfig,
  getPronunciation,
  getPronunciationRow,
  savePronunciation,
  getTrash,
  mapUnit,
  mapLesson,
  mapVocab,
  mapSentence,
} from './contentDb.mjs';
import {
  syncAudio,
  regenerate,
  saveRecording,
  setAudioEnabled,
  getAudioIndex,
  getAudioRow,
  listAudioGroups,
} from './audio.mjs';

const PORT = Number(process.env.PORT ?? 8787);
const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

app.use(express.json({ limit: '20mb' }));

let syncTimer = null;
function scheduleAudioSync(delay = 600) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    syncAudio();
  }, delay);
}

function fail(res, status, message) {
  res.status(status).json({ error: message });
}

function requireBody(body, fields) {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      return `${field} 不能为空`;
    }
  }
  return null;
}

function idError(id) {
  return /^[A-Za-z0-9_-]{2,64}$/.test(String(id ?? '')) ? null : 'ID 只能包含字母、数字、_ 和 -，长度 2-64';
}

function uniqueError(error) {
  if (String(error?.message ?? '').includes('UNIQUE')) return 'ID 已存在，请换一个';
  return null;
}

/* ---------- 登录 ---------- */

app.post('/api/auth/login', login);
app.post('/api/auth/logout', (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});
app.get('/api/auth/me', me);

/* ---------- 前端公开内容 ---------- */

app.get('/api/content', (_req, res) => {
  res.json(getContent());
});

app.get('/api/config', (_req, res) => {
  res.json(getConfig());
});

app.get('/api/audio/index', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(getAudioIndex());
});

app.get('/api/audio/:id', (req, res) => {
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

app.get('/api/admin/overview', (_req, res) => {
  res.json({
    counts: getCounts(),
    audio: getAudioHealth(),
    config: getConfig(),
  });
});

/* 单元 */

app.get('/api/admin/units', (req, res) => {
  const includeDeleted = req.query.includeDeleted === '1';
  const rows = db.prepare(
    `SELECT * FROM units ${includeDeleted ? '' : 'WHERE deleted_at IS NULL'} ORDER BY level, sort_order`,
  ).all();
  res.json(rows.map(mapUnit));
});

app.post('/api/admin/units', (req, res) => {
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

app.put('/api/admin/units/:id', (req, res) => {
  const error = requireBody(req.body, ['level', 'title']);
  if (error) return fail(res, 400, error);
  const result = db.prepare(
    'UPDATE units SET level = ?, sort_order = ?, title = ?, subtitle = ? WHERE id = ?',
  ).run(req.body.level, Number(req.body.order ?? 0), req.body.title, req.body.subtitle ?? '', req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json(mapUnit(db.prepare('SELECT * FROM units WHERE id = ?').get(req.params.id)));
});

app.delete('/api/admin/units/:id', (req, res) => {
  const lessons = db.prepare('SELECT COUNT(*) AS n FROM lessons WHERE unit_id = ? AND deleted_at IS NULL').get(req.params.id).n;
  if (lessons > 0) return fail(res, 409, `该单元下还有 ${lessons} 节课，请先移动或删除课程`);
  const result = db.prepare('UPDATE units SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json({ ok: true });
});

app.post('/api/admin/units/:id/restore', (req, res) => {
  const result = db.prepare('UPDATE units SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '单元不存在');
  res.json({ ok: true });
});

app.post('/api/admin/units/reorder', (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  db.exec('BEGIN');
  try {
    ids.forEach((id, index) => {
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

app.get('/api/admin/lessons', (req, res) => {
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

app.post('/api/admin/lessons', (req, res) => {
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

app.put('/api/admin/lessons/:id', (req, res) => {
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

app.delete('/api/admin/lessons/:id', (req, res) => {
  const sentences = db.prepare('SELECT COUNT(*) AS n FROM sentences WHERE lesson_id = ? AND deleted_at IS NULL').get(req.params.id).n;
  if (sentences > 0) return fail(res, 409, `该课程下还有 ${sentences} 个句子，请先移动或删除句子`);
  const result = db.prepare('UPDATE lessons SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '课程不存在');
  res.json({ ok: true });
});

app.post('/api/admin/lessons/:id/restore', (req, res) => {
  const result = db.prepare('UPDATE lessons SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '课程不存在');
  res.json({ ok: true });
});

app.post('/api/admin/lessons/reorder', (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  db.exec('BEGIN');
  try {
    ids.forEach((id, index) => {
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

app.get('/api/admin/vocab', (req, res) => {
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

app.post('/api/admin/vocab', (req, res) => {
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

app.put('/api/admin/vocab/:id', (req, res) => {
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

function vocabReferences(id) {
  const lessons = db.prepare('SELECT id, title, vocab_ids FROM lessons WHERE deleted_at IS NULL').all()
    .filter((row) => jsonParse(row.vocab_ids, []).includes(id))
    .map((row) => ({ type: 'lesson', id: row.id, title: row.title }));
  const sentences = db.prepare('SELECT id, vi, chunks FROM sentences WHERE deleted_at IS NULL').all()
    .filter((row) => jsonParse(row.chunks, []).some((chunk) => chunk.vocabId === id))
    .map((row) => ({ type: 'sentence', id: row.id, title: row.vi }));
  return [...lessons, ...sentences];
}

app.get('/api/admin/vocab/:id/references', (req, res) => {
  res.json(vocabReferences(req.params.id));
});

app.delete('/api/admin/vocab/:id', (req, res) => {
  const refs = vocabReferences(req.params.id);
  if (refs.length > 0) {
    return fail(res, 409, `该词条被 ${refs.length} 处引用，请先解除引用`);
  }
  const result = db.prepare('UPDATE vocab SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '词条不存在');
  res.json({ ok: true });
});

app.post('/api/admin/vocab/:id/restore', (req, res) => {
  const result = db.prepare('UPDATE vocab SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '词条不存在');
  res.json({ ok: true });
});

/* 句子 */

app.get('/api/admin/sentences', (req, res) => {
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

app.post('/api/admin/sentences', (req, res) => {
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

app.put('/api/admin/sentences/:id', (req, res) => {
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

app.delete('/api/admin/sentences/:id', (req, res) => {
  const result = db.prepare('UPDATE sentences SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL').run(now(), req.params.id);
  if (!result.changes) return fail(res, 404, '句子不存在');
  res.json({ ok: true });
});

app.post('/api/admin/sentences/:id/restore', (req, res) => {
  const result = db.prepare('UPDATE sentences SET deleted_at = NULL WHERE id = ?').run(req.params.id);
  if (!result.changes) return fail(res, 404, '句子不存在');
  res.json({ ok: true });
});

/* 发音中心 */

app.get('/api/admin/pronunciation', (_req, res) => {
  res.json(getPronunciation());
});

app.put('/api/admin/pronunciation/:key', (req, res) => {
  const allowed = ['alphabet', 'tones', 'consonantGroups', 'vowelGroups', 'minimalPairs', 'toneRules'];
  if (!allowed.includes(req.params.key)) return fail(res, 400, '未知的发音模块');
  if (!Array.isArray(req.body.payload)) return fail(res, 400, '内容必须是数组');
  savePronunciation(req.params.key, req.body.payload);
  scheduleAudioSync();
  res.json({ ok: true });
});

/* 音频 */

app.get('/api/admin/audio', (req, res) => {
  res.json(listAudioGroups({
    status: req.query.status,
    q: req.query.q,
    page: req.query.page,
    pageSize: req.query.pageSize,
  }));
});

app.post('/api/admin/audio/:id/regenerate', (req, res) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row) return fail(res, 404, '音频不存在');
  if (row.voice === 'human') return fail(res, 400, '人声音频请重新录音');
  regenerate(row.text, row.voice);
  res.json({ ok: true });
});

app.post('/api/admin/audio/regenerate-all', (_req, res) => {
  const result = syncAudio();
  res.json(result);
});

app.post('/api/admin/audio/record', upload.single('file'), (req, res) => {
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

app.patch('/api/admin/audio/:id', (req, res) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row) return fail(res, 404, '音频不存在');
  setAudioEnabled(row.id, Boolean(req.body.enabled));
  res.json({ ok: true });
});

app.get('/api/admin/audio/:id/stream', (req, res) => {
  const row = getAudioRow(Number(req.params.id));
  if (!row || !row.data?.length) return fail(res, 404, '音频不存在');
  res.setHeader('Content-Type', row.mime || 'audio/mpeg');
  res.setHeader('Cache-Control', 'no-store');
  res.send(Buffer.from(row.data));
});

/* 配置与回收站 */

app.get('/api/admin/config', (_req, res) => {
  res.json(getConfig());
});

app.put('/api/admin/config', (req, res) => {
  res.json(saveConfig(req.body ?? {}));
});

app.get('/api/admin/trash', (_req, res) => {
  res.json(getTrash());
});

app.post('/api/admin/trash/:type/:id/restore', (req, res) => {
  const table = { units: 'units', lessons: 'lessons', vocab: 'vocab', sentences: 'sentences' }[req.params.type];
  if (!table) return fail(res, 400, '未知类型');
  const result = db.prepare(`UPDATE ${table} SET deleted_at = NULL WHERE id = ?`).run(req.params.id);
  if (!result.changes) return fail(res, 404, '内容不存在');
  res.json({ ok: true });
});

/* 静态文件与兜底 */

const dist = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error('[server]', err);
  res.status(500).json({ error: err?.message ?? '服务器错误' });
});

ensureAdminUser();
await (await import('./seed.mjs')).seedIfEmpty();
syncAudio();

app.listen(PORT, () => {
  console.log(`[server] 中后台 API 已启动：http://127.0.0.1:${PORT}`);
});
