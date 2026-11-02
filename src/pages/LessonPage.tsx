import { useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lessonById, unitOfLesson, getNextLesson, getPrevLesson } from '../content/curriculum';
import { vocabById } from '../content/vocab';
import { POS_LABEL, type Exercise, type Dialogue, type VocabItem } from '../content/types';
import { useProgress } from '../components/ProgressContext';
import { checkFill } from '../lib/quiz';
import { speak, stopSpeaking } from '../lib/speech';
import SpeakButton, { type SpeakButtonHandle } from '../components/SpeakButton';
import SentenceSection from '../components/SentenceSection';

function VocabRow({ v }: { v: VocabItem }) {
  const speakRef = useRef<SpeakButtonHandle>(null);
  return (
    <div
      className="card word-card"
      style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}
      onClick={() => speakRef.current?.toggle()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          speakRef.current?.toggle();
        }
      }}
    >
      <SpeakButton ref={speakRef} text={v.vi} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex gap12 wrap">
          <span className="vi" style={{ fontWeight: 800, fontSize: 19 }}>{v.vi}</span>
          <span className="chip" style={{ fontSize: 12 }}>{POS_LABEL[v.pos]}</span>
          {v.hanViet && <span className="chip chip-yellow" style={{ fontSize: 12 }}>汉越：{v.hanViet}</span>}
        </div>
        <div style={{ marginTop: 2 }}>{v.zh}</div>
        {v.example && (
          <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
            <span className="vi">{v.example.vi}</span> — {v.example.zh}
          </div>
        )}
        {v.note && <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>※ {v.note}</div>}
      </div>
    </div>
  );
}

