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
        <h1>越语学堂 · 内容中后台</h1>
        <p>独立后台账号登录。</p>
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
        <p className="muted" style={{ fontSize: 11.5, marginTop: 12, marginBottom: 0 }}>
          默认账号 admin / admin123
        </p>
      </div>
    </div>
  );
}
