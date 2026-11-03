import { useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lessonById, unitOfLesson, getNextLesson, getPrevLesson } from '../content/curriculum';
import { vocabById } from '../content/vocab';
import { exercisesOfLesson } from '../content/sentences';
import { POS_LABEL, type Dialogue, type VocabItem } from '../content/types';
import { useProgress } from '../components/ProgressContext';
import { speak, stopSpeaking, dialogueVoiceFor, getPreferredVoice } from '../lib/speech';
import SpeakButton, { type SpeakButtonHandle } from '../components/SpeakButton';
import SentenceSection from '../components/SentenceSection';

/** 词汇默认只展示前 18 个，超出后折叠，避免上百个词把页面拉得过长 */
const VOCAB_PREVIEW = 18;

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

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state } = useProgress();
  const lesson = lessonId ? lessonById.get(lessonId) : undefined;
  const [showZh, setShowZh] = useState(false);
  const [showAllVocab, setShowAllVocab] = useState(false);
  const [playingDlg, setPlayingDlg] = useState<string | null>(null);
  const dlgTokenRef = useRef(0);

  if (!lesson) return <Navigate to="/learn" replace />;
  const unit = unitOfLesson(lesson)!;
  const next = getNextLesson(lesson.id);
  const prev = getPrevLesson(lesson.id);
  const isDone = state.completedLessons.includes(lesson.id);
  const practiceCount = exercisesOfLesson(lesson.id).length + lesson.exercises.length;

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
    // 一场对话内固定用一男一女交替朗读，避免中途切换音色
    const lead = getPreferredVoice();
    const speakers = [...new Set(d.lines.map((line) => line.speaker))];
    for (const line of d.lines) {
      if (dlgTokenRef.current !== token) return;
      const voice = dialogueVoiceFor(speakers.indexOf(line.speaker), lead);
      await speak(line.vi, undefined, voice);
    }
    if (dlgTokenRef.current === token) setPlayingDlg(null);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* 头部 */}
      <div className="mb16">
        <Link to={`/unit/${unit.id}`} className="muted" style={{ fontSize: 14 }}>← 返回单元</Link>
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
          <h2>词汇</h2>
          <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 14 }}>{lesson.vocabIds.length}</span>
        </div>
        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}
        >
          {(showAllVocab ? lesson.vocabIds : lesson.vocabIds.slice(0, VOCAB_PREVIEW)).map((vid) => (
            <VocabRow key={vid} v={vocabById.get(vid)!} />
          ))}
        </div>
        {lesson.vocabIds.length > VOCAB_PREVIEW && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button className="btn btn-sm" onClick={() => setShowAllVocab((v) => !v)}>
              {showAllVocab ? '收起词汇 ↑' : `展开全部 ${lesson.vocabIds.length} 个词 ↓`}
            </button>
          </div>
        )}
      </section>

      {/* 句子（仅学习，不含练习） */}
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

      {/* 去练习 */}
      <section className="section">
        <div className="card" style={{ background: 'var(--teal-soft)', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>学完了？去练习巩固一下</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              {practiceCount > 0
                ? `本课共 ${practiceCount} 题：句子练习 + 课文练习，集中在练习页一次完成。`
                : '本课暂无练习题。'}
            </div>
          </div>
          {practiceCount > 0 && (
            <Link to={`/lesson/${lesson.id}/practice`} className="btn btn-primary" style={{ fontSize: 17 }}>
              {isDone ? '再练一次' : '去练习'} · {practiceCount} 题 →
            </Link>
          )}
        </div>
      </section>

      {/* 上下课导航 */}
      <div className="flex spread mt24">
        {prev ? <Link to={`/lesson/${prev.id}`} className="btn btn-sm">← {prev.title}</Link> : <span />}
        {next && isDone ? <Link to={`/lesson/${next.id}`} className="btn btn-sm btn-primary">{next.title} →</Link> : <span />}
      </div>
    </div>
  );
}
