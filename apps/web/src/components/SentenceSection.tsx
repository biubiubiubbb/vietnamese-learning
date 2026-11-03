import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SENTENCES, sentenceById, sentencesOfLesson } from '../content/sentences';
import { vocabById } from '../content/vocab';
import { dueSentences } from '../lib/progress';
import { useProgress } from './ProgressContext';
import SpeakButton, { type SpeakButtonHandle } from './SpeakButton';
import {
  CHUNK_ROLE_COLOR,
  CHUNK_ROLE_LABEL,
  SENTENCE_TAG_COLOR,
  SENTENCE_TAG_LABEL,
  type Sentence,
  type SentenceTag,
} from '../content/types';

type Scope = 'lesson' | 'learned' | 'all';

const ALL_TAGS = Object.keys(SENTENCE_TAG_LABEL) as SentenceTag[];

function ChunkLegend() {
  return (
    <div className="chunk-legend mt8">
      {(Object.keys(CHUNK_ROLE_LABEL) as Array<keyof typeof CHUNK_ROLE_LABEL>).map((r) => (
        <span key={r}>
          <i style={{ background: CHUNK_ROLE_COLOR[r] }} />
          {CHUNK_ROLE_LABEL[r]}
        </span>
      ))}
    </div>
  );
}

function SentenceCard({ s, showZh }: { s: Sentence; showZh: boolean }) {
  const { state } = useProgress();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const card = state.sentenceCards[s.id];
  const zhVisible = showZh || revealed;
  const chunk = selected === null ? null : s.chunks[selected];
  const hanViet = chunk?.vocabId ? vocabById.get(chunk.vocabId)?.hanViet : undefined;

  return (
    <div className="card sentence-card">
      <div className="flex spread gap8 wrap mb8">
        <div className="flex gap8">
          <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 12 }}>{s.order}</span>
          <span className="chip" style={{ fontSize: 12 }}>
            <i className="tag-dot" style={{ background: SENTENCE_TAG_COLOR[s.tag] }} />
            {SENTENCE_TAG_LABEL[s.tag]}
          </span>
          {card && <span className="chip chip-teal" style={{ fontSize: 12 }}>复习 {card.box}/5 盒</span>}
        </div>
        <button type="button" className="btn btn-sm" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? '收起拆解' : '拆解'}
        </button>
      </div>

      <div
        className="flex gap8 wrap"
        style={{ alignItems: 'flex-start', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label={zhVisible ? '隐藏中文释义' : '显示中文释义'}
        onClick={() => setRevealed((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setRevealed((v) => !v);
          }
        }}
      >
        <span className="sentence-vi">{s.vi}</span>
        <SpeakButton text={s.vi} size={30} />
      </div>

      {zhVisible && <div className="mt8" style={{ fontSize: 15 }}>{s.zh}</div>}

      {open && (
        <div className="mt12 anim-pop">
          <div className="flex gap8 wrap">
            {s.chunks.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`sentence-chunk${selected === i ? ' on' : ''}`}
                style={{ borderBottomColor: CHUNK_ROLE_COLOR[c.role] }}
                aria-label={`词块 ${c.vi}，${CHUNK_ROLE_LABEL[c.role]}`}
                aria-pressed={selected === i}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                {c.vi}
              </button>
            ))}
          </div>
          {chunk && (
            <div className="chunk-panel mt8">
              <strong className="vi">{chunk.vi}</strong> — {chunk.zh} · {CHUNK_ROLE_LABEL[chunk.role]}
              {hanViet ? ` · 汉越：${hanViet}` : ''}
            </div>
          )}
          <ChunkLegend />
        </div>
      )}

      {s.note && (
        <div className="tip-bar mt12">
          <div>※ {s.note}</div>
        </div>
      )}
    </div>
  );
}

