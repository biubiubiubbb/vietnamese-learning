/**
 * 用 Edge 神经语音预生成越南语朗读音频（女声 + 男声）。
 *
 * 依赖：`pip install edge-tts`（或 `pipx install edge-tts`），也可用 EDGE_TTS 指定可执行文件路径。
 * 用法：
 *   node scripts/generate-audio.mjs --dry-run   # 只统计待生成文本
 *   node scripts/generate-audio.mjs             # 生成缺失的音频
 *   node scripts/generate-audio.mjs --force     # 重新生成全部音频
 */
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = path.join(ROOT, 'public/audio/vi');
const MANIFEST = path.join(OUT_DIR, 'index.json');
const VOICES = {
  female: process.env.EDGE_VOICE_FEMALE ?? 'vi-VN-HoaiMyNeural',
  male: process.env.EDGE_VOICE_MALE ?? 'vi-VN-NamMinhNeural',
};
const VOICE_KEYS = Object.keys(VOICES);
const EDGE_TTS = process.env.EDGE_TTS ?? 'edge-tts';
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);

function addText(set, text) {
  const value = text?.trim();
  if (value) set.add(value);
}

async function collectTexts() {
  const server = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });
  try {
    const { VOCAB } = await server.ssrLoadModule('/src/content/vocab.ts');
    const { LESSONS } = await server.ssrLoadModule('/src/content/curriculum.ts');
    const { SENTENCES } = await server.ssrLoadModule('/src/content/sentences.ts');
    const {
      ALPHABET,
      TONES,
      CONSONANT_GROUPS,
      VOWEL_GROUPS,
      MINIMAL_PAIRS,
      TONE_RULES,
    } = await server.ssrLoadModule('/src/content/pronunciation.ts');

    const texts = new Set();
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
  } finally {
    await server.close();
  }
}

function fileFor(text, voice) {
  return `${createHash('sha1').update(`${voice}:${text}`).digest('hex').slice(0, 16)}.mp3`;
}

async function synthesize(text, voice, target) {
  const temp = `${target}.tmp.mp3`;
  await run(
    EDGE_TTS,
    ['--voice', voice, '--text', text, '--write-media', temp],
    { timeout: 60_000 },
  );
  await fs.rename(temp, target);
}

async function withRetry(text, voice, target) {
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
  const texts = await collectTexts();
  const manifest = {};
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
  const pending = [];
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
        console.error(`失败：${item.text}`, error.message);
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