function ChoiceExercise({ ex, onResult }: { ex: Extract<Exercise, { type: 'choice' }>; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const ok = submitted && picked === ex.answer;

  return (
    <div className={`card mb16 ${submitted ? (ok ? '' : '') : ''}`} style={submitted ? { background: ok ? 'var(--ok-bg)' : 'var(--err-bg)' } : {}}>
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

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state, complete, score } = useProgress();
  const lesson = lessonId ? lessonById.get(lessonId) : undefined;
  const [showZh, setShowZh] = useState(false);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [playingDlg, setPlayingDlg] = useState<string | null>(null);
  const dlgTokenRef = useRef(0);

  if (!lesson) return <Navigate to="/learn" replace />;
  const unit = unitOfLesson(lesson)!;
  const next = getNextLesson(lesson.id);
  const prev = getPrevLesson(lesson.id);
  const allAnswered = answered.length === lesson.exercises.length;
  const correctCount = answered.filter(Boolean).length;
  const isDone = state.completedLessons.includes(lesson.id);

  const handleResult = (ok: boolean) => {
    const nextAnswers = [...answered, ok];
    setAnswered(nextAnswers);
    if (nextAnswers.length === lesson.exercises.length) {
      score(lesson.id, { correct: nextAnswers.filter(Boolean).length, total: lesson.exercises.length, at: Date.now() });
    }
  };

  const handleComplete = () => {
    complete(lesson.id);
    setFinished(true);
  };

  const handlePlayDialogue = async (d: Dialogue) => {
    // 正在播放同一段：停止
    if (playingDlg === d.id) {
      dlgTokenRef.current += 1;
      stopSpeaking();
      setPlayingDlg(null);
      return;
    }
    const token = ++dlgTokenRef.current;
    setPlayingDlg(d.id);
    for (const line of d.lines) {
      if (dlgTokenRef.current !== token) return;
      await speak(line.vi);
    }
    if (dlgTokenRef.current === token) setPlayingDlg(null);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* 头部 */}
      <div className="mb16">
        <Link to="/learn" className="muted" style={{ fontSize: 14 }}>← 返回课程地图</Link>
      </div>
      <div className="flex spread wrap gap12 mb16">
        <div>
          <span className="level-tag mb8" style={{ marginBottom: 8, display: 'inline-block' }}>{unit.level} · 单元{String(unit.order).padStart(2, '0')} · 第 {lesson.order} 课</span>
          <h1 style={{ fontSize: 34 }}>{lesson.title}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>
            本课目标：{lesson.goals.join(' · ')}
          </p>
        </div>
        {isDone && <span className="stamp anim-stamp" style={{ fontSize: 18 }}>已完成 ✓</span>}
      </div>

      {/* 词汇 */}
      <section className="section">
        <div className="section-head">
          <h2>词汇 · {lesson.vocabIds.length} 个</h2>
        </div>
        <div className="stagger" style={{ display: 'grid', gap: 12 }}>
          {lesson.vocabIds.map((vid) => <VocabRow key={vid} v={vocabById.get(vid)!} />)}
        </div>
      </section>

      {/* 句子 */}
      <SentenceSection lessonId={lesson.id} />

      {/* 语法 */}
      {lesson.grammar.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>语法</h2>
          </div>
          {lesson.grammar.map((g) => (
            <div key={g.id} className="card mb16">
              <h3 style={{ marginBottom: 10 }}>{g.title}</h3>
              <p style={{ lineHeight: 1.8 }}>{g.explanation}</p>
              <div className="mt16" style={{ display: 'grid', gap: 8 }}>
                {g.examples.map((ex, i) => (
                  <div key={i} className="flex gap12" style={{ padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: 'var(--bd-thin)' }}>
                    <SpeakButton text={ex.vi} size={30} />
                    <div>
                      <div className="vi" style={{ fontWeight: 700 }}>{ex.vi}</div>
                      <div className="muted" style={{ fontSize: 14 }}>{ex.zh}</div>
                    </div>
                  </div>
                ))}
              </div>
              {g.tips && (
                <div className="tip-bar mt16">
                  <div>
                    {g.tips.map((t, i) => <div key={i}>※ {t}</div>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 对话 */}
      {lesson.dialogues.length > 0 && (
        <section className="section">
          <div className="section-head spread">
            <h2>对话</h2>
            <button className="btn btn-sm" onClick={() => setShowZh(!showZh)}>
              {showZh ? '隐藏中文对照' : '显示中文对照'}
            </button>
          </div>
          {lesson.dialogues.map((d) => (
            <div key={d.id} className="card mb16">
              <div className="flex spread mb16">
                <strong>{d.title}</strong>
                <button
                  className="btn btn-sm btn-teal"
                  onClick={() => handlePlayDialogue(d)}
                  aria-pressed={playingDlg === d.id}
                >
                  {playingDlg === d.id ? (
                    <>
                      <span className="sound-wave" style={{ width: 16, height: 14 }} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      播放中
                    </>
                  ) : (
                    '▶ 整段朗读'
                  )}
                </button>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {d.lines.map((line, i) => (
                  <div key={i} className="flex gap12" style={{ alignItems: 'flex-start' }}>
                    <span className={`badge-num ${i % 2 ? 'teal' : ''}`} style={{ minWidth: 30, height: 30, fontSize: 13 }}>
                      {line.speaker.slice(0, 1)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="muted" style={{ fontSize: 12 }}>{line.speaker}</div>
                      <div className="flex gap8">
                        <span className="vi" style={{ fontWeight: 700, fontSize: 17 }}>{line.vi}</span>
                        <SpeakButton text={line.vi} size={28} />
                      </div>
                      {showZh && <div className="muted" style={{ fontSize: 14 }}>{line.zh}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 练习 */}
      <section className="section">
        <div className="section-head spread">
          <h2>练习 · {lesson.exercises.length} 题</h2>
          <span className="chip">已答 {answered.length}/{lesson.exercises.length}</span>
        </div>
        {lesson.exercises.map((ex) =>
          ex.type === 'choice'
            ? <ChoiceExercise key={ex.id} ex={ex} onResult={handleResult} />
            : <FillExercise key={ex.id} ex={ex} onResult={handleResult} />
        )}
        {allAnswered && (
          <div className="card anim-pop" style={{ background: correctCount === lesson.exercises.length ? 'var(--ok-bg)' : 'var(--yellow-glow)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              得分 {correctCount} / {lesson.exercises.length}
            </div>
            <p className="muted mb16">
              {correctCount === lesson.exercises.length ? '满分！发音肌肉已就位。' : '错题回看一下解析，再继续。'}
            </p>
            {!isDone && !finished && (
              <button className="btn btn-primary" onClick={handleComplete}>
                完成本课，盖章打卡 ✓
              </button>
            )}
            {(isDone || finished) && next && (
              <Link to={`/lesson/${next.id}`} className="btn btn-primary">
                下一课：{next.title} →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 上下课导航 */}
      <div className="flex spread mt24">
        {prev ? <Link to={`/lesson/${prev.id}`} className="btn btn-sm">← {prev.title}</Link> : <span />}
        {next && (isDone || finished) ? <Link to={`/lesson/${next.id}`} className="btn btn-sm btn-primary">{next.title} →</Link> : <span />}
      </div>
    </div>
  );
}
