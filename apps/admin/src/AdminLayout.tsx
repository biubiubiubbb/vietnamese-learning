import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api, UnauthorizedError } from './api';
import { IconButton } from './ui';

type NavIcon =
  | 'overview'
  | 'customers'
  | 'units'
  | 'vocab'
  | 'sentences'
  | 'pronunciation'
  | 'audio'
  | 'config'
  | 'trash';

const NAV: Array<{ to: string; label: string; end?: boolean; icon: NavIcon }> = [
  { to: '/admin', label: '总览', end: true, icon: 'overview' },
  { to: '/admin/customers', label: '客户管理', icon: 'customers' },
  { to: '/admin/units', label: '课程结构', icon: 'units' },
  { to: '/admin/vocab', label: '词汇', icon: 'vocab' },
  { to: '/admin/sentences', label: '句子', icon: 'sentences' },
  { to: '/admin/pronunciation', label: '发音中心', icon: 'pronunciation' },
  { to: '/admin/audio', label: '音频', icon: 'audio' },
  { to: '/admin/config', label: '配置', icon: 'config' },
  { to: '/admin/trash', label: '回收站', icon: 'trash' },
];

const ICONS: Record<NavIcon, string[]> = {
  overview: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z', 'M15.4 8.6l-2 4.8-4.8 2 2-4.8z'],
  customers: ['M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4', 'M17 8.2a2.6 2.6 0 1 1 0 5.2', 'M18.5 18.8c.8-1.9 2.1-3 4-3.5'],
  units: ['M12 3.5l8 4.4-8 4.4-8-4.4z', 'M4 12l8 4.4 8-4.4', 'M4 16.4l8 4.4 8-4.4'],
  vocab: ['M4 5.6c2.6-1 5.1-1 8 .4 2.9-1.4 5.4-1.4 8-.4v13c-2.6-1-5.1-1-8 .4-2.9-1.4-5.4-1.4-8-.4z', 'M12 6v13'],
  sentences: ['M9.5 7.5c-2.4 1-3.9 2.9-3.9 5.7V17h4.8v-4.7H7.6c0-1.8 1-2.8 2.8-3.3z', 'M18.4 7.5c-2.4 1-3.9 2.9-3.9 5.7V17h4.8v-4.7h-2.8c0-1.8 1-2.8 2.8-3.3z'],
  pronunciation: ['M4 10v4', 'M8 7v10', 'M12 4v16', 'M16 8v8', 'M20 10v4'],
  audio: ['M9 17.5V6.4l10-2v11.1', 'M6.5 18.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0', 'M16.5 16.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0'],
  config: ['M4 7h16', 'M4 17h16', 'M9 7a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0', 'M13 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0'],
  trash: ['M4 7h16', 'M9.5 7V5h5v2', 'M6.5 7l.9 12h9.2l.9-12'],
};

function NavIcon({ name }: { name: NavIcon }) {
  return (
    <span className="admin-nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('admin.sideCollapsed') === '1');

  useEffect(() => {
    api.get('/api/auth/me')
      .then(() => setReady(true))
      .catch((e) => {
        if (e instanceof UnauthorizedError) navigate('/admin/login', { replace: true });
        else setError(e.message);
      });
  }, [navigate]);

  const logout = async () => {
    await api.post('/api/auth/logout');
    navigate('/admin/login', { replace: true });
  };

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      localStorage.setItem('admin.sideCollapsed', value ? '0' : '1');
      return !value;
    });
  };

  if (!ready) {
    return <div className="admin-empty" style={{ margin: 40 }}>{error || '正在验证登录状态…'}</div>;
  }

  return (
    <div className={`admin-shell${collapsed ? ' side-collapsed' : ''}`}>
      <aside className={`admin-side${collapsed ? ' collapsed' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">越</span>
          <span className="admin-brand-text">
            <strong>越语学堂</strong>
            <small>内容中后台</small>
          </span>
        </div>
        <IconButton
          icon={collapsed ? 'chevron-right' : 'chevron-left'}
          label={collapsed ? '展开侧栏' : '收起侧栏'}
          className="admin-side-toggle"
          onClick={toggleCollapsed}
        />
        <nav className="admin-nav" aria-label="后台导航">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} title={collapsed ? item.label : undefined} aria-label={item.label}>
              <NavIcon name={item.icon} />
              <span className="admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <IconButton icon="logout" label="退出登录" onClick={logout} />
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <strong>内容管理</strong>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
