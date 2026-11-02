import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useProgress } from './ProgressContext';
import { dueCards } from '../lib/progress';
import { VOCAB } from '../content/vocab';
import GhibliBackground from './GhibliBackground';

const TABS = [
  { to: '/', label: '首页', end: true },
  { to: '/learn', label: '课程', end: false },
  { to: '/pronunciation', label: '发音', end: false },
  { to: '/vocabulary', label: '词汇', end: false },
  { to: '/practice', label: '练习', end: false },
  { to: '/review', label: '复习', end: false },
  { to: '/progress', label: '进度', end: false },
];

export default function Layout() {
  const { state } = useProgress();
  const due = Math.min(dueCards(state, VOCAB.map((v) => v.id)).length, 20);
  const location = useLocation();

  return (
    <>
      <GhibliBackground />
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V5l7 7-7 7z" fill="currentColor" stroke="none" />
                <path d="M13 6h7M13 12h7M13 18h7" />
              </svg>
            </span>
            <span>
              <span className="logo-text">越语学堂</span>
              <span className="logo-sub">河内音 · 从六个声调开始</span>
            </span>
          </Link>
          <nav className="nav-tabs" aria-label="主导航">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
          {due > 0 && (
            <Link to="/review" className="due-badge" aria-label={`今日待复习 ${due} 个词条`}>
              待复习 <strong>{due}</strong>
            </Link>
          )}
        </div>
      </header>
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div key={location.pathname} className="route-fade">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          越语学堂 · 面向中文母语者的越南语学习 · 发音以河内音为准
        </div>
      </footer>
    </>
  );
}
