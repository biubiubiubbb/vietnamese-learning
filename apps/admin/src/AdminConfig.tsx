import { useEffect, useRef, useState } from 'react';
import { api, apiUrl } from './api';
import { AdminPage, Banner, Button, Card, Loading, TextInput, useNotice } from './ui';

interface Config {
  defaultVoice: 'female' | 'male';
  backgroundImage: string;
  customerSessionDays: number;
}

export default function AdminConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionDays, setSessionDays] = useState('30');
  const fileRef = useRef<HTMLInputElement>(null);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Config>('/api/admin/config');
      setConfig(data);
      setSessionDays(String(data.customerSessionDays));
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (defaultVoice: 'female' | 'male') => {
    setSaving(true);
    try {
      setConfig(await api.put<Config>('/api/admin/config', { defaultVoice }));
      notice.ok(`默认音色已切换为${defaultVoice === 'male' ? '男声' : '女声'}`);
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const saveSessionDays = async () => {
    const days = Number(sessionDays);
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      notice.err('登录有效期需为 1–365 的整数天');
      return;
    }
    setSaving(true);
    try {
      const next = await api.put<Config>('/api/admin/config', { customerSessionDays: days });
      setConfig(next);
      setSessionDays(String(next.customerSessionDays));
      notice.ok(`客户登录有效期已设为 ${next.customerSessionDays} 天，对新登录生效`);
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const uploadBackground = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      setConfig(await api.upload<Config>('/api/admin/config/background', form));
      notice.ok('前台背景图已更新');
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeBackground = async () => {
    setUploading(true);
    try {
      setConfig(await api.del<Config>('/api/admin/config/background'));
      notice.ok('已恢复默认背景');
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminPage title="配置">
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {loading ? <Loading /> : config && (
        <>
          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>默认音色</h2>
            <div className="admin-tabs">
              <button
                type="button"
                className={`admin-tab${config.defaultVoice === 'female' ? ' on' : ''}`}
                disabled={saving}
                onClick={() => save('female')}
              >
                女声
              </button>
              <button
                type="button"
                className={`admin-tab${config.defaultVoice === 'male' ? ' on' : ''}`}
                disabled={saving}
                onClick={() => save('male')}
              >
                男声
              </button>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>客户登录有效期</h2>
            <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
              客户登录后保持登录状态的天数，默认 30 天，可设置 1–365 天。修改后对新登录生效，已登录会话保留原有效期。
            </p>
            <div className="admin-toolbar">
              <div style={{ width: 140 }}>
                <TextInput value={sessionDays} onChange={setSessionDays} type="number" />
              </div>
              <span className="muted">天</span>
              <Button variant="primary" onClick={saveSessionDays} disabled={saving}>保存</Button>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>前台背景图</h2>
            {config.backgroundImage ? (
              <img
                src={apiUrl(config.backgroundImage)}
                alt="前台背景图"
                style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12, border: 'var(--bd-thin)', display: 'block' }}
              />
            ) : (
              <p className="muted" style={{ marginTop: 0 }}>正在使用默认插画背景</p>
            )}
            <div className="flex gap12 wrap" style={{ marginTop: 14 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadBackground(file);
                }}
              />
              <button
                type="button"
                className="admin-btn"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? '处理中…' : config.backgroundImage ? '更换图片' : '上传图片'}
              </button>
              {config.backgroundImage && (
                <button
                  type="button"
                  className="admin-btn"
                  disabled={uploading}
                  onClick={removeBackground}
                >
                  恢复默认
                </button>
              )}
            </div>
          </Card>
        </>
      )}
    </AdminPage>
  );
}
