import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { Banner, Button, Field, TextInput } from './ui';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/login', { username: username.trim(), password });
      navigate('/admin', { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <svg className="admin-login-art" viewBox="0 0 320 108" fill="none" aria-hidden="true">
          <circle cx="250" cy="30" r="16" fill="#F48FB1" opacity="0.3" />
          <circle cx="250" cy="30" r="8" fill="#F0C46A" opacity="0.7" />
          <path d="M46 20c5-7 16-6 18 2 7-3 13 2 11 9H38c-2-6 3-11 8-11z" stroke="#4FC3F7" strokeWidth="2" opacity="0.5" />
          <path
            d="M0 94c34-28 66-32 96-10 22-16 42-24 66-14 26 10 40 18 60 6 30-18 52-24 98-16v48H0z"
            fill="#7CB342"
            opacity="0.14"
          />
          <path d="M0 102c50-8 96-10 146-6 44 4 90 8 174 4v8H0z" fill="#4FC3F7" opacity="0.1" />
          <path
            d="M4 86c26-12 42-22 64-26 20-4 36 6 50 14 16 9 28 12 44 8 18-5 32-14 50-18 20-5 44-2 60 6"
            stroke="#7CB342"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
        <h1>越语学堂 · 内容中后台</h1>
        {error && <Banner tone="err">{error}</Banner>}
        <Field label="账号">
          <TextInput value={username} onChange={setUsername} placeholder="admin" />
        </Field>
        <Field label="密码">
          <TextInput type="password" value={password} onChange={setPassword} placeholder="请输入密码" />
        </Field>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? '登录中…' : '登录'}
        </Button>
      </div>
    </div>
  );
}
