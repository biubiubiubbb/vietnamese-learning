import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  const update = useCallback((next: ProgressState) => {
    setState(next);
    saveProgress(next);
  }, []);

  const api: ProgressApi = {
    state,
    complete: (lessonId) => update(completeLesson(state, lessonId)),
    score: (lessonId, s) => update(recordScore(state, lessonId, s)),
    grade: (vocabId, g) => update(gradeCard(state, vocabId, g)),
    gradeSentence: (sentenceId, g) => update(gradeSentence(state, sentenceId, g)),
    reset: () => update(resetProgress()),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
