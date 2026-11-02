import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VOCAB } from '../content/vocab';
import { POS_LABEL, TAG_LABEL, TAG_COLOR, type VocabTag, type VocabItem } from '../content/types';
import { useProgress } from '../components/ProgressContext';
import { dueCards } from '../lib/progress';
import SpeakButton, { type SpeakButtonHandle } from '../components/SpeakButton';

const ALL_TAGS = Object.keys(TAG_LABEL) as VocabTag[];

function VocabCard({ v }: { v: VocabItem }) {
  const { state } = useProgress();
  const card = state.cards[v.id];
  const speakRef = useRef<SpeakButtonHandle>(null);
  return (
    <div
      className="card word-card"
      style={{ padding: 16 }}
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
      <div className="flex spread mb8">
        <span className="vi" style={{ fontWeight: 800, fontSize: 20 }}>{v.vi}</span>
        <SpeakButton ref={speakRef} text={v.vi} size={28} />
      </div>
      <div style={{ fontSize: 15 }}>{v.zh}</div>
      <div className="flex gap8 wrap mt8">
        <span className="chip" style={{ fontSize: 12 }}>{POS_LABEL[v.pos]}</span>
        {v.hanViet && <span className="chip chip-yellow" style={{ fontSize: 12 }}>汉越：{v.hanViet}</span>}
        {card && <span className="chip chip-teal" style={{ fontSize: 12 }}>复习 {card.box}/5 盒</span>}
      </div>
      {v.tags && v.tags.length > 0 && (
        <div className="flex gap6 wrap mt8">
          {v.tags.map((t) => (
            <span key={t} className="card-tag">
              <i className="tag-dot" style={{ background: TAG_COLOR[t] }} />
              {TAG_LABEL[t]}
            </span>
          ))}
        </div>
      )}
      {v.example && (
        <div className="muted mt8" style={{ fontSize: 13 }}>
          <span className="vi">{v.example.vi}</span> — {v.example.zh}
        </div>
      )}
    </div>
  );
}

export default function VocabularyPage() {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<VocabTag[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const { state } = useProgress();

  const toggleTag = (t: VocabTag) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const filtered = useMemo(() => {
    return VOCAB.filter((v) => {
      const q = query.trim().toLowerCase();
      if (q && !(v.vi.toLowerCase().includes(q) || v.zh.includes(q) || (v.hanViet ?? '').includes(q))) {
        return false;
      }
      if (activeTags.length > 0) {
        const tags = v.tags ?? [];
        if (!activeTags.every((t) => tags.includes(t))) return false;
      }
      return true;
    });
  }, [query, activeTags]);

  const dueCount = useMemo(
    () => Math.min(dueCards(state, VOCAB.map((v) => v.id)).length, 20),
    [state],
  );

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="flex spread wrap gap12 mb24">
        <h1 style={{ fontSize: 34 }}>词汇</h1>
        <Link to="/review" className="btn btn-sm btn-yellow">
          复习（{dueCount}）
        </Link>
      </div>

      <div className="flex gap12 wrap mb8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索越南语 / 中文 / 汉越词…"
          style={{ flex: '1 1 260px', padding: '10px 16px', border: 'var(--bd)', borderRadius: 999, background: 'var(--card)', boxShadow: 'var(--shadow-xs)' }}
        />
        <button
          type="button"
          className={`btn btn-sm${tagsOpen || activeTags.length > 0 ? ' btn-yellow' : ''}`}
          aria-expanded={tagsOpen}
          onClick={() => setTagsOpen((v) => !v)}
        >
          筛选{activeTags.length > 0 ? `（${activeTags.length}）` : ''}
        </button>
        {activeTags.length > 0 && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setActiveTags([])}>清除</button>
        )}
      </div>

      {tagsOpen && (
        <div className="flex gap8 wrap mb16 anim-pop">
          {ALL_TAGS.map((t) => {
            const on = activeTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                className={`tag-chip${on ? ' tag-chip-on' : ''}`}
                onClick={() => toggleTag(t)}
                aria-pressed={on}
              >
                <i className="tag-dot" style={{ background: TAG_COLOR[t] }} />
                {TAG_LABEL[t]}
              </button>
            );
          })}
        </div>
      )}

      <p className="muted mb16" style={{ fontSize: 14 }}>共 {filtered.length} 个词条</p>
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <strong>没有找到匹配的词条</strong>
          <p className="muted mt8">换个关键词或清除筛选试试。</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {filtered.map((v) => <VocabCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
