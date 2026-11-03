import { LESSONS, UNITS } from '@viet/shared/curriculum';
import { SENTENCES } from '@viet/shared/sentences';
import { VOCAB } from '@viet/shared/vocab';
import { db } from '../src/db';

function upsertUnit() {
  const stmt = db.prepare(
    `INSERT INTO units (id, level, sort_order, title, subtitle)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       level = excluded.level,
       sort_order = excluded.sort_order,
       title = excluded.title,
       subtitle = excluded.subtitle`,
  );
  for (const unit of UNITS) stmt.run(unit.id, unit.level, unit.order, unit.title, unit.subtitle);
}

function upsertLesson() {
  const stmt = db.prepare(
    `INSERT INTO lessons (id, unit_id, sort_order, title, goals, vocab_ids, grammar, dialogues, exercises)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       unit_id = excluded.unit_id,
       sort_order = excluded.sort_order,
       title = excluded.title,
       goals = excluded.goals,
       vocab_ids = excluded.vocab_ids,
       grammar = excluded.grammar,
       dialogues = excluded.dialogues,
       exercises = excluded.exercises`,
  );
  for (const lesson of LESSONS) {
    stmt.run(
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
}

function upsertVocab() {
  const stmt = db.prepare(
    `INSERT INTO vocab (id, vi, zh, pos, han_viet, example_vi, example_zh, note, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       vi = excluded.vi,
       zh = excluded.zh,
       pos = excluded.pos,
       han_viet = excluded.han_viet,
       example_vi = excluded.example_vi,
       example_zh = excluded.example_zh,
       note = excluded.note,
       tags = excluded.tags`,
  );
  for (const v of VOCAB) {
    stmt.run(
      v.id,
      v.vi,
      v.zh,
      v.pos,
      v.hanViet ?? null,
      v.example?.vi ?? null,
      v.example?.zh ?? null,
      v.note ?? null,
      JSON.stringify(v.tags ?? []),
    );
  }
}

function upsertSentence() {
  const stmt = db.prepare(
    `INSERT INTO sentences (id, lesson_id, sort_order, vi, zh, tag, chunks, note, exercises)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       lesson_id = excluded.lesson_id,
       sort_order = excluded.sort_order,
       vi = excluded.vi,
       zh = excluded.zh,
       tag = excluded.tag,
       chunks = excluded.chunks,
       note = excluded.note,
       exercises = excluded.exercises`,
  );
  for (const s of SENTENCES) {
    stmt.run(
      s.id,
      s.lessonId,
      s.order,
      s.vi,
      s.zh,
      s.tag,
      JSON.stringify(s.chunks ?? []),
      s.note ?? null,
      JSON.stringify(s.exercises ?? []),
    );
  }
}

db.exec('BEGIN');
try {
  upsertUnit();
  upsertLesson();
  upsertVocab();
  upsertSentence();
  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}

const counts = {
  units: (db.prepare('SELECT COUNT(*) AS n FROM units').get() as { n: number }).n,
  lessons: (db.prepare('SELECT COUNT(*) AS n FROM lessons').get() as { n: number }).n,
  vocab: (db.prepare('SELECT COUNT(*) AS n FROM vocab').get() as { n: number }).n,
  sentences: (db.prepare('SELECT COUNT(*) AS n FROM sentences').get() as { n: number }).n,
};
console.log(
  `[reseed] 内容同步完成：${counts.units} 单元 / ${counts.lessons} 课 / ${counts.vocab} 词条 / ${counts.sentences} 句子`,
);
