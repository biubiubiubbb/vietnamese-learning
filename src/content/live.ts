import { setCurriculum } from './curriculum';
import { setVocab } from './vocab';
import { setSentences } from './sentences';
import { setPronunciation, type PronunciationData } from './pronunciation';
import { applyRemoteDefaultVoice, type VoiceGender } from '../lib/speech';
import type { Lesson, Sentence, Unit, VocabItem } from './types';

interface ContentPayload {
  units: Unit[];
  lessons: Lesson[];
  vocab: VocabItem[];
  sentences: Sentence[];
  pronunciation: PronunciationData;
}

/**
 * 从后台读取线上内容。读取失败时保留静态内容作为兜底，
 * 这样纯前端预览或 API 未启动时页面仍可打开。
 */
export async function hydrateContent(): Promise<boolean> {
  try {
    const response = await fetch('/api/content', { cache: 'no-store' });
    if (!response.ok) return false;
    const data = (await response.json()) as ContentPayload;
    if (!Array.isArray(data.units) || !Array.isArray(data.lessons)) return false;
    setCurriculum(data.units, data.lessons);
    setVocab(data.vocab ?? []);
    setSentences(data.sentences ?? []);
    setPronunciation(data.pronunciation);
    try {
      const config = await fetch('/api/config', { cache: 'no-store' });
      if (config.ok) {
        const value = (await config.json()) as { defaultVoice?: VoiceGender };
        if (value.defaultVoice === 'male' || value.defaultVoice === 'female') {
          applyRemoteDefaultVoice(value.defaultVoice);
        }
      }
    } catch {
      /* 配置读取失败时保留本机偏好 */
    }
    return true;
  } catch {
    return false;
  }
}
