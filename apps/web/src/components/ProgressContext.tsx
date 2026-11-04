import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, type ReactNode } from 'react';
import {
  emptyProgress,
  completeLesson,
  recordScore,
  gradeCard,
  gradeSentence,
  type ProgressState,
  type QuizScore,
} from '../lib/progress';
import { accountApi } from '../lib/account';
import { useAuth } from './AuthContext';

interface ProgressApi {
  state: ProgressState;
  ready: boolean;
  complete: (lessonId: string) => void;
  score: (lessonId: string, s: QuizScore) => void;
  grade: (vocabId: string, g: 'again' | 'good') => void;
  gradeSentence: (sentenceId: string, g: 'again' | 'good') => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading, handleApiError } = useAuth();
  const [state, setState] = useState<ProgressState>(emptyProgress);
  const [loadedUserId, setLoadedUserId] = useState<number | null>(null);
  // 登录状态确认且账号进度拉取完成后，页面才渲染，避免复习牌堆用空进度初始化。
  const ready = !loading && (user ? loadedUserId === user.id : true);
  // 用 ref 读取最新状态，连续多次更新时不会因闭包拿到旧 state。
  const stateRef = useRef(state);

  useEffect(() => {
    let cancelled = false;
    const blank = emptyProgress();
    stateRef.current = blank;
    setState(blank);
    if (!user) return () => { cancelled = true; };
    accountApi
      .progress()
      .then((data) => {
        if (cancelled) return;
        stateRef.current = data;
        setState(data);
        setLoadedUserId(user.id);
      })
      .catch((error) => {
        if (cancelled) return;
        handleApiError(error);
        setLoadedUserId(user.id);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, handleApiError]);

  const update = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    const next = updater(stateRef.current);
    stateRef.current = next;
    setState(next);
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      ready,
      complete: (lessonId) => {
        if (!user) return;
        accountApi
          .completeLesson(lessonId)
          .then(() => update((prev) => completeLesson(prev, lessonId)))
          .catch(handleApiError);
      },
      score: (lessonId, s) => {
        if (!user) return;
        accountApi
          .saveScore(lessonId, s.correct, s.total)
          .then(() => update((prev) => recordScore(prev, lessonId, s)))
          .catch(handleApiError);
      },
      grade: (vocabId, g) => {
        if (!user) return;
        accountApi
          .gradeCard('vocab', vocabId, g)
          .then(() => update((prev) => gradeCard(prev, vocabId, g)))
          .catch(handleApiError);
      },
      gradeSentence: (sentenceId, g) => {
        if (!user) return;
        accountApi
          .gradeCard('sentence', sentenceId, g)
          .then(() => update((prev) => gradeSentence(prev, sentenceId, g)))
          .catch(handleApiError);
      },
      reset: () => {
        if (!user) return;
        accountApi
          .resetProgress()
          .then(() => update(() => emptyProgress()))
          .catch(handleApiError);
      },
    }),
    [state, ready, update, user, handleApiError],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
