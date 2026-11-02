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

let currentFinish: (() => void) | null = null;

function finishCurrent(): void {
  const f = currentFinish;
  currentFinish = null;
  if (f) f();
}

/**
 * 朗读文本。返回的 Promise 在朗读结束（或出错、被新朗读打断）时 resolve，
 * 便于调用方显示「正在播放」的动效。
 */
export function speak(text: string, rate = 0.82): Promise<void> {
  if (!isSpeechSupported()) return Promise.resolve();
  try {
    speechSynthesis.cancel();
    finishCurrent();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = rate;
    const voice = pickVietnameseVoice();
    if (voice) u.voice = voice;
    return new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        if (currentFinish === done) currentFinish = null;
        resolve();
      };
      currentFinish = done;
      u.onend = done;
      u.onerror = done;
      speechSynthesis.speak(u);
    });
  } catch {
    return Promise.resolve();
  }
}

/** 停止当前朗读，并让进行中的 speak Promise 正常结束。 */
export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    speechSynthesis.cancel();
  } catch {
    /* 静默失败 */
  }
  finishCurrent();
}
