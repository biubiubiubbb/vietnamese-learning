import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { validatePassword, validateUsername } from '../lib/account';

function safeNext(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default function RegisterPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const usernameIssue = validateUsername(username);
    if (usernameIssue) {
      setError(usernameIssue);
      return;
    }
    const passwordIssue = validatePassword(password);
    if (passwordIssue) {
      setError(passwordIssue);
      return;
    }
    if (password.trim() !== confirm.trim()) {
      setError('两次输入的密码不一致');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await register(username.trim(), password.trim());
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
        <h1 style={{ fontSize: 30, marginBottom: 6 }}>注册</h1>
        <p className="muted mb24" style={{ fontSize: 14 }}>注册成功即登录，学习记录会保存到你的账号。</p>
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
              autoComplete="new-password"
              placeholder="8–64 位，至少含 1 个字母和 1 个数字"
              style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, background: 'var(--card)' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>确认密码</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              placeholder="再输入一次密码"
              style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, background: 'var(--card)' }}
            />
          </label>
          {error && <p style={{ color: 'var(--err)', fontSize: 13, margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy} style={{ fontSize: 16 }}>
            {busy ? '注册中…' : '注册并登录'}
          </button>
        </form>
        <p className="muted mt16" style={{ fontSize: 13 }}>
          已有账号？<Link to={`/login?next=${encodeURIComponent(next)}`}>登录</Link>
        </p>
      </div>
    </div>
  );
}
