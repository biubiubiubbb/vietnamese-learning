const KEY = 'vi-learn:v1';

export interface QuizScore {
  correct: number;
  total: number;
  at: number;
}

export interface CardState {
  box: number; // 1-5
  due: number; // timestamp
}

export interface ProgressState {
  completedLessons: string[];
  scores: Record<string, QuizScore>;
  cards: Record<string, CardState>;
  sentenceCards: Record<string, CardState>;
}

const BOX_DAYS = [0, 1, 2, 4, 7, 15];

const DEFAULT_STATE: ProgressState = {
  completedLessons: [],
  scores: {},
  cards: {},
  sentenceCards: {},
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completedLessons: parsed.completedLessons ?? [],
      scores: parsed.scores ?? {},
      cards: parsed.cards ?? {},
      sentenceCards: parsed.sentenceCards ?? {},
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 忽略存储失败 */
  }
}

export function completeLesson(state: ProgressState, lessonId: string): ProgressState {
  if (state.completedLessons.includes(lessonId)) return state;
  return { ...state, completedLessons: [...state.completedLessons, lessonId] };
}

export function recordScore(state: ProgressState, lessonId: string, score: QuizScore): ProgressState {
  return { ...state, scores: { ...state.scores, [lessonId]: score } };
}

export function gradeCard(
  state: ProgressState,
  vocabId: string,
  grade: 'again' | 'good',
): ProgressState {
  const prev = state.cards[vocabId];
  const box = grade === 'good' ? Math.min((prev?.box ?? 0) + 1, 5) : 1;
  const due = Date.now() + BOX_DAYS[box] * 24 * 60 * 60 * 1000;
  return { ...state, cards: { ...state.cards, [vocabId]: { box, due } } };
}

export function dueCards(state: ProgressState, allVocabIds: string[], now = Date.now()): string[] {
  const reviewed = allVocabIds.filter((id) => {
    const c = state.cards[id];
    return c && c.due <= now;
  });
  const fresh = allVocabIds.filter((id) => !state.cards[id]);
  return [...reviewed, ...fresh];
}

/** 句子掌握度：与词条共用 5 盒 Leitner 间隔。 */
export function gradeSentence(
  state: ProgressState,
  sentenceId: string,
  grade: 'again' | 'good',
): ProgressState {
  const prev = state.sentenceCards[sentenceId];
  const box = grade === 'good' ? Math.min((prev?.box ?? 0) + 1, 5) : 1;
  const due = Date.now() + BOX_DAYS[box] * 24 * 60 * 60 * 1000;
  return { ...state, sentenceCards: { ...state.sentenceCards, [sentenceId]: { box, due } } };
}

export function dueSentences(state: ProgressState, allSentenceIds: string[], now = Date.now()): string[] {
  const reviewed = allSentenceIds.filter((id) => {
    const c = state.sentenceCards[id];
    return c && c.due <= now;
  });
  const fresh = allSentenceIds.filter((id) => !state.sentenceCards[id]);
  return [...reviewed, ...fresh];
}

export function resetProgress(): ProgressState {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 忽略 */
  }
  return { ...DEFAULT_STATE };
}
