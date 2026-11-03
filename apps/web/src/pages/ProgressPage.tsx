import { Link } from 'react-router-dom';
import { UNITS, LESSONS, unitProgress } from '../content/curriculum';
import { VOCAB_IDS } from '../content/vocab';
import { useProgress } from '../components/ProgressContext';
import { dueCards, dueSentences } from '../lib/progress';
import { SENTENCE_IDS } from '../content/sentences';
import ProgressBar from '../components/ProgressBar';

export default function ProgressPage() {
  const { state, reset } = useProgress();
  const doneCount = state.completedLessons.length;
  const due = Math.min(dueCards(state, VOCAB_IDS).length, 20);
  const dueSentence = Math.min(dueSentences(state, SENTENCE_IDS).length, 20);

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 34, marginBottom: 24 }}>学习进度</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }} className="mb24">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', color: 'var(--orange)' }}>{doneCount}<span className="muted" style={{ fontSize: 16 }}>/{LESSONS.length}</span></div>
          <div className="muted" style={{ fontSize: 14 }}>已完成课次</div>
        </div>
        <Link to="/review" className="card" style={{ textAlign: 'center', display: 'block' }}>
          <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', color: 'var(--orange-deep)' }}>{due}</div>
          <div className="muted" style={{ fontSize: 14 }}>待复习词条 →</div>
        </Link>
        <Link to="/review" className="card" style={{ textAlign: 'center', display: 'block' }}>
          <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', color: 'var(--teal)' }}>{dueSentence}</div>
          <div className="muted" style={{ fontSize: 14 }}>待复习句子 →</div>
        </Link>
      </div>

      <section className="section">
        <div className="section-head"><h2>单元完成度</h2></div>
        <div style={{ display: 'grid', gap: 14 }}>
          {UNITS.map((u) => {
            const { done, total } = unitProgress(u, state.completedLessons);
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <div key={u.id} className="card" style={{ padding: 16 }}>
                <div className="flex spread mb8">
                  <div className="flex gap12">
                    <span className={`badge-num ${done === total ? 'done' : 'idle'}`} style={{ minWidth: 30, height: 30, fontSize: 13 }}>
                      {String(u.order).padStart(2, '0')}
                    </span>
                    <div>
                      <strong>{u.title}</strong>
                      <span className="muted" style={{ fontSize: 13, marginLeft: 8 }}>{u.level}</span>
                    </div>
                  </div>
                  <span className="muted" style={{ fontSize: 14 }}>{done}/{total} 课</span>
                </div>
                <ProgressBar value={pct} height={12} />
              </div>
            );
          })}
        </div>
      </section>

      <details style={{ marginTop: 40 }}>
        <summary className="muted" style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
          重置学习进度
        </summary>
        <div className="flex spread wrap gap12" style={{ marginTop: 10, padding: '10px 2px' }}>
          <span className="muted" style={{ fontSize: 13 }}>
            清除所有课次完成记录、练习成绩与复习计划，不可恢复。
          </span>
          <button
            className="btn btn-sm"
            style={{ background: 'var(--err-bg)', color: 'var(--err)' }}
            onClick={() => {
              if (window.confirm('确定要清除全部学习进度吗？此操作不可恢复。')) reset();
            }}
          >
            全部重置
          </button>
        </div>
      </details>
    </div>
  );
}
