import type { PronunciationData } from '@viet/shared/pronunciation';
import type { Lesson, Sentence, Unit, VocabItem } from '@viet/shared/types';
import { db, jsonParse } from './db';

type Row = any;
type WithDeleted = { deletedAt: number | null };

const PRONUNCIATION_KEYS = [
  'alphabet',
  'tones',
  'consonantGroups',
  'vowelGroups',
  'minimalPairs',
  'toneRules',
];

export function mapUnit(row: Row): Omit<Unit, 'lessonIds'> & WithDeleted {
  return {
    id: row.id,
    level: row.level,
    order: row.sort_order,
    title: row.title,
    subtitle: row.subtitle,
    deletedAt: row.deleted_at ?? null,
  };
}

export function mapLesson(row: Row): Lesson & WithDeleted {
  return {
    id: row.id,
    unitId: row.unit_id,
    order: row.sort_order,
    title: row.title,
    goals: jsonParse<string[]>(row.goals, []),
    vocabIds: jsonParse<string[]>(row.vocab_ids, []),
    grammar: jsonParse(row.grammar, []),
    dialogues: jsonParse(row.dialogues, []),
    exercises: jsonParse(row.exercises, []),
    deletedAt: row.deleted_at ?? null,
  };
}

export function mapVocab(row: Row): VocabItem & WithDeleted {
  return {
    id: row.id,
    vi: row.vi,
    zh: row.zh,
    pos: row.pos,
    hanViet: row.han_viet ?? undefined,
    example: row.example_vi ? { vi: row.example_vi, zh: row.example_zh ?? '' } : undefined,
    note: row.note ?? undefined,
    tags: jsonParse(row.tags, []),
    deletedAt: row.deleted_at ?? null,
  };
}

export function mapSentence(row: Row): Sentence & WithDeleted {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    order: row.sort_order,
    vi: row.vi,
    zh: row.zh,
    tag: row.tag,
    chunks: jsonParse(row.chunks, []),
    note: row.note ?? undefined,
    exercises: jsonParse(row.exercises, []),
    deletedAt: row.deleted_at ?? null,
  };
}

export function getPronunciation(): PronunciationData {
  const rows = db.prepare('SELECT key, payload FROM pronunciation').all() as Row[];
  const map: Record<string, any> = Object.fromEntries(rows.map((row) => [row.key, jsonParse(row.payload, [])]));
  return {
    alphabet: map.alphabet ?? [],
    tones: map.tones ?? [],
    consonantGroups: map.consonantGroups ?? [],
    vowelGroups: map.vowelGroups ?? [],
    minimalPairs: map.minimalPairs ?? [],
    toneRules: map.toneRules ?? [],
  };
}

/** 前端学习页使用的完整内容。 */
export function getContent() {
  const unitRows = db.prepare('SELECT * FROM units WHERE deleted_at IS NULL ORDER BY level, sort_order').all();
  const lessonRows = db.prepare('SELECT * FROM lessons WHERE deleted_at IS NULL ORDER BY unit_id, sort_order').all();
  const vocab = db.prepare('SELECT * FROM vocab WHERE deleted_at IS NULL ORDER BY id').all();
  const sentenceRows = db.prepare('SELECT * FROM sentences WHERE deleted_at IS NULL ORDER BY lesson_id, sort_order').all();
  const lessons = lessonRows.map(mapLesson);
  const units = unitRows.map((row) => ({
    ...mapUnit(row),
    lessonIds: lessons.filter((lesson) => lesson.unitId === row.id).map((lesson) => lesson.id),
  }));
  return {
    units,
    lessons,
    vocab: vocab.map(mapVocab),
    sentences: sentenceRows.map(mapSentence),
    pronunciation: getPronunciation(),
  };
}

export function getPronunciationRow(key: string) {
  return db.prepare('SELECT * FROM pronunciation WHERE key = ?').get(key);
}

export function savePronunciation(key: string, payload: unknown) {
  db.prepare(
    `INSERT INTO pronunciation (key, payload) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET payload = excluded.payload`,
  ).run(key, JSON.stringify(payload));
}

function addText(set: Set<string>, text: unknown) {
  const value = String(text ?? '').trim();
  if (value) set.add(value);
}

