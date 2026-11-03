import { Link, Navigate, useParams } from 'react-router-dom';
import { UNITS, lessonById, unitById, unitProgress } from '../content/curriculum';
import { exercisesOfLesson, sentencesOfLesson } from '../content/sentences';
import { useProgress } from '../components/ProgressContext';
import ProgressBar from '../components/ProgressBar';

export default function UnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { state } = useProgress();
  const unit = unitId ? unitById.get(unitId) : undefined;

  if (!unit) return <Navigate to="/learn" replace />;

  const lessons = unit.lessonIds.map((id) => lessonById.get(id)).filter((l) => Boolean(l));
  const { done, total } = unitProgress(unit, state.completedLessons);
  const pct = total ? (done / total) * 100 : 0;
  const firstTodo = lessons.find((l) => l && !state.completedLessons.includes(l.id));
  const unitIndex = UNITS.findIndex((u) => u.id === unit.id);
  const prevUnit = unitIndex > 0 ? UNITS[unitIndex - 1] : null;
  const nextUnit = unitIndex >= 0 && unitIndex < UNITS.length - 1 ? UNITS[unitIndex + 1] : null;

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      <div className="mb16">
        <Link to="/learn" className="muted" style={{ fontSize: 14 }}>← 返回课程地图</Link>
      </div>

      {/* 单元头部 */}
      <div className="flex spread wrap gap12 mb16">
        <div>
          <span className="level-tag mb8" style={{ marginBottom: 8, display: 'inline-block' }}>
            {unit.level} · 单元{String(unit.order).padStart(2, '0')}
          </span>
          <h1 style={{ fontSize: 34 }}>{unit.title}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{unit.subtitle}</p>
        </div>
        {done === total && total > 0 && <span className="stamp anim-stamp" style={{ fontSize: 18 }}>已完成 ✓</span>}
      </div>

      <div className="card mb24">
        <div className="flex spread gap12 mb8">
          <span style={{ fontSize: 13, fontWeight: 700 }}>单元进度</span>
          <span className="muted" style={{ fontSize: 13 }}>{done}/{total} 课完成</span>
        </div>
        <ProgressBar value={pct} height={10} />
      </div>

      {total === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <strong>这个单元还没有课程</strong>
          <p className="muted mt8">先回课程地图看看别的单元吧。</p>
          <Link to="/learn" className="btn btn-primary mt16">返回课程地图 →</Link>
        </div>
      ) : (
        <>
          {/* 推荐继续 */}
          {firstTodo ? (
            <div
              className="card mb24"
              style={{ background: 'var(--orange-soft)', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>从这里继续</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  第 {firstTodo.order} 课 · {firstTodo.title}
                </div>
              </div>
              <Link to={`/lesson/${firstTodo.id}`} className="btn btn-primary">
                开始学习 →
              </Link>
            </div>
          ) : (
            <div className="card mb24" style={{ background: 'var(--ok-bg)' }}>
              <div className="flex gap12" style={{ alignItems: 'center' }}>
                <span className="stamp" style={{ fontSize: 16 }}>✓</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>本单元已全部完成</div>
                  <div className="muted" style={{ fontSize: 13 }}>想再练一次，直接点下面的课程即可。</div>
                </div>
              </div>
            </div>
          )}

          {/* 课程列表 */}
          <div className="section-head spread">
            <div className="flex" style={{ alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 22 }}>课程</h2>
              <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 14 }}>{total}</span>
            </div>
          </div>

          <div className="stagger" style={{ display: 'grid', gap: 12 }}>
            {lessons.map((l) => {
              if (!l) return null;
              const isDone = state.completedLessons.includes(l.id);
              const isRecommend = firstTodo?.id === l.id;
              const sentenceCount = sentencesOfLesson(l.id).length;
              const practiceCount = exercisesOfLesson(l.id).length + l.exercises.length;
              return (
                <Link
                  key={l.id}
                  to={`/lesson/${l.id}`}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 18px',
                    borderColor: isRecommend ? 'var(--orange)' : undefined,
                    background: isRecommend ? 'var(--orange-soft)' : undefined,
                  }}
                >
                  <span
                    className={`badge-num ${isDone ? 'done' : ''}`}
                    style={{ minWidth: 34, height: 34, fontSize: 13 }}
                  >
                    {String(l.order).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{l.title}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                      {l.goals[0]} · 词汇 {l.vocabIds.length} · 句子 {sentenceCount} · 练习 {practiceCount}
                    </div>
                  </div>
                  {isDone ? (
                    <span className="chip chip-teal" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>已完成 ✓</span>
                  ) : isRecommend ? (
                    <span className="chip" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>从这里继续</span>
                  ) : (
                    <span className="chip" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>未开始</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 上下单元 */}
          <div className="flex spread mt24">
            {prevUnit ? <Link to={`/unit/${prevUnit.id}`} className="btn btn-sm">← {prevUnit.title}</Link> : <span />}
            {nextUnit ? <Link to={`/unit/${nextUnit.id}`} className="btn btn-sm">{nextUnit.title} →</Link> : <span />}
          </div>
        </>
      )}
    </div>
  );
}
