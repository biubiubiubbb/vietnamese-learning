import { Link } from 'react-router-dom';
import { UNITS, lessonById, unitProgress } from '../content/curriculum';
import { useProgress } from '../components/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import AdventureMap from '../components/AdventureMap';

export default function CurriculumPage() {
  const { state } = useProgress();

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="flex spread wrap gap12 mb16">
        <div>
          <h1 style={{ fontSize: 34 }}>课程地图</h1>
        </div>
        <div className="flex gap8">
          <span className="chip" style={{ background: 'var(--peach)' }}>● 进行中</span>
          <span className="chip" style={{ background: 'var(--ok-bg)' }}>✓ 已完成</span>
          <span className="chip">未解锁</span>
        </div>
      </div>

      <AdventureMap />

      <div className="section-head mt24">
        <h2 style={{ fontSize: 22 }}>单元详情</h2>
      </div>
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
        {UNITS.map((u) => {
          const { done, total } = unitProgress(u, state.completedLessons);
          const pct = total ? (done / total) * 100 : 0;
          const firstTodo = u.lessonIds.find((id) => !state.completedLessons.includes(id)) ?? u.lessonIds[0];
          return (
            <Link key={u.id} to={`/lesson/${firstTodo}`} className="card" style={{ display: 'block' }}>
              <div className="flex spread mb8">
                <span className={`badge-num ${done === total ? 'done' : 'idle'}`} style={{ fontSize: 13, minWidth: 30, height: 30 }}>
                  {String(u.order).padStart(2, '0')}
                </span>
                <span className="chip chip-sky" style={{ fontSize: 12 }}>{u.level}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{u.title}</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{u.subtitle}</div>
              <ProgressBar value={pct} height={10} />
              <div className="muted mt8" style={{ fontSize: 12 }}>
                {done}/{total} 课 · 下一课：{lessonById.get(firstTodo)?.title}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