/** 所有需要朗读的文本，用于自动生成双音色音频。 */
export function collectReadableTexts(): string[] {
  const texts = new Set<string>();
  for (const row of db.prepare('SELECT vi, example_vi FROM vocab WHERE deleted_at IS NULL').all()) {
    addText(texts, row.vi);
    addText(texts, row.example_vi);
  }
  for (const row of db.prepare('SELECT grammar, dialogues, exercises FROM lessons WHERE deleted_at IS NULL').all()) {
    for (const grammar of jsonParse<any[]>(row.grammar, [])) {
      for (const example of grammar.examples ?? []) addText(texts, example.vi);
    }
    for (const dialogue of jsonParse<any[]>(row.dialogues, [])) {
      for (const line of dialogue.lines ?? []) addText(texts, line.vi);
    }
    for (const exercise of jsonParse<any[]>(row.exercises, [])) addText(texts, exercise.audioText);
  }
  for (const row of db.prepare('SELECT vi FROM sentences WHERE deleted_at IS NULL').all()) {
    addText(texts, row.vi);
  }

  const pronunciation = getPronunciation();
  for (const item of pronunciation.alphabet) addText(texts, item.name);
  for (const item of pronunciation.tones) addText(texts, item.example?.vi);
  for (const group of [...pronunciation.consonantGroups, ...pronunciation.vowelGroups]) {
    for (const item of group.items ?? []) addText(texts, item.example?.vi);
  }
  for (const pair of pronunciation.minimalPairs) {
    for (const word of pair.pair ?? []) addText(texts, word);
  }
  for (const rule of pronunciation.toneRules) {
    for (const example of rule.examples ?? []) addText(texts, example.vi);
  }
  return [...texts];
}

export type AudioTextType = 'word' | 'sentence' | 'pronunciation';

export interface AudioTextMeta {
  type: AudioTextType;
  zh: string;
}

/** 每条朗读文本的类型与中文释义，类型按「发音 > 句子 > 单词」收敛。 */
export function collectReadableTextMeta(): Map<string, AudioTextMeta> {
  const wordZh = new Map<string, string>();
  const sentenceZh = new Map<string, string>();
  const pronunciationZh = new Map<string, string>();

  const put = (map: Map<string, string>, text: unknown, zh: unknown) => {
    const vi = String(text ?? '').trim();
    if (!vi) return;
    const meaning = String(zh ?? '').trim();
    if (!map.has(vi) || (!map.get(vi) && meaning)) map.set(vi, meaning);
  };

  for (const row of db.prepare('SELECT vi, zh, example_vi, example_zh FROM vocab WHERE deleted_at IS NULL').all()) {
    put(wordZh, row.vi, row.zh);
    put(sentenceZh, row.example_vi, row.example_zh);
  }
  for (const row of db.prepare('SELECT grammar, dialogues, exercises FROM lessons WHERE deleted_at IS NULL').all()) {
    for (const grammar of jsonParse<any[]>(row.grammar, [])) {
      for (const example of grammar.examples ?? []) put(sentenceZh, example.vi, example.zh);
    }
    for (const dialogue of jsonParse<any[]>(row.dialogues, [])) {
      for (const line of dialogue.lines ?? []) put(sentenceZh, line.vi, line.zh);
    }
    for (const exercise of jsonParse<any[]>(row.exercises, [])) put(sentenceZh, exercise.audioText, '');
  }
  for (const row of db.prepare('SELECT vi, zh FROM sentences WHERE deleted_at IS NULL').all()) {
    put(sentenceZh, row.vi, row.zh);
  }

  const pronunciation = getPronunciation();
  for (const item of pronunciation.alphabet) put(pronunciationZh, item.name, item.zhApprox);
  for (const item of pronunciation.tones) put(pronunciationZh, item.example?.vi, item.example?.zh);
  for (const group of [...pronunciation.consonantGroups, ...pronunciation.vowelGroups]) {
    for (const item of group.items ?? []) put(pronunciationZh, item.example?.vi, item.example?.zh);
  }
  for (const pair of pronunciation.minimalPairs) {
    (pair.pair ?? []).forEach((vi: string, index: number) => put(pronunciationZh, vi, pair.zh?.[index]));
  }
  for (const rule of pronunciation.toneRules) {
    for (const example of rule.examples ?? []) put(pronunciationZh, example.vi, example.zh);
  }

  const texts = new Set<string>([
    ...wordZh.keys(),
    ...sentenceZh.keys(),
    ...pronunciationZh.keys(),
  ]);
  const meta = new Map<string, AudioTextMeta>();
  for (const text of texts) {
    const pronunciationMeaning = pronunciationZh.get(text) ?? '';
    const sentenceMeaning = sentenceZh.get(text) ?? '';
    const wordMeaning = wordZh.get(text) ?? '';
    const type: AudioTextType = pronunciationZh.has(text)
      ? 'pronunciation'
      : sentenceZh.has(text)
        ? 'sentence'
        : 'word';
    meta.set(text, { type, zh: sentenceMeaning || wordMeaning || pronunciationMeaning });
  }
  return meta;
}

