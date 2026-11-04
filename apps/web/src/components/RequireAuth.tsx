import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useProgress } from './ProgressContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { ready } = useProgress();
  const location = useLocation();

  if (loading || !ready) {
    return (
      <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <p className="muted">正在验证登录状态…</p>
      </div>
    );
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <>{children}</>;
}
