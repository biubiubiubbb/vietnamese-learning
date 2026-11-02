import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VOCAB } from '../content/vocab';
import { SENTENCES } from '../content/sentences';
import type { VocabItem } from '../content/types';
import { useProgress } from '../components/ProgressContext';
import { dueCards, dueSentences } from '../lib/progress';
import SpeakButton, { type SpeakButtonHandle } from '../components/SpeakButton';
import { SentenceReview } from '../components/SentenceSection';

function WordReview({ deck, onDone }: { deck: VocabItem[]; onDone: () => void }) {
  const { grade } = useProgress();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const speakRef = useRef<SpeakButtonHandle>(null);

  if (deck.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>今天没有待复习的词条</strong>
        <p className="muted mt8">直接进句子复习，或者去课程里学新词。</p>
        <button className="btn btn-primary mt16" onClick={onDone}>继续复习句子 →</button>
      </div>
    );
  }

  if (idx >= deck.length) {
    return (
      <div className="card anim-pop" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>本轮词条复习完成！</strong>
        <p className="muted mt8">共复习 {deck.length} 个词条。</p>
        <div className="flex gap12 mt16" style={{ justifyContent: 'center' }}>
          <Link to="/vocabulary" className="btn">去词汇页</Link>
          <button className="btn btn-primary" onClick={onDone}>继续复习句子 →</button>
        </div>
      </div>
    );
  }

  const v = deck[idx];

  const handleGrade = (g: 'again' | 'good') => {
    grade(v.id, g);
    setFlipped(false);
    setIdx(idx + 1);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="flex spread mb16">
        <span className="chip">词条 {idx + 1} / {deck.length}</span>
      </div>
      <div
        className="card"
        style={{ textAlign: 'center', padding: 48, cursor: 'pointer', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}
        onClick={() => speakRef.current?.toggle()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(!flipped); } }}
        aria-label={`朗读词条 ${v.vi}`}
      >
        <div className="flex" style={{ justifyContent: 'center', gap: 12 }}>
          <span className="vi" style={{ fontWeight: 800, fontSize: 34 }}>{v.vi}</span>
          <SpeakButton ref={speakRef} text={v.vi} size={38} />
        </div>
        {flipped && (
          <div className="anim-pop">
            <div style={{ fontSize: 20, marginTop: 8 }}>{v.zh}</div>
            {v.hanViet && <div className="chip chip-yellow mt8">汉越：{v.hanViet}</div>}
            {v.example && (
              <div className="muted mt12" style={{ fontSize: 14 }}>
                <span className="vi">{v.example.vi}</span><br />{v.example.zh}
              </div>
            )}
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

export default function ReviewPage() {
  const { state } = useProgress();
  const [stage, setStage] = useState<'words' | 'sentences'>('words');

  // 进入页面时冻结本轮的词条牌堆，评分后牌堆变动不会导致跳卡
  const [wordDeck] = useState<VocabItem[]>(() => {
    const ids = dueCards(state, VOCAB.map((v) => v.id)).slice(0, 20);
    const byId = new Map(VOCAB.map((v) => [v.id, v]));
    return ids.map((id) => byId.get(id)!).filter(Boolean);
  });

  const dueWord = Math.min(dueCards(state, VOCAB.map((v) => v.id)).length, 20);
  const dueSentence = Math.min(dueSentences(state, SENTENCES.map((s) => s.id)).length, 20);

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="flex spread wrap gap12 mb8">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 4 }}>复习</h1>
        </div>
        <div className="flex gap8">
          <button
            type="button"
            className={`tag-chip${stage === 'words' ? ' tag-chip-on' : ''}`}
            onClick={() => setStage('words')}
          >
            ① 词条 {dueWord}
          </button>
          <button
            type="button"
            className={`tag-chip${stage === 'sentences' ? ' tag-chip-on' : ''}`}
            onClick={() => setStage('sentences')}
          >
            ② 句子 {dueSentence}
          </button>
        </div>
      </div>

      <div className="mb24" />

      {stage === 'words' ? (
        <WordReview deck={wordDeck} onDone={() => setStage('sentences')} />
      ) : (
        <>
          <SentenceReview key="review-sentences" sentences={SENTENCES} scope="all" />
          <div className="flex gap12 mt16" style={{ justifyContent: 'center' }}>
            <button className="btn btn-sm" onClick={() => setStage('words')}>← 回到词条</button>
            <Link to="/progress" className="btn btn-sm">看学习进度</Link>
          </div>
        </>
      )}
    </div>
  );
}