export function getCounts() {
  return {
    units: db.prepare('SELECT COUNT(*) AS n FROM units WHERE deleted_at IS NULL').get().n,
    lessons: db.prepare('SELECT COUNT(*) AS n FROM lessons WHERE deleted_at IS NULL').get().n,
    vocab: db.prepare('SELECT COUNT(*) AS n FROM vocab WHERE deleted_at IS NULL').get().n,
    sentences: db.prepare('SELECT COUNT(*) AS n FROM sentences WHERE deleted_at IS NULL').get().n,
    audio: db.prepare('SELECT COUNT(*) AS n FROM audio_assets').get().n,
    deleted: db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM units WHERE deleted_at IS NOT NULL) +
        (SELECT COUNT(*) FROM lessons WHERE deleted_at IS NOT NULL) +
        (SELECT COUNT(*) FROM vocab WHERE deleted_at IS NOT NULL) +
        (SELECT COUNT(*) FROM sentences WHERE deleted_at IS NOT NULL) AS n
    `).get().n,
  };
}

export function getAudioHealth() {
  const rows = db.prepare('SELECT status, enabled, COUNT(*) AS n FROM audio_assets GROUP BY status, enabled').all();
  const health: Record<string, number> = { ready: 0, pending: 0, generating: 0, failed: 0, disabled: 0 };
  for (const row of rows) {
    if (!row.enabled) {
      health.disabled += row.n;
    } else if (row.status in health) {
      health[row.status] += row.n;
    }
  }
  return health;
}

export function getConfig() {
  const rows = db.prepare('SELECT key, value FROM config').all() as Row[];
  const out: Record<string, any> = {};
  for (const row of rows) out[row.key] = jsonParse(row.value, null);
  const sessionDays = Number(out.customerSessionDays);
  return {
    defaultVoice: out.defaultVoice === 'male' ? 'male' : 'female',
    backgroundImage: typeof out.backgroundImage === 'string' ? out.backgroundImage : '',
    backgroundMime: typeof out.backgroundMime === 'string' ? out.backgroundMime : '',
    customerSessionDays:
      Number.isInteger(sessionDays) && sessionDays >= 1 && sessionDays <= 365 ? sessionDays : 30,
  };
}

export function saveConfig(patch: Record<string, unknown>) {
  const allowed = ['defaultVoice', 'backgroundImage', 'backgroundMime', 'customerSessionDays'];
  for (const key of allowed) {
    if (!(key in patch)) continue;
    if (key === 'defaultVoice') {
      const value = patch.defaultVoice === 'male' ? 'male' : 'female';
      writeConfig(key, value);
    } else if (key === 'customerSessionDays') {
      const value = Math.round(Number(patch[key]));
      if (!Number.isFinite(value) || value < 1 || value > 365) continue;
      writeConfig(key, value);
    } else if (typeof patch[key] === 'string') {
      writeConfig(key, patch[key]);
    }
  }
  return getConfig();
}

function writeConfig(key: string, value: unknown) {
  db.prepare(
    `INSERT INTO config (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(key, JSON.stringify(value));
}

export function clearBackgroundConfig() {
  db.prepare("DELETE FROM config WHERE key IN ('backgroundImage', 'backgroundMime')").run();
  return getConfig();
}

export function getTrash() {
  const units = db.prepare('SELECT * FROM units WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC').all().map(mapUnit);
  const lessons = db.prepare('SELECT * FROM lessons WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC').all().map(mapLesson);
  const vocab = db.prepare('SELECT * FROM vocab WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC').all().map(mapVocab);
  const sentences = db.prepare('SELECT * FROM sentences WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC').all().map(mapSentence);
  return { units, lessons, vocab, sentences };
}

export { PRONUNCIATION_KEYS };
