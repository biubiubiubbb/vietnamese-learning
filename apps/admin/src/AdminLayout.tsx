import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api, UnauthorizedError } from './api';
import { Button } from './ui';

const NAV = [
  { to: '/admin', label: '总览', end: true },
  { to: '/admin/units', label: '课程结构' },
  { to: '/admin/vocab', label: '词汇' },
  { to: '/admin/sentences', label: '句子' },
  { to: '/admin/pronunciation', label: '发音中心' },
  { to: '/admin/audio', label: '音频' },
  { to: '/admin/config', label: '配置' },
  { to: '/admin/trash', label: '回收站' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

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

  if (!ready) {
    return <div className="admin-empty" style={{ margin: 40 }}>{error || '正在验证登录状态…'}</div>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <span className="admin-brand-mark">越</span>
          <span>
            <strong>越语学堂</strong>
            <small>内容中后台</small>
          </span>
        </div>
        <nav className="admin-nav" aria-label="后台导航">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer">打开前端 ↗</a>
          <Button variant="ghost" onClick={logout}>退出登录</Button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <strong>内容管理</strong>
          <span>单人管理员 · 保存立即生效</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
