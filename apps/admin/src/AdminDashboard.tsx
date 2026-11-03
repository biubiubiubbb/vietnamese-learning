import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import { AdminPage, Banner, Button, Card, Loading, useNotice } from './ui';

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

  return (
    <AdminPage
      title="总览"
      actions={
        <>
          <Button onClick={regenerateAll} disabled={busy}>{busy ? '生成中…' : '补齐缺失音频'}</Button>
          <Link to="/admin/audio" className="admin-btn">打开音频库</Link>
        </>
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
          <div className="admin-kv">
            <dt>已就绪</dt><dd>{data.audio.ready}</dd>
            <dt>待生成</dt><dd>{data.audio.pending}</dd>
            <dt>生成中</dt><dd>{data.audio.generating}</dd>
            <dt>失败</dt><dd>{data.audio.failed}</dd>
            <dt>已停用</dt><dd>{data.audio.disabled}</dd>
          </div>
          <div className="admin-page-actions" style={{ marginTop: 12 }}>
            <Link to="/admin/audio?status=failed" className="admin-btn">查看失败项</Link>
            <Link to="/admin/audio?status=pending" className="admin-btn">查看待生成</Link>
          </div>
        </Card>

        <Card>
          <h2>快捷入口</h2>
          <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Link to="/admin/vocab" className="admin-btn">新增 / 编辑词条</Link>
            <Link to="/admin/units" className="admin-btn">课程结构</Link>
            <Link to="/admin/sentences" className="admin-btn">句子与练习</Link>
            <Link to="/admin/pronunciation" className="admin-btn">发音中心</Link>
            <Link to="/admin/config" className="admin-btn">默认音色</Link>
            <Link to="/admin/trash" className="admin-btn">回收站（{data.counts.deleted}）</Link>
          </div>
        </Card>
      </div>
    </AdminPage>
  );
}
