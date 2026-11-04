import { useEffect, useRef, useState } from 'react';
import { api, apiUrl } from './api';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  Field,
  Icon,
  IconButton,
  Loading,
  TextInput,
  useNotice,
} from './ui';

interface Config {
  defaultVoice: 'female' | 'male';
  backgroundImage: string;
  customerSessionDays: number;
}

type AudioIndex = Record<string, Record<string, string>>;

const SESSION_PRESETS = [7, 30, 90];

export default function AdminConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [index, setIndex] = useState<AudioIndex>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionDays, setSessionDays] = useState('30');
  const fileRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const [data, audioIndex] = await Promise.all([
        api.get<Config>('/api/admin/config'),
        api.get<AudioIndex>('/api/audio/index').catch(() => ({}) as AudioIndex),
      ]);
      setConfig(data);
      setIndex(audioIndex);
      setSessionDays(String(data.customerSessionDays));
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (defaultVoice: 'female' | 'male') => {
    if (!config || config.defaultVoice === defaultVoice) return;
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

  const sampleFor = (voice: 'female' | 'male') => {
    const texts = Object.keys(index);
    const preferred = texts.find((text) => text.toLowerCase() === 'xin chào' && index[text][voice]);
    const fallback = texts.find((text) => index[text][voice] && text.length <= 40);
    const text = preferred ?? fallback;
    return text ? { text, url: index[text][voice] } : null;
  };

  const preview = (voice: 'female' | 'male') => {
    const sample = sampleFor(voice);
    if (!sample) return;
    playerRef.current?.pause();
    const player = new Audio(apiUrl(sample.url));
    playerRef.current = player;
    player.play().catch(() => notice.err('试听失败，请稍后再试'));
  };

  const sessionDirty = config ? Number(sessionDays) !== config.customerSessionDays : false;
  const bump = (delta: number) => {
    const current = Number(sessionDays) || 1;
    setSessionDays(String(Math.min(365, Math.max(1, current + delta))));
  };

  return (
    <AdminPage title="配置">
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {loading ? <Loading /> : config && (
        <>
          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>默认音色</h2>
            <div className="admin-voice-cards">
              {(['female', 'male'] as const).map((voice) => {
                const selected = config.defaultVoice === voice;
                const sample = sampleFor(voice);
                return (
                  <div className={`admin-voice-card${selected ? ' on' : ''}`} key={voice} data-voice={voice}>
                    <span className="admin-voice-badge">
                      <Icon name={voice === 'female' ? 'user' : 'user-off'} />
                    </span>
                    <button
                      type="button"
                      className="admin-voice-info"
                      onClick={() => save(voice)}
                      disabled={saving}
                      aria-pressed={selected}
                    >
                      <strong>{voice === 'female' ? '女声' : '男声'}</strong>
                      <span title={sample?.text}>{sample ? sample.text : '暂无可用试听音频'}</span>
                    </button>
                    <IconButton
                      icon="play"
                      label={`试听${voice === 'female' ? '女声' : '男声'}`}
                      tone={selected ? 'green' : 'default'}
                      disabled={!sample}
                      onClick={() => preview(voice)}
                    />
                    {selected && (
                      <span className="admin-voice-check" aria-hidden="true">
                        <Icon name="check" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>客户登录有效期</h2>
            <Field label="保持登录天数" hint="对新登录生效，已登录会话保留原有效期。">
              <div className="flex gap12 wrap" style={{ alignItems: 'center' }}>
                <div className="admin-stepper">
                  <IconButton icon="chevron-left" label="减少一天" disabled={Number(sessionDays) <= 1} onClick={() => bump(-1)} />
                  <TextInput value={sessionDays} onChange={setSessionDays} type="number" />
                  <IconButton icon="chevron-right" label="增加一天" disabled={Number(sessionDays) >= 365} onClick={() => bump(1)} />
                </div>
                <span className="muted" style={{ fontSize: 12.5 }}>天</span>
                <div className="admin-chips">
                  {SESSION_PRESETS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      className={`admin-tab${Number(sessionDays) === days ? ' on' : ''}`}
                      onClick={() => setSessionDays(String(days))}
                    >
                      {days} 天
                    </button>
                  ))}
                </div>
                {sessionDirty && (
                  <Button variant="primary" onClick={saveSessionDays} loading={saving}>保存</Button>
                )}
              </div>
            </Field>
          </Card>

          <Card>
            <h2 style={{ fontSize: 15, marginTop: 0 }}>前台背景图</h2>
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
            {config.backgroundImage ? (
              <div className="admin-bg-canvas">
                <img src={apiUrl(config.backgroundImage)} alt="前台背景图" />
                <div className="admin-bg-overlay">
                  <IconButton icon="image" label="更换背景图" disabled={uploading} onClick={() => fileRef.current?.click()} />
                  <IconButton icon="restore" label="恢复默认背景" disabled={uploading} onClick={removeBackground} />
                </div>
              </div>
            ) : (
              <div className="admin-bg-canvas">
                <button type="button" className="admin-bg-empty" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  <Icon name="upload" />
                  <span>{uploading ? '上传中…' : '上传背景图'}</span>
                  <span className="muted">JPG / PNG / WebP / GIF / AVIF，最大 100MB</span>
                </button>
              </div>
            )}
          </Card>
        </>
      )}
    </AdminPage>
  );
}
