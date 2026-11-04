import { Link } from 'react-router-dom';
import { UNITS, LESSONS, unitProgress } from '../content/curriculum';
import { VOCAB_IDS } from '../content/vocab';
import { SENTENCE_IDS } from '../content/sentences';
import { TONES } from '../content/pronunciation';
import { useProgress } from '../components/ProgressContext';
import { dueCards, dueSentences } from '../lib/progress';
import { selectCurrentUnit } from '../lib/homeView';
import ProgressBar from '../components/ProgressBar';

export default function HomePage() {
  const { state } = useProgress();
  const nextLesson = LESSONS.find((l) => !state.completedLessons.includes(l.id)) ?? LESSONS[0];
  if (!nextLesson) {
    return (
      <div className="container" style={{ paddingTop: 44, paddingBottom: 60 }}>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <strong style={{ fontSize: 18 }}>还没有课程</strong>
          <p className="muted mt8">请先在后台创建单元与课程。</p>
        </div>
      </div>
    );
  }
  const doneCount = state.completedLessons.length;
  const dueWord = Math.min(dueCards(state, VOCAB_IDS).length, 20);
  const dueSentence = Math.min(dueSentences(state, SENTENCE_IDS).length, 20);
  const currentUnit = selectCurrentUnit(UNITS, nextLesson.id);
  const unitStat = currentUnit ? unitProgress(currentUnit, state.completedLessons) : { done: 0, total: 0 };
  const unitPct = unitStat.total ? (unitStat.done / unitStat.total) * 100 : 0;

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 60 }}>
      {/* Hero */}
      <section className="section" style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 460px' }}>
          <span className="chip chip-teal mb16">面向中文母语者 · 河内音</span>
          <h1 style={{ marginBottom: 28 }}>
            学越南语，<br />从「六个声调」开始
          </h1>
          <div className="flex gap12 wrap">
            <Link to={`/lesson/${nextLesson.id}`} className="btn btn-primary" style={{ fontSize: 17 }}>
              {doneCount > 0 ? `继续：${nextLesson.title} →` : '开始第一课 →'}
            </Link>
            <Link to="/review" className="btn">今日复习</Link>
          </div>
        </div>
        <div className="card anim-pop" style={{ flex: '0 1 320px', background: 'var(--teal-soft)' }}>
          <div className="flex spread mb8">
            <strong>你的进度</strong>
            <span className="stamp">闯关手账</span>
          </div>
          <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', color: 'var(--teal)' }}>
            {doneCount}<span style={{ fontSize: 18, color: 'var(--ink-soft)' }}> / {LESSONS.length} 课</span>
          </div>
          <ProgressBar value={(doneCount / LESSONS.length) * 100} />
        </div>
      </section>

      {/* 今日任务 */}
      <section className="section">
        <div className="section-head">
          <h2 style={{ fontSize: 24 }}>今日任务</h2>
          <span className="chip chip-yellow">约 10 分钟</span>
        </div>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
          <Link to="/review" className="card" style={{ padding: 18 }}>
            <div className="flex spread mb8">
              <span className="badge-num">1</span>
              <span className="muted" style={{ fontSize: 13 }}>另有 {dueSentence} 句</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>复习 {dueWord} 个词</div>
          </Link>
          <Link to={`/lesson/${nextLesson.id}`} className="card" style={{ padding: 18 }}>
            <div className="flex spread mb8">
              <span className="badge-num teal">2</span>
              <span className="muted" style={{ fontSize: 13 }}>第 {nextLesson.order} 课</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>学 1 新课</div>
            <div className="muted" style={{ fontSize: 13 }}>{nextLesson.title}</div>
          </Link>
          <Link to="/practice?mode=dictation" className="card" style={{ padding: 18 }}>
            <div className="flex spread mb8">
              <span className="badge-num" style={{ background: 'var(--yellow)' }}>3</span>
              <span className="muted" style={{ fontSize: 13 }}>听力</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>听写 5 句</div>
          </Link>
        </div>
      </section>

      {/* 当前单元 */}
      {currentUnit && (
        <section className="section">
          <div className="section-head spread">
            <h2 style={{ fontSize: 24 }}>当前单元</h2>
            <Link to="/learn" className="btn btn-sm">查看完整课程地图 →</Link>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="flex spread wrap gap16">
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <div className="flex gap8 wrap mb8">
                  <span className="level-tag">单元 {String(currentUnit.order).padStart(2, '0')}</span>
                  <span className="chip chip-sky" style={{ fontSize: 12 }}>{currentUnit.level}</span>
                </div>
                <h3 style={{ marginBottom: 4 }}>{currentUnit.title}</h3>
                <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{currentUnit.subtitle}</div>
                <ProgressBar value={unitPct} height={12} />
                <div className="muted mt8" style={{ fontSize: 13 }}>
                  本单元 {unitStat.done}/{unitStat.total} 课完成
                </div>
              </div>
              <div style={{ flex: '0 1 260px', background: 'var(--paper)', border: '2px solid var(--card-stroke)', borderRadius: 'var(--r-md)', padding: 16 }}>
                <div className="muted" style={{ fontSize: 13 }}>下一课</div>
                <div style={{ fontWeight: 800, fontSize: 17, margin: '4px 0 12px' }}>{nextLesson.title}</div>
                <Link to={`/lesson/${nextLesson.id}`} className="btn btn-primary btn-sm">
                  {doneCount > 0 ? '继续学习' : '开始第一课'} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 发音热身 */}
      <section className="section">
        <div className="card" style={{ background: 'var(--peach)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <h3>1 分钟发音热身</h3>
          </div>
          <div className="flex gap8 wrap" style={{ flex: '2 1 380px' }}>
            {TONES.map((t) => (
              <span key={t.name} className="chip" style={{ gap: 6 }}>
                <span className="vi" style={{ fontWeight: 800 }}>{t.example.vi}</span>
                <span className="muted" style={{ fontSize: 11 }}>{t.name.split(' ')[1]}</span>
              </span>
            ))}
          </div>
          <Link to="/pronunciation" className="btn btn-sm">去发音页 →</Link>
        </div>
      </section>
    </div>
  );
}
