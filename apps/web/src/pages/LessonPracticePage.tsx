import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lessonById, unitOfLesson, getNextLesson } from '../content/curriculum';
import { exercisesOfLesson } from '../content/sentences';
import { type Exercise } from '../content/types';
import { useProgress } from '../components/ProgressContext';
import { checkFill } from '../lib/quiz';
import SpeakButton from '../components/SpeakButton';
import SentencePractice from '../components/SentencePractice';

function ChoiceExercise({ ex, onResult }: { ex: Extract<Exercise, { type: 'choice' }>; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const ok = submitted && picked === ex.answer;

  return (
    <div className="card mb16" style={submitted ? { background: ok ? 'var(--ok-bg)' : 'var(--err-bg)' } : {}}>
      <div className="flex gap12 mb12">
        {ex.audioText && <SpeakButton text={ex.audioText} />}
        <div style={{ fontWeight: 700, fontSize: 16 }}>{ex.prompt}</div>
      </div>
      <div className="flex gap12 wrap mb12">
        {ex.options.map((opt, i) => {
          let bg = 'var(--card)';
          if (submitted && i === ex.answer) bg = 'var(--ok-bg)';
          else if (submitted && i === picked && i !== ex.answer) bg = 'var(--err-bg)';
          else if (picked === i) bg = 'var(--orange-soft)';
          return (
            <button
              key={i}
              className="btn btn-sm"
              style={{ background: bg, minWidth: 90 }}
              disabled={submitted}
              onClick={() => setPicked(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button className="btn btn-primary btn-sm" disabled={picked === null} onClick={() => { setSubmitted(true); onResult(picked === ex.answer); }}>
          提交
        </button>
      ) : (
        <div className="anim-pop">
          <strong style={{ color: ok ? 'var(--ok)' : 'var(--err)' }}>{ok ? '✓ 答对了' : '✗ 再想想'}</strong>
          {ex.explain && <p className="muted mt8" style={{ fontSize: 14 }}>{ex.explain}</p>}
        </div>
      )}
    </div>
  );
}

function FillExercise({ ex, onResult }: { ex: Extract<Exercise, { type: 'fill' }>; onResult: (ok: boolean) => void }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const ok = submitted && checkFill(value, ex.answer, ex.accept);

  return (
    <div className="card mb16" style={submitted ? { background: ok ? 'var(--ok-bg)' : 'var(--err-bg)' } : {}}>
      <div className="flex gap12 mb12">
        <div style={{ fontWeight: 700, fontSize: 16 }}>{ex.prompt}</div>
      </div>
      <div className="flex gap12 wrap mb12">
        <input
          value={value}
          disabled={submitted}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && value.trim() && !submitted) { setSubmitted(true); onResult(checkFill(value, ex.answer, ex.accept)); } }}
          placeholder="输入答案…"
          style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, minWidth: 220, background: 'var(--card)' }}
        />
        {ex.hint && !submitted && (
          <button className="btn btn-sm" onClick={() => setHintShown(true)}>提示</button>
        )}
      </div>
      {hintShown && ex.hint && <p className="muted mb8" style={{ fontSize: 13 }}>提示：{ex.hint}</p>}
      {!submitted ? (
        <button className="btn btn-primary btn-sm" disabled={!value.trim()} onClick={() => { setSubmitted(true); onResult(checkFill(value, ex.answer, ex.accept)); }}>
          提交
        </button>
      ) : (
        <div className="anim-pop">
          <strong style={{ color: ok ? 'var(--ok)' : 'var(--err)' }}>{ok ? '✓ 答对了' : `✗ 正确答案：${ex.answer}`}</strong>
          {ex.explain && <p className="muted mt8" style={{ fontSize: 14 }}>{ex.explain}</p>}
        </div>
      )}
    </div>
  );
}

