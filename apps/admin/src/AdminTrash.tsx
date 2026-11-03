import { useEffect, useState } from 'react';
import { api } from './api';
import { AdminPage, Banner, Button, Card, Loading, useNotice } from './ui';

interface Trash {
  units: Array<{ id: string; title: string; level: string }>;
  lessons: Array<{ id: string; title: string; unitId: string }>;
  vocab: Array<{ id: string; vi: string; zh: string }>;
  sentences: Array<{ id: string; vi: string; lessonId: string }>;
}

const GROUPS: Array<{ key: keyof Trash; label: string; title: (item: Record<string, string>) => string }> = [
  { key: 'units', label: '单元', title: (item) => `${item.level} · ${item.title}` },
  { key: 'lessons', label: '课程', title: (item) => `${item.unitId} · ${item.title}` },
  { key: 'vocab', label: '词条', title: (item) => `${item.vi} · ${item.zh}` },
  { key: 'sentences', label: '句子', title: (item) => item.vi },
];

export default function AdminTrash() {
  const [data, setData] = useState<Trash | null>(null);
  const [loading, setLoading] = useState(true);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<Trash>('/api/admin/trash'));
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const restore = async (type: keyof Trash, id: string) => {
    try {
      await api.post(`/api/admin/trash/${type}/${id}/restore`);
      notice.ok('已恢复');
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const total = data ? Object.values(data).reduce((sum, list) => sum + list.length, 0) : 0;

  return (
    <AdminPage title="回收站">
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {loading ? <Loading /> : data && (
        total === 0 ? <div className="admin-empty">回收站是空的</div> : (
          <div className="admin-grid">
            {GROUPS.map((group) => (
              <Card key={group.key}>
                <h2>{group.label}（{data[group.key].length}）</h2>
                {data[group.key].length === 0 ? (
                  <p className="muted" style={{ fontSize: 12.5 }}>暂无</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table" style={{ minWidth: 480 }}>
                      <thead><tr><th>ID</th><th>内容</th><th>操作</th></tr></thead>
                      <tbody>
                        {data[group.key].map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{group.title(item as unknown as Record<string, string>)}</td>
                            <td><Button onClick={() => restore(group.key, item.id)}>恢复</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      )}
    </AdminPage>
  );
}
