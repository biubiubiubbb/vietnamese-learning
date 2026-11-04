import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import { AdminPage, Banner, Button, Card, Icon, Loading, useNotice } from './ui';

interface Overview {
  counts: {
    units: number;
    lessons: number;
    vocab: number;
    sentences: number;
    audio: number;
    deleted: number;
  };
  audio: {
    ready: number;
    pending: number;
    generating: number;
    failed: number;
    disabled: number;
  };
  config: { defaultVoice: 'female' | 'male' };
}

const HEALTH: Array<{ key: keyof Overview['audio']; label: string; dot: 'green' | 'sun' | 'sky' | 'danger' | 'gray'; to: string }> = [
  { key: 'ready', label: '已就绪', dot: 'green', to: '/admin/audio' },
  { key: 'pending', label: '待生成', dot: 'sun', to: '/admin/audio?status=pending' },
  { key: 'generating', label: '生成中', dot: 'sky', to: '/admin/audio?status=generating' },
  { key: 'failed', label: '失败', dot: 'danger', to: '/admin/audio?status=failed' },
  { key: 'disabled', label: '已停用', dot: 'gray', to: '/admin/audio?status=disabled' },
];

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const notice = useNotice();

  const load = () => {
    api.get<Overview>('/api/admin/overview')
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const regenerateAll = async () => {
    setBusy(true);
    try {
      const result = await api.post<{ texts: number; queued: number }>('/api/admin/audio/regenerate-all');
      notice.ok(`已提交 ${result.queued} 个音频生成任务，覆盖 ${result.texts} 条文本`);
      load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <AdminPage title="总览">{error ? <Banner tone="err">{error}</Banner> : <Loading />}</AdminPage>;

  const total = HEALTH.reduce((sum, item) => sum + data.audio[item.key], 0);
  const missing = data.audio.pending + data.audio.failed;

  return (
    <AdminPage
      title="总览"
      actions={
        <Button variant={missing > 0 ? 'primary' : 'default'} onClick={regenerateAll} loading={busy}>
          <Icon name="refresh" />
          {busy ? '生成中…' : '补齐缺失音频'}
          {missing > 0 && <span className="admin-badge-count">{missing}</span>}
        </Button>
      }
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}

      <div className="admin-stats">
        <div className="admin-stat tone-green"><div className="n">{data.counts.units}</div><div className="l">单元</div></div>
        <div className="admin-stat tone-sky"><div className="n">{data.counts.lessons}</div><div className="l">课程</div></div>
        <div className="admin-stat tone-pink"><div className="n">{data.counts.vocab}</div><div className="l">词条</div></div>
        <div className="admin-stat tone-sun"><div className="n">{data.counts.sentences}</div><div className="l">句子</div></div>
      </div>

      <div className="admin-grid-2">
        <Card>
          <h2>音频健康</h2>
          {total === 0 ? (
            <div className="admin-empty">还没有音频数据</div>
          ) : (
            <>
              <div className="admin-health-bar" role="img" aria-label={HEALTH.map((item) => `${item.label} ${data.audio[item.key]}`).join('，')}>
                {HEALTH.map((item) => {
                  const count = data.audio[item.key];
                  if (count === 0) return null;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      className={`admin-health-seg ${item.key}`}
                      style={{ width: `${(count / total) * 100}%` }}
                      title={`${item.label} ${count}（${pct}%）`}
                    >
                      {pct >= 7 ? count : ''}
                    </Link>
                  );
                })}
              </div>
              <div className="admin-legend">
                {HEALTH.map((item) => (
                  <span key={item.key}>
                    <i className={`admin-dot admin-dot-${item.dot}`} />
                    {item.label} {data.audio[item.key]}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card>
          <h2>快捷入口</h2>
          <div className="admin-tiles">
            <Link to="/admin/vocab" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="letter" /></span>
              词汇库
            </Link>
            <Link to="/admin/units" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="book" /></span>
              课程结构
            </Link>
            <Link to="/admin/sentences" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="pair" /></span>
              句子与练习
            </Link>
            <Link to="/admin/pronunciation" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="wave" /></span>
              发音中心
            </Link>
            <Link to="/admin/config" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="sliders" /></span>
              默认音色
            </Link>
            <Link to="/admin/trash" className="admin-tile">
              <span className="admin-tile-icon"><Icon name="trash" /></span>
              回收站
              {data.counts.deleted > 0 && <span className="admin-tile-badge">{data.counts.deleted}</span>}
            </Link>
          </div>
        </Card>
      </div>
    </AdminPage>
  );
}
