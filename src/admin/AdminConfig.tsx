import { useEffect, useState } from 'react';
import { api } from './api';
import { AdminPage, Banner, Card, Loading, useNotice } from './ui';

interface Config {
  defaultVoice: 'female' | 'male';
}

export default function AdminConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      setConfig(await api.get<Config>('/api/admin/config'));
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

  return (
    <AdminPage title="配置">
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {loading ? <Loading /> : config && (
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
      )}
    </AdminPage>
  );
}
