import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useProgress } from './ProgressContext';
import { useAuth } from './AuthContext';
import { dueCards } from '../lib/progress';
import { VOCAB_IDS } from '../content/vocab';
import GhibliBackground from './GhibliBackground';
import VoiceToggle from './VoiceToggle';

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
  const { user, logout, notice, setNotice } = useAuth();
  const { state } = useProgress();
  const due = Math.min(dueCards(state, VOCAB_IDS).length, 20);
  const location = useLocation();
  const navigate = useNavigate();

  const current = `${location.pathname}${location.search}`;
  const next = location.pathname === '/login' || location.pathname === '/register' ? '/' : current;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

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
              <span className="logo-sub">{user ? user.username : '游客'}</span>
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
          <VoiceToggle />
          {user ? (
            <div className="flex gap8" style={{ alignItems: 'center' }}>
              {due > 0 && (
                <Link to="/review" className="due-badge" aria-label={`今日待复习 ${due} 个词条`}>
                  待复习 <strong>{due}</strong>
                </Link>
              )}
              <button type="button" className="btn btn-sm" onClick={handleLogout}>登出</button>
            </div>
          ) : (
            <div className="flex gap8" style={{ alignItems: 'center' }}>
              <Link to={`/login?next=${encodeURIComponent(next)}`} className="btn btn-sm">登录</Link>
              <Link to={`/register?next=${encodeURIComponent(next)}`} className="btn btn-sm btn-primary">注册</Link>
            </div>
          )}
        </div>
      </header>
      {notice && (
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 14 }}>
          <div
            className="card"
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', padding: '10px 16px', borderColor: 'var(--orange)' }}
          >
            <span style={{ fontSize: 13.5, flex: 1 }}>{notice}</span>
            {!user && <Link to={`/login?next=${encodeURIComponent(next)}`} className="btn btn-sm btn-primary">去登录</Link>}
            <button type="button" className="btn btn-sm" onClick={() => setNotice(null)}>关闭</button>
          </div>
        </div>
      )}
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
