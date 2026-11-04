import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function safeNext(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default function LoginPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      navigate(next, { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 60, maxWidth: 520 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 30, marginBottom: 6 }}>登录</h1>
        <p className="muted mb24" style={{ fontSize: 14 }}>登录后学习进度按账号保存，可在其他设备继续。</p>
        <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>用户名</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="4–20 位字母、数字或下划线"
              style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, background: 'var(--card)' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="8–64 位，含字母和数字"
              style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, background: 'var(--card)' }}
            />
          </label>
          {error && <p style={{ color: 'var(--err)', fontSize: 13, margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy} style={{ fontSize: 16 }}>
            {busy ? '登录中…' : '登录'}
          </button>
        </form>
        <p className="muted mt16" style={{ fontSize: 13 }}>
          还没有账号？<Link to={`/register?next=${encodeURIComponent(next)}`}>注册</Link>
        </p>
      </div>
    </div>
  );
}
