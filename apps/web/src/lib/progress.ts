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
const DAY_MS = 24 * 60 * 60 * 1000;

export function emptyProgress(): ProgressState {
  return { completedLessons: [], scores: {}, cards: {}, sentenceCards: {} };
}

/** 与词条、句子共用的 5 盒 Leitner 间隔计算。 */
function nextCard(prev: CardState | undefined, grade: 'again' | 'good'): CardState {
  const box = grade === 'good' ? Math.min((prev?.box ?? 0) + 1, 5) : 1;
  return { box, due: Date.now() + BOX_DAYS[box] * DAY_MS };
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
  return {
    ...state,
    cards: { ...state.cards, [vocabId]: nextCard(state.cards[vocabId], grade) },
  };
}

/** 句子掌握度：与词条共用 5 盒 Leitner 间隔。 */
export function gradeSentence(
  state: ProgressState,
  sentenceId: string,
  grade: 'again' | 'good',
): ProgressState {
  return {
    ...state,
    sentenceCards: {
      ...state.sentenceCards,
      [sentenceId]: nextCard(state.sentenceCards[sentenceId], grade),
    },
  };
}

/** 先排到期复现的卡，再排从未学过的卡。 */
function dueIds(cards: Record<string, CardState>, allIds: string[], now: number): string[] {
  const reviewed = allIds.filter((id) => {
    const c = cards[id];
    return c && c.due <= now;
  });
  const fresh = allIds.filter((id) => !cards[id]);
  return [...reviewed, ...fresh];
}

export function dueCards(state: ProgressState, allVocabIds: string[], now = Date.now()): string[] {
  return dueIds(state.cards, allVocabIds, now);
}

export function dueSentences(state: ProgressState, allSentenceIds: string[], now = Date.now()): string[] {
  return dueIds(state.sentenceCards, allSentenceIds, now);
}