export function SentenceReview({ sentences, scope }: { sentences: Sentence[]; scope: Scope }) {
  const { state, gradeSentence } = useProgress();
  // 进入复习时冻结牌堆，避免评分后牌堆变动导致跳卡
  const [deck] = useState(() =>
    dueSentences(state, sentences.map((s) => s.id))
      .slice(0, 20)
      .map((id) => sentenceById.get(id))
      .filter((s): s is Sentence => Boolean(s)),
  );
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const speakRef = useRef<SpeakButtonHandle>(null);

  if (sentences.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 36 }}>
        <strong>这个筛选下没有可复习的句子</strong>
        <p className="muted mt8">换个范围或句型标签试试。</p>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>这批句子都复习完了</strong>
        <p className="muted mt8">
          {scope === 'all' ? '全部句子的复习计划都已排好，明天再来。' : '切换到「全部」范围，或去学新单元。'}
        </p>
      </div>
    );
  }

  if (idx >= deck.length) {
    return (
      <div className="card anim-pop" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>本轮复习完成！</strong>
        <p className="muted mt8">共复习 {deck.length} 个句子。</p>
      </div>
    );
  }

  const s = deck[idx];

  const handleGrade = (g: 'again' | 'good') => {
    gradeSentence(s.id, g);
    setFlipped(false);
    setIdx(idx + 1);
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="flex spread mb16">
        <span className="chip">第 {idx + 1} / {deck.length} 张</span>
      </div>

      <div
        className="card"
        style={{ textAlign: 'center', padding: 40, cursor: 'pointer', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}
        onClick={() => speakRef.current?.toggle()}
        role="button"
        tabIndex={0}
        aria-label={`朗读句子 ${s.vi}`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setFlipped(!flipped);
          }
        }}
      >
        <div className="flex" style={{ justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="sentence-vi">{s.vi}</span>
          <SpeakButton ref={speakRef} text={s.vi} size={34} />
        </div>
        {flipped && (
          <div className="anim-pop">
            <div style={{ fontSize: 18, marginTop: 6 }}>{s.zh}</div>
            <div className="flex gap8 wrap mt12" style={{ justifyContent: 'center' }}>
              {s.chunks.map((c, i) => (
                <span
                  key={i}
                  className="chip"
                  style={{ fontSize: 12, borderBottom: `3px solid ${CHUNK_ROLE_COLOR[c.role]}` }}
                >
                  <span className="vi">{c.vi}</span> · {c.zh}
                </span>
              ))}
            </div>
            {s.note && <div className="tip-bar mt16" style={{ textAlign: 'left' }}><div>※ {s.note}</div></div>}
          </div>
        )}
      </div>

      <div className="flex gap16 mt16" style={{ justifyContent: 'center' }}>
        <button className="btn btn-review btn-review-miss" onClick={() => handleGrade('again')}>
          忘了
        </button>
        <button className="btn btn-review btn-review-show" onClick={() => setFlipped(true)} disabled={flipped}>
          显示答案
        </button>
        <button className="btn btn-review btn-review-ok" onClick={() => handleGrade('good')}>
          记住了 ✓
        </button>
      </div>
    </div>
  );
}

export default function SentenceSection({ lessonId }: { lessonId: string }) {
  const { state } = useProgress();
  const [scope, setScope] = useState<Scope>('lesson');
  const [activeTags, setActiveTags] = useState<SentenceTag[]>([]);
  const [showZh, setShowZh] = useState(false);

  const lessonSentences = useMemo(() => sentencesOfLesson(lessonId), [lessonId]);

  const scoped = useMemo(() => {
    if (scope === 'lesson') return lessonSentences;
    if (scope === 'learned') return SENTENCES.filter((s) => state.completedLessons.includes(s.lessonId));
    return SENTENCES;
  }, [scope, lessonSentences, state.completedLessons]);

  const filtered = useMemo(
    () => scoped.filter((s) => activeTags.length === 0 || activeTags.includes(s.tag)),
    [scoped, activeTags],
  );

  if (lessonSentences.length === 0) return null;

  const dueCount = Math.min(dueSentences(state, filtered.map((s) => s.id)).length, 20);

  const toggleTag = (t: SentenceTag) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <section className="section">
      <div className="section-head spread">
        <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
          <h2>句子</h2>
          <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 14 }}>{lessonSentences.length}</span>
        </div>
        <div className="flex gap8 wrap">
          <Link to="/review" className="btn btn-sm btn-yellow">
            复习（{dueCount}）→
          </Link>
          <button type="button" className="btn btn-sm" onClick={() => setShowZh(!showZh)} aria-pressed={showZh}>
            {showZh ? '隐藏中文对照' : '显示中文对照'}
          </button>
        </div>
      </div>

      <div className="flex gap8 wrap mb8">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>范围</span>
        {([
          ['lesson', '本课'],
          ['learned', '已学'],
          ['all', '全部'],
        ] as Array<[Scope, string]>).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tag-chip${scope === key ? ' tag-chip-on' : ''}`}
            aria-pressed={scope === key}
            onClick={() => setScope(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap8 wrap mb16">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>句型</span>
        {ALL_TAGS.map((t) => {
          const on = activeTags.includes(t);
          return (
            <button
              key={t}
              type="button"
              className={`tag-chip${on ? ' tag-chip-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggleTag(t)}
            >
              <i className="tag-dot" style={{ background: SENTENCE_TAG_COLOR[t] }} />
              {SENTENCE_TAG_LABEL[t]}
            </button>
          );
        })}
        {activeTags.length > 0 && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setActiveTags([])}>清除</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <strong>这个筛选下没有句子</strong>
          <p className="muted mt8">换个范围或句型标签试试。</p>
        </div>
      ) : (
        <div className="stagger" style={{ display: 'grid', gap: 12 }}>
          {filtered.map((s) => <SentenceCard key={s.id} s={s} showZh={showZh} />)}
        </div>
      )}
    </section>
  );
}
