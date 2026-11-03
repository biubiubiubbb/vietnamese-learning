import { apiUrl } from './apiBase';

export type VoiceGender = 'female' | 'male';

type VoiceFiles = Partial<Record<VoiceGender | 'human', string>>;
type AudioIndex = Record<string, VoiceFiles>;

const VOICE_KEY = 'vi-voice';
const listeners = new Set<(voice: VoiceGender) => void>();

function readStoredVoice(): VoiceGender | null {
  try {
    const value = localStorage.getItem(VOICE_KEY);
    return value === 'male' || value === 'female' ? value : null;
  } catch {
    return null;
  }
}

let preferredVoice: VoiceGender = readStoredVoice() ?? 'female';

export function getPreferredVoice(): VoiceGender {
  return preferredVoice;
}

/** 应用后台默认音色；用户在本机手动切换过的音色优先。 */
export function applyRemoteDefaultVoice(voice: VoiceGender): void {
  if (readStoredVoice()) return;
  if (preferredVoice === voice) return;
  preferredVoice = voice;
  listeners.forEach((listener) => listener(voice));
}

export function setPreferredVoice(voice: VoiceGender): void {
  preferredVoice = voice;
  try {
    localStorage.setItem(VOICE_KEY, voice);
  } catch {
    /* 忽略存储失败 */
  }
  listeners.forEach((listener) => listener(voice));
}

export function subscribeVoice(listener: (voice: VoiceGender) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 对话按说话人出场顺序交替男女声；首位说话人使用当前偏好音色。 */
export function dialogueVoiceFor(speakerIndex: number, lead = preferredVoice): VoiceGender {
  if (speakerIndex % 2 === 0) return lead;
  return lead === 'female' ? 'male' : 'female';
}

/* ---------- 系统语音（无预生成音频时的回退） ---------- */

let voicesCache: SpeechSynthesisVoice[] | null = null;

function loadVoices(): SpeechSynthesisVoice[] {
  if (voicesCache) return voicesCache;
  if (typeof speechSynthesis === 'undefined') return [];
  voicesCache = speechSynthesis.getVoices();
  return voicesCache;
}

if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {
    voicesCache = speechSynthesis.getVoices();
  };
}

export function isSpeechSupported(): boolean {
  return typeof speechSynthesis !== 'undefined';
}

export function pickVietnameseVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  return (
    voices.find((v) => v.lang === 'vi-VN') ??
    voices.find((v) => v.lang.startsWith('vi')) ??
    null
  );
}

function pickSystemVoice(gender: VoiceGender): SpeechSynthesisVoice | null {
  const voices = loadVoices().filter((v) => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
  if (voices.length === 0) return null;
  const hints = gender === 'male' ? ['nam', 'minh', 'male'] : ['linh', 'hoai', 'female', 'nu'];
  const match = voices.find((v) => hints.some((hint) => v.name.toLowerCase().includes(hint)));
  return match ?? voices[0];
}

/* ---------- 预生成音频索引 ---------- */

let audioIndex: AudioIndex | null = null;
let audioIndexPromise: Promise<AudioIndex> | null = null;

function loadAudioIndex(): Promise<AudioIndex> {
  if (audioIndex) return Promise.resolve(audioIndex);
  audioIndexPromise ??= (async () => {
    const sources = [
      apiUrl('/api/audio/index'),
      `${import.meta.env.BASE_URL}audio/vi/index.json`,
    ];
    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = (await response.json()) as AudioIndex;
        if (Object.keys(data).length > 0) {
          audioIndex = data;
          return data;
        }
      } catch {
        /* 尝试下一个来源 */
      }
    }
    // 索引暂时不存在时允许下次朗读重试，避免一次失败后永久退回系统语音
    audioIndexPromise = null;
    return {};
  })();
  return audioIndexPromise;
}

if (typeof fetch !== 'undefined') void loadAudioIndex();

/* ---------- 播放 ---------- */

let speakToken = 0;
let currentFinish: (() => void) | null = null;
let currentAudio: HTMLAudioElement | null = null;

function finishCurrent(): void {
  const finish = currentFinish;
  currentFinish = null;
  if (finish) finish();
}

function stopCurrent(): void {
  if (typeof speechSynthesis !== 'undefined') {
    try {
      speechSynthesis.cancel();
    } catch {
      /* 静默失败 */
    }
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      /* 静默失败 */
    }
    currentAudio = null;
  }
  finishCurrent();
}

function audioUrl(file: string): string {
  if (file.startsWith('http://') || file.startsWith('https://')) return file;
  if (file.startsWith('/')) return apiUrl(file);
  return `${import.meta.env.BASE_URL}audio/vi/${file}`;
}

function playAudio(file: string, rate: number, token: number): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl(file));
    audio.preload = 'auto';
    audio.playbackRate = Math.min(1.5, Math.max(0.5, rate));

    let started = false;
    let settled = false;

    const finish = (played: boolean) => {
      if (settled) return;
      settled = true;
      audio.onplaying = null;
      audio.onended = null;
      audio.onerror = null;
      if (currentAudio === audio) currentAudio = null;
      if (currentFinish === stop) currentFinish = null;
      if (!played) audio.pause();
      resolve(played);
    };

    const stop = () => {
      audio.pause();
      finish(started);
    };

    currentAudio = audio;
    currentFinish = stop;
    audio.onplaying = () => {
      started = true;
    };
    audio.onended = () => finish(true);
    audio.onerror = () => finish(started);

    if (token !== speakToken) {
      finish(false);
      return;
    }
    audio.play().then(
      () => {
        started = true;
      },
      () => finish(started),
    );
  });
}

function speakWithSystem(text: string, rate: number, voice: VoiceGender, token: number): Promise<void> {
  if (!isSpeechSupported()) return Promise.resolve();
  try {
    if (token !== speakToken) return Promise.resolve();
    speechSynthesis.cancel();
    finishCurrent();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    const systemVoice = pickSystemVoice(voice);
    if (systemVoice) utterance.voice = systemVoice;
    return new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        if (currentFinish === done) currentFinish = null;
        resolve();
      };
      currentFinish = done;
      utterance.onend = done;
      utterance.onerror = done;
      speechSynthesis.speak(utterance);
    });
  } catch {
    return Promise.resolve();
  }
}

/**
 * 朗读文本。优先播放预生成的神经语音；缺失时回退系统语音。
 * 返回的 Promise 在朗读结束（或出错、被新朗读打断）时 resolve。
 */
export async function speak(
  text: string,
  rate = 0.82,
  voice: VoiceGender = preferredVoice,
): Promise<void> {
  const token = ++speakToken;
  stopCurrent();

  const index = await loadAudioIndex();
  if (token !== speakToken) return;

  const files = index[text];
  const file = files?.human ?? files?.[voice] ?? files?.female ?? files?.male;
  if (file) {
    const played = await playAudio(file, rate, token);
    if (token !== speakToken || played) return;
  }

  await speakWithSystem(text, rate, voice, token);
}

/** 停止当前朗读，并让进行中的 speak Promise 正常结束。 */
export function stopSpeaking(): void {
  speakToken += 1;
  stopCurrent();
}
