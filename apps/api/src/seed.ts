import fs from 'node:fs';
import path from 'node:path';
import { ALPHABET, CONSONANT_GROUPS, MINIMAL_PAIRS, TONES, TONE_RULES, VOWEL_GROUPS } from '@viet/shared/pronunciation';
import { LESSONS, UNITS } from '@viet/shared/curriculum';
import { SENTENCES } from '@viet/shared/sentences';
import { VOCAB } from '@viet/shared/vocab';
import type { Lesson, PronunciationData, Sentence, Unit, VocabItem } from '@viet/shared';
import { db, now, ROOT_DIR } from './db';

const AUDIO_DIR = process.env.AUDIO_SOURCE_DIR
  ? path.resolve(process.env.AUDIO_SOURCE_DIR)
  : path.join(ROOT_DIR, '../web/public/audio/vi');
const AUDIO_INDEX = path.join(AUDIO_DIR, 'index.json');

type SeedContent = {
  units: readonly Unit[];
  lessons: readonly Lesson[];
  vocab: readonly VocabItem[];
  sentences: readonly Sentence[];
  pronunciation: PronunciationData;
};

function insertContent(content: SeedContent) {
  const insertUnit = db.prepare(
    'INSERT OR IGNORE INTO units (id, level, sort_order, title, subtitle) VALUES (?, ?, ?, ?, ?)',
  );
  for (const unit of content.units) {
    insertUnit.run(unit.id, unit.level, unit.order, unit.title, unit.subtitle);
  }

  const insertLesson = db.prepare(
    `INSERT OR IGNORE INTO lessons
     (id, unit_id, sort_order, title, goals, vocab_ids, grammar, dialogues, exercises)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const lesson of content.lessons) {
    insertLesson.run(
      lesson.id,
      lesson.unitId,
      lesson.order,
      lesson.title,
      JSON.stringify(lesson.goals ?? []),
      JSON.stringify(lesson.vocabIds ?? []),
      JSON.stringify(lesson.grammar ?? []),
      JSON.stringify(lesson.dialogues ?? []),
      JSON.stringify(lesson.exercises ?? []),
    );
  }

  const insertVocab = db.prepare(
    `INSERT OR IGNORE INTO vocab
     (id, vi, zh, pos, han_viet, example_vi, example_zh, note, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const vocab of content.vocab) {
    insertVocab.run(
      vocab.id,
      vocab.vi,
      vocab.zh,
      vocab.pos,
      vocab.hanViet ?? null,
      vocab.example?.vi ?? null,
      vocab.example?.zh ?? null,
      vocab.note ?? null,
      JSON.stringify(vocab.tags ?? []),
    );
  }

  const insertSentence = db.prepare(
    `INSERT OR IGNORE INTO sentences
     (id, lesson_id, sort_order, vi, zh, tag, chunks, note, exercises)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const sentence of content.sentences) {
    insertSentence.run(
      sentence.id,
      sentence.lessonId,
      sentence.order,
      sentence.vi,
      sentence.zh,
      sentence.tag,
      JSON.stringify(sentence.chunks ?? []),
      sentence.note ?? null,
      JSON.stringify(sentence.exercises ?? []),
    );
  }

  const insertPronunciation = db.prepare(
    `INSERT OR REPLACE INTO pronunciation (key, payload) VALUES (?, ?)`,
  );
  for (const [key, payload] of Object.entries(content.pronunciation)) {
    insertPronunciation.run(key, JSON.stringify(payload));
  }
}

function seedAudio() {
  if (!fs.existsSync(AUDIO_INDEX)) {
    console.log(`[seed] 没有找到音频索引（${AUDIO_INDEX}），跳过音频导入`);
    return 0;
  }
  const index = JSON.parse(fs.readFileSync(AUDIO_INDEX, 'utf8')) as Record<string, Record<string, string>>;
  const insertAudio = db.prepare(
    `INSERT OR IGNORE INTO audio_assets
     (text, voice, data, mime, source, status, enabled, updated_at)
     VALUES (?, ?, ?, 'audio/mpeg', 'generated', 'ready', 1, ?)`,
  );
  let count = 0;
  for (const [text, files] of Object.entries(index)) {
    for (const voice of ['female', 'male']) {
      const file = files?.[voice];
      if (!file) continue;
      const fullPath = path.join(AUDIO_DIR, file);
      if (!fs.existsSync(fullPath)) continue;
      const data = fs.readFileSync(fullPath);
      const result = insertAudio.run(text, voice, data, now());
      if (result.changes > 0) count += 1;
    }
  }
  return count;
}

function loadStaticContent(): SeedContent {
  return {
    units: UNITS,
    lessons: LESSONS,
    vocab: VOCAB,
    sentences: SENTENCES,
    pronunciation: {
      alphabet: ALPHABET,
      tones: TONES,
      consonantGroups: CONSONANT_GROUPS,
      vowelGroups: VOWEL_GROUPS,
      minimalPairs: MINIMAL_PAIRS,
      toneRules: TONE_RULES,
    },
  };
}

export async function seedIfEmpty() {
  const force = process.env.SEED_FORCE === '1';
  if (force) {
    db.exec(`
      DELETE FROM units; DELETE FROM lessons; DELETE FROM vocab; DELETE FROM sentences;
      DELETE FROM pronunciation; DELETE FROM audio_assets;
    `);
  }

  const contentCount = (db.prepare('SELECT COUNT(*) AS n FROM units').get() as { n: number }).n;
  if (contentCount === 0) {
    console.log('[seed] 正在导入现有课程、词汇、句子与发音内容…');
    const content = loadStaticContent();
    db.exec('BEGIN');
    try {
      insertContent(content);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    console.log(
      `[seed] 内容导入完成：${content.units.length} 单元 / ${content.lessons.length} 课 / ${content.vocab.length} 词条 / ${content.sentences.length} 句子`,
    );
  }

  const audioCount = (db.prepare('SELECT COUNT(*) AS n FROM audio_assets').get() as { n: number }).n;
  if (audioCount === 0) {
    console.log('[seed] 正在导入现有双音色音频…');
    db.exec('BEGIN');
    try {
      const count = seedAudio();
      db.exec('COMMIT');
      console.log(`[seed] 音频导入完成：${count} 条`);
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }

  db.prepare(
    `INSERT OR IGNORE INTO config (key, value) VALUES ('defaultVoice', '"female"')`,
  ).run();
}
