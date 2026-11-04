import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  Icon,
  IconButton,
  Loading,
  Segmented,
  useNotice,
} from './ui';

interface Trash {
  units: Array<{ id: string; title: string; level: string }>;
  lessons: Array<{ id: string; title: string; unitId: string }>;
  vocab: Array<{ id: string; vi: string; zh: string }>;
  sentences: Array<{ id: string; vi: string; lessonId: string }>;
}

type TrashType = keyof Trash;
type TrashFilter = TrashType | 'all';

const GROUPS: Array<{ key: TrashType; label: string; icon: 'book' | 'rule' | 'letter' | 'pair'; title: (item: Record<string, string>) => string }> = [
  { key: 'units', label: '单元', icon: 'book', title: (item) => `${item.level} · ${item.title}` },
  { key: 'lessons', label: '课程', icon: 'rule', title: (item) => `${item.unitId} · ${item.title}` },
  { key: 'vocab', label: '词条', icon: 'letter', title: (item) => `${item.vi} · ${item.zh}` },
  { key: 'sentences', label: '句子', icon: 'pair', title: (item) => item.vi },
];

export default function AdminTrash() {
  const [data, setData] = useState<Trash | null>(null);
  const [existing, setExisting] = useState<Record<TrashType, Set<string>>>({
    units: new Set(), lessons: new Set(), vocab: new Set(), sentences: new Set(),
  });
  const [filter, setFilter] = useState<TrashFilter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const [trash, units, lessons, vocab, sentences] = await Promise.all([
        api.get<Trash>('/api/admin/trash'),
        api.get<Array<{ id: string }>>('/api/admin/units'),
        api.get<Array<{ id: string }>>('/api/admin/lessons'),
        api.get<Array<{ id: string }>>('/api/admin/vocab'),
        api.get<Array<{ id: string }>>('/api/admin/sentences'),
      ]);
      setData(trash);
      setExisting({
        units: new Set(units.map((item) => item.id)),
        lessons: new Set(lessons.map((item) => item.id)),
        vocab: new Set(vocab.map((item) => item.id)),
        sentences: new Set(sentences.map((item) => item.id)),
      });
      setSelected(new Set());
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const restoreSelected = async (type: TrashType, ids: string[]) => {
    if (ids.length === 0) return;
    setRestoring(true);
    let ok = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await api.post(`/api/admin/trash/${type}/${id}/restore`);
        ok += 1;
      } catch {
        failed += 1;
      }
    }
    setRestoring(false);
    if (ok > 0) notice.ok(`已恢复 ${ok} 项${failed ? `，${failed} 项失败` : ''}`);
    else notice.err('恢复失败，请检查 ID 是否已被占用');
    await load();
  };

  const total = data ? Object.values(data).reduce((sum, list) => sum + list.length, 0) : 0;

  if (loading) {
    return <AdminPage title="回收站"><Loading /></AdminPage>;
  }

  if (!data) {
    return <AdminPage title="回收站"><Banner tone="err">回收站加载失败</Banner></AdminPage>;
  }

  const visible = GROUPS.filter((group) => filter === 'all' || group.key === filter);
  const selectedType = filter === 'all' ? null : filter;
  const conflictCount = selectedType
    ? [...selected].filter((id) => existing[selectedType].has(id)).length
    : 0;

  return (
    <AdminPage
      title="回收站"
      subtitle={total > 0 ? `共 ${total} 项已删除内容，恢复前会检查 ID 是否已被占用。` : '删除的内容会先进入这里，可随时恢复。'}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}

      {total === 0 ? (
        <div className="admin-empty">
          <div>回收站是空的</div>
          <Link className="admin-btn admin-trash-empty-action" to="/admin/units">去内容管理</Link>
        </div>
      ) : (
        <>
          <div className="admin-toolbar" style={{ flexWrap: 'wrap' }}>
            <Segmented
              value={filter}
              onChange={(value) => { setFilter(value); setSelected(new Set()); }}
              ariaLabel="按内容类型筛选"
              options={[
                { value: 'all', label: '全部', count: total },
                ...GROUPS.map((group) => ({ value: group.key as TrashFilter, label: group.label, count: data[group.key].length })),
              ]}
            />
            {selectedType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                  <input
                    type="checkbox"
                    className="admin-check"
                    checked={selected.size > 0 && selected.size === data[selectedType].length}
                    onChange={(event) => {
                      setSelected(event.target.checked ? new Set(data[selectedType].map((item) => item.id)) : new Set());
                    }}
                  />
                  全选
                </label>
                <Button
                  disabled={selected.size === 0 || restoring}
                  onClick={() => restoreSelected(selectedType, [...selected])}
                >
                  <Icon name="restore" />
                  恢复所选（{selected.size}）
                </Button>
                {conflictCount > 0 && (
                  <span className="admin-trash-warn">
                    <Icon name="alert" />
                    {conflictCount} 项 ID 已被占用，将被跳过
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="admin-grid">
            {visible.map((group) => {
              const items = data[group.key];
              return (
                <Card key={group.key}>
                  <h2><Icon name={group.icon} />{group.label}（{items.length}）</h2>
                  {items.length === 0 ? (
                    <p className="muted" style={{ fontSize: 12.5 }}>暂无</p>
                  ) : (
                    <div className="admin-trash-list">
                      {items.map((item) => {
                        const conflict = existing[group.key].has(item.id);
                        const selectable = filter === group.key;
                        return (
                          <div className="admin-trash-row" key={item.id}>
                            {selectable && (
                              <input
                                type="checkbox"
                                className="admin-check"
                                aria-label={`选择 ${item.id}`}
                                checked={selected.has(item.id)}
                                onChange={(event) => {
                                  setSelected((current) => {
                                    const next = new Set(current);
                                    if (event.target.checked) next.add(item.id);
                                    else next.delete(item.id);
                                    return next;
                                  });
                                }}
                              />
                            )}
                            <span className="content">
                              {group.title(item as unknown as Record<string, string>)}
                              <span className="muted">{item.id}</span>
                            </span>
                            {conflict && (
                              <span className="admin-trash-warn" title="ID 已被现有内容占用，需先处理现有内容">
                                <Icon name="alert" />ID 已被占用
                              </span>
                            )}
                            <IconButton
                              icon="restore"
                              label={conflict ? 'ID 已被占用，无法恢复' : `恢复 ${item.id}`}
                              tone="green"
                              disabled={conflict}
                              onClick={() => restoreSelected(group.key, [item.id])}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </AdminPage>
  );
}
