import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import {
  loadProgress,
  saveProgress,
  completeLesson,
  recordScore,
  gradeCard,
  gradeSentence,
  resetProgress,
  type ProgressState,
  type QuizScore,
} from '../lib/progress';

interface ProgressApi {
  state: ProgressState;
  complete: (lessonId: string) => void;
  score: (lessonId: string, s: QuizScore) => void;
  grade: (vocabId: string, g: 'again' | 'good') => void;
  gradeSentence: (sentenceId: string, g: 'again' | 'good') => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress);
  // 用 ref 读取最新状态，连续多次更新时不会因闭包拿到旧 state。
  const stateRef = useRef(state);

  const update = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    const next = updater(stateRef.current);
    stateRef.current = next;
    setState(next);
    saveProgress(next);
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      complete: (lessonId) => update((prev) => completeLesson(prev, lessonId)),
      score: (lessonId, s) => update((prev) => recordScore(prev, lessonId, s)),
      grade: (vocabId, g) => update((prev) => gradeCard(prev, vocabId, g)),
      gradeSentence: (sentenceId, g) => update((prev) => gradeSentence(prev, sentenceId, g)),
      reset: () => update(() => resetProgress()),
    }),
    [state, update],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