export default function LessonPracticePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state, complete, score } = useProgress();
  const lesson = lessonId ? lessonById.get(lessonId) : undefined;
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<string, boolean>>({});
  const [lessonAnswers, setLessonAnswers] = useState<Record<string, boolean>>({});

  if (!lesson) return <Navigate to="/learn" replace />;
  const unit = unitOfLesson(lesson);
  if (!unit) return <Navigate to="/learn" replace />;
  const next = getNextLesson(lesson.id);
  const isDone = state.completedLessons.includes(lesson.id);

  const sentenceExercises = exercisesOfLesson(lesson.id);
  const total = sentenceExercises.length + lesson.exercises.length;
  const answeredCount = Object.keys(sentenceAnswers).length + Object.keys(lessonAnswers).length;
  const allLessonAnswered = lesson.exercises.every((ex) => lessonAnswers[ex.id] !== undefined);
  const correctCount = Object.values(lessonAnswers).filter(Boolean).length;

  const answerLesson = (exId: string, ok: boolean) => {
    const nextAnswers = { ...lessonAnswers, [exId]: ok };
    setLessonAnswers(nextAnswers);
    if (lesson.exercises.every((ex) => nextAnswers[ex.id] !== undefined)) {
      score(lesson.id, {
        correct: Object.values(nextAnswers).filter(Boolean).length,
        total: lesson.exercises.length,
        at: Date.now(),
      });
    }
  };

  const handleComplete = () => {
    complete(lesson.id);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* 头部 */}
      <div className="mb16">
        <Link to={`/lesson/${lesson.id}`} className="muted" style={{ fontSize: 14 }}>← 返回学习</Link>
      </div>
      <div className="flex spread wrap gap12 mb16">
        <div>
          <span className="level-tag mb8" style={{ marginBottom: 8, display: 'inline-block' }}>{unit.level} · 单元{String(unit.order).padStart(2, '0')} · 第 {lesson.order} 课</span>
          <h1 style={{ fontSize: 34 }}>练习 · {lesson.title}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>
            本课共 {total} 题：句子练习 + 课文练习，集中一次完成。
          </p>
        </div>
        {isDone && <span className="stamp anim-stamp" style={{ fontSize: 18 }}>已完成 ✓</span>}
      </div>

      {total > 0 && (
        <div className="flex gap8 wrap mb24">
          <span className="chip">已答 {answeredCount} / {total}</span>
        </div>
      )}

      {total === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <strong>本课暂无练习题</strong>
          <p className="muted mt8">先回学习页把内容学完吧。</p>
          <Link to={`/lesson/${lesson.id}`} className="btn btn-primary mt16">返回学习 →</Link>
        </div>
      ) : (
        <>
          {/* 句子练习 */}
          {sentenceExercises.length > 0 && (
            <section className="section">
              <div className="section-head spread">
                <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
                  <h2>句子练习</h2>
                  <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 14 }}>{sentenceExercises.length}</span>
                </div>
                <span className="chip">已答 {Object.keys(sentenceAnswers).length}/{sentenceExercises.length}</span>
              </div>
              <SentencePractice
                lessonId={lesson.id}
                onAnswer={(exId, ok) => setSentenceAnswers((prev) => ({ ...prev, [exId]: ok }))}
              />
            </section>
          )}

          {/* 课文练习 */}
          <section className="section">
            <div className="section-head spread">
              <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
                <h2>课文练习</h2>
                <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 14 }}>{lesson.exercises.length}</span>
              </div>
              <span className="chip">已答 {Object.keys(lessonAnswers).length}/{lesson.exercises.length}</span>
            </div>
            {lesson.exercises.map((ex) =>
              ex.type === 'choice'
                ? <ChoiceExercise key={ex.id} ex={ex} onResult={(ok) => answerLesson(ex.id, ok)} />
                : <FillExercise key={ex.id} ex={ex} onResult={(ok) => answerLesson(ex.id, ok)} />
            )}
          </section>

          {/* 完成区 */}
          {allLessonAnswered && (
            <div className="card anim-pop" style={{ background: correctCount === lesson.exercises.length ? 'var(--ok-bg)' : 'var(--yellow-glow)', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                得分 {correctCount} / {lesson.exercises.length}
              </div>
              <p className="muted mb16">
                {correctCount === lesson.exercises.length ? '满分！发音肌肉已就位。' : '错题回看一下解析，再继续。'}
              </p>
              {!isDone ? (
                <button className="btn btn-primary" onClick={handleComplete}>
                  完成本课，盖章打卡 ✓
                </button>
              ) : next ? (
                <div className="flex gap12" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/lesson/${next.id}`} className="btn btn-primary">
                    下一课：{next.title} →
                  </Link>
                  <Link to={`/unit/${unit.id}`} className="btn">返回本单元</Link>
                </div>
              ) : (
                <Link to={`/unit/${unit.id}`} className="btn btn-primary">返回本单元 →</Link>
              )}
            </div>
          )}

          <div className="flex spread mt24">
            <Link to={`/lesson/${lesson.id}`} className="btn btn-sm">← 返回学习</Link>
            <span />
          </div>
        </>
      )}
    </div>
  );
}
