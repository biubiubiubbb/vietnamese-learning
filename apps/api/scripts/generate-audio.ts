/**
 * 用 Edge 神经语音预生成越南语朗读音频（女声 + 男声）。
 *
 * 依赖：`pip install edge-tts`（或 `pipx install edge-tts`），也可用 EDGE_TTS 指定可执行文件路径。
 * 用法：
 *   npm run audio:generate -w @viet/api -- --dry-run   # 只统计待生成文本
 *   npm run audio:generate -w @viet/api                # 生成缺失的音频
 *   npm run audio:generate -w @viet/api -- --force     # 重新生成全部音频
 */
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALPHABET, CONSONANT_GROUPS, MINIMAL_PAIRS, TONES, TONE_RULES, VOWEL_GROUPS } from '@viet/shared/pronunciation';
import { LESSONS } from '@viet/shared/curriculum';
import { SENTENCES } from '@viet/shared/sentences';
import { VOCAB } from '@viet/shared/vocab';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = process.env.AUDIO_OUT_DIR
  ? path.resolve(process.env.AUDIO_OUT_DIR)
  : path.join(ROOT, '../web/public/audio/vi');
const MANIFEST = path.join(OUT_DIR, 'index.json');
const VOICES: Record<string, string> = {
  female: process.env.EDGE_VOICE_FEMALE ?? 'vi-VN-HoaiMyNeural',
  male: process.env.EDGE_VOICE_MALE ?? 'vi-VN-NamMinhNeural',
};
const VOICE_KEYS = Object.keys(VOICES);
const EDGE_TTS = process.env.EDGE_TTS ?? 'edge-tts';
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);

function addText(set: Set<string>, text: string | null | undefined) {
  const value = text?.trim();
  if (value) set.add(value);
}

function collectTexts(): string[] {
  const texts = new Set<string>();
  for (const v of VOCAB) {
    addText(texts, v.vi);
    addText(texts, v.example?.vi);
  }
  for (const lesson of LESSONS) {
    for (const dialogue of lesson.dialogues) {
      for (const line of dialogue.lines) addText(texts, line.vi);
    }
    for (const grammar of lesson.grammar) {
      for (const example of grammar.examples) addText(texts, example.vi);
    }
    for (const exercise of lesson.exercises) addText(texts, exercise.audioText);
  }
  for (const sentence of SENTENCES) addText(texts, sentence.vi);
  for (const alphabet of ALPHABET) addText(texts, alphabet.name);
  for (const tone of TONES) addText(texts, tone.example.vi);
  for (const group of [...CONSONANT_GROUPS, ...VOWEL_GROUPS]) {
    for (const item of group.items) addText(texts, item.example.vi);
  }
  for (const pair of MINIMAL_PAIRS) {
    for (const word of pair.pair) addText(texts, word);
  }
  for (const rule of TONE_RULES) {
    for (const example of rule.examples ?? []) addText(texts, example.vi);
  }
  return [...texts].sort((a, b) => a.localeCompare(b, 'vi'));
}

function fileFor(text: string, voice: string) {
  return `${createHash('sha1').update(`${voice}:${text}`).digest('hex').slice(0, 16)}.mp3`;
}

async function synthesize(text: string, voice: string, target: string) {
  const temp = `${target}.tmp.mp3`;
  await run(
    EDGE_TTS,
    ['--voice', voice, '--text', text, '--write-media', temp],
    { timeout: 60_000 },
  );
  await fs.rename(temp, target);
}

async function withRetry(text: string, voice: string, target: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await synthesize(text, voice, target);
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
}

async function main() {
  const texts = collectTexts();
  const manifest: Record<string, Record<string, string>> = {};
  for (const text of texts) {
    manifest[text] = Object.fromEntries(
      VOICE_KEYS.map((key) => [key, fileFor(text, key)]),
    );
  }

  if (DRY_RUN) {
    console.log(
      `待朗读文本 ${texts.length} 条，共 ${texts.length * VOICE_KEYS.length} 个音频（${VOICE_KEYS.join(' / ')}）`,
    );
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const pending: { text: string; voice: string; target: string }[] = [];
  for (const text of texts) {
    for (const key of VOICE_KEYS) {
      const target = path.join(OUT_DIR, manifest[text][key]);
      const exists = await fs.access(target).then(() => true, () => false);
      if (FORCE || !exists) pending.push({ text, voice: VOICES[key], target });
    }
  }

  console.log(
    `共 ${texts.length} 条文本 / ${pending.length} 个待生成音频，语音 ${VOICE_KEYS.map((k) => `${k}=${VOICES[k]}`).join('，')}`,
  );
  let done = 0;
  let failed = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < pending.length) {
      const item = pending[cursor++];
      try {
        await withRetry(item.text, item.voice, item.target);
        done++;
      } catch (error) {
        failed++;
        console.error(`失败：${item.text}`, error instanceof Error ? error.message : String(error));
      }
      if (done % 20 === 0 || done + failed === pending.length) {
        console.log(`进度 ${done + failed}/${pending.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await fs.writeFile(MANIFEST, JSON.stringify(manifest));
  console.log(`完成：成功 ${done}，失败 ${failed}，索引 ${MANIFEST}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
