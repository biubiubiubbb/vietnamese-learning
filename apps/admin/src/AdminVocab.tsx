import { useEffect, useState } from 'react';
import { api } from './api';
import { POS_LABEL, TAG_LABEL, type Pos, type VocabTag } from '@viet/shared/types';
import {
  AdminPage,
  Banner,
  Button,
  ConfirmDialog,
  Field,
  Icon,
  IconButton,
  Loading,
  Modal,
  Segmented,
  Select,
  TextArea,
  TextInput,
  useNotice,
} from './ui';

interface VocabRow {
  id: string;
  vi: string;
  zh: string;
  pos: Pos;
  hanViet?: string;
  example?: { vi: string; zh: string };
  note?: string;
  tags?: VocabTag[];
}

interface VocabForm {
  id: string;
  vi: string;
  zh: string;
  pos: Pos;
  hanViet: string;
  exampleVi: string;
  exampleZh: string;
  note: string;
  tags: VocabTag[];
}

const emptyForm = (): VocabForm => ({
  id: newId('v'), vi: '', zh: '', pos: 'n', hanViet: '', exampleVi: '', exampleZh: '', note: '', tags: [],
});

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

const POS_OPTIONS = Object.entries(POS_LABEL).map(([value, label]) => ({ value, label }));
const TAG_OPTIONS = Object.entries(TAG_LABEL) as Array<[VocabTag, string]>;

type PosFilter = Pos | 'all';
type TagFilter = VocabTag | 'all';

export default function AdminVocab() {
  const [rows, setRows] = useState<VocabRow[]>([]);
  const [query, setQuery] = useState('');
  const [posFilter, setPosFilter] = useState<PosFilter>('all');
  const [tagFilter, setTagFilter] = useState<TagFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<VocabForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VocabRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const notice = useNotice();

  const load = async (q = query) => {
    setLoading(true);
    setError('');
    try {
      setRows(await api.get<VocabRow[]>(`/api/admin/vocab${q ? `?q=${encodeURIComponent(q)}` : ''}`));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(''); }, []);

  const open = (row?: VocabRow) => {
    if (!row) {
      setForm(emptyForm());
      return;
    }
    setForm({
      id: row.id,
      vi: row.vi,
      zh: row.zh,
      pos: row.pos,
      hanViet: row.hanViet ?? '',
      exampleVi: row.example?.vi ?? '',
      exampleZh: row.example?.zh ?? '',
      note: row.note ?? '',
      tags: row.tags ?? [],
    });
  };

  const save = async () => {
    if (!form) return;
    if (!form.id.trim() || !form.vi.trim() || !form.zh.trim()) {
      notice.err('ID、越南语和中文不能为空');
      return;
    }
    if ((form.exampleVi && !form.exampleZh) || (!form.exampleVi && form.exampleZh)) {
      notice.err('例句的越南语和中文需要成对填写');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: form.id.trim(),
        vi: form.vi,
        zh: form.zh,
        pos: form.pos,
        hanViet: form.hanViet || undefined,
        example: form.exampleVi ? { vi: form.exampleVi, zh: form.exampleZh } : undefined,
        note: form.note || undefined,
        tags: form.tags,
      };
      if (rows.some((row) => row.id === form.id)) {
        await api.put(`/api/admin/vocab/${form.id}`, payload);
      } else {
        await api.post('/api/admin/vocab', payload);
      }
      notice.ok('已保存');
      setForm(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.del(`/api/admin/vocab/${deleteTarget.id}`);
      notice.ok('词条已移入回收站');
      setDeleteTarget(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleTag = (tag: VocabTag) => {
    if (!form) return;
    setForm({
      ...form,
      tags: form.tags.includes(tag)
        ? form.tags.filter((item) => item !== tag)
        : [...form.tags, tag],
    });
  };

  const filtered = rows.filter((row) =>
    (posFilter === 'all' || row.pos === posFilter)
    && (tagFilter === 'all' || (row.tags ?? []).includes(tagFilter)),
  );
  const posCounts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.pos] = (acc[row.pos] ?? 0) + 1;
    return acc;
  }, {});
  const tagCounts = rows.reduce<Record<string, number>>((acc, row) => {
    for (const tag of row.tags ?? []) acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});
  const filtering = posFilter !== 'all' || tagFilter !== 'all' || query.trim().length > 0;

  const clearFilters = () => {
    setPosFilter('all');
    setTagFilter('all');
    setQuery('');
    load('');
  };

  return (
    <AdminPage
      title="词汇库"
      actions={<Button variant="primary" onClick={() => open()}><Icon name="plus" />新增词条</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <TextInput
            value={query}
            onChange={setQuery}
            placeholder="搜索越南语 / 中文 / ID"
            onKeyDown={(event) => { if (event.key === 'Enter') load(); }}
          />
          <Button onClick={() => load()}><Icon name="search" />搜索</Button>
        </div>
        <Segmented
          value={posFilter}
          onChange={setPosFilter}
          ariaLabel="按词性筛选"
          options={[
            { value: 'all', label: '全部', count: rows.length },
            ...POS_OPTIONS.map((option) => ({
              value: option.value as PosFilter,
              label: option.label,
              count: posCounts[option.value] ?? 0,
            })),
          ]}
        />
        <span className="muted" style={{ fontSize: 12.5 }}>
          {filtering ? `筛选 ${filtered.length} / ${rows.length} 条` : `共 ${rows.length} 条`}
        </span>
      </div>
      <div className="admin-chips" style={{ marginBottom: 12 }}>
        <button type="button" className={`admin-tab${tagFilter === 'all' ? ' on' : ''}`} onClick={() => setTagFilter('all')}>
          全部标签
        </button>
        {TAG_OPTIONS.map(([tag, label]) => (
          <button
            key={tag}
            type="button"
            className={`admin-tab${tagFilter === tag ? ' on' : ''}`}
            onClick={() => setTagFilter((current) => (current === tag ? 'all' : tag))}
            title={`${label} ${tagCounts[tag] ?? 0} 条`}
          >
            {label}
            {(tagCounts[tag] ?? 0) > 0 && <span className="admin-seg-count">{tagCounts[tag]}</span>}
          </button>
        ))}
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>越南语</th><th>中文</th><th>词性</th><th>标签</th><th>操作</th></tr></thead>
            <tbody>
              {filtered.map((row) => {
                const preview = row.example
                  ? <><span className="vi">{row.example.vi}</span><br />{row.example.zh}</>
                  : row.note || row.hanViet
                    ? <>{row.hanViet && <>汉越：{row.hanViet}<br /></>}{row.note}</>
                    : null;
                return (
                  <tr key={row.id} className="admin-row-clickable" onClick={() => open(row)}>
                    <td>{row.id}</td>
                    <td className="vi">
                      {preview ? (
                        <span className="admin-hover-host">
                          {row.vi}
                          <span className="admin-hovercard">{preview}</span>
                        </span>
                      ) : row.vi}
                    </td>
                    <td>{row.zh}{row.hanViet ? <span className="muted"> · 汉越 {row.hanViet}</span> : null}</td>
                    <td>{POS_LABEL[row.pos]}</td>
                    <td>{(row.tags ?? []).map((tag) => TAG_LABEL[tag]).join(' / ') || '—'}</td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <div className="admin-row-actions">
                        <IconButton icon="edit" label={`编辑 ${row.vi}`} tone="sky" onClick={() => open(row)} />
                        <IconButton icon="trash" label={`删除 ${row.vi}`} tone="danger" onClick={() => setDeleteTarget(row)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      {filtering ? '没有符合条件的词条' : '还没有词条'}
                      {filtering && (
                        <div className="admin-trash-empty-action">
                          <Button onClick={clearFilters}>清除筛选</Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal
          title={rows.some((row) => row.id === form.id) ? '编辑词条' : '新增词条'}
          wide
          onClose={() => setForm(null)}
          footer={
            <>
              <Button onClick={() => setForm(null)}>取消</Button>
              <Button variant="primary" onClick={save} loading={saving}>保存</Button>
            </>
          }
        >
          <div className="admin-grid-2">
            <Field label="词性">
              <Select value={form.pos} onChange={(pos) => setForm({ ...form, pos: pos as Pos })} options={POS_OPTIONS} />
            </Field>
          </div>
          <div className="admin-grid-2">
            <Field label="越南语"><TextInput value={form.vi} onChange={(vi) => setForm({ ...form, vi })} /></Field>
            <Field label="中文"><TextInput value={form.zh} onChange={(zh) => setForm({ ...form, zh })} /></Field>
          </div>
          <Field label="汉越" hint="可留空"><TextInput value={form.hanViet} onChange={(hanViet) => setForm({ ...form, hanViet })} /></Field>
          <div className="admin-grid-2">
            <Field label="例句越南语"><TextInput value={form.exampleVi} onChange={(exampleVi) => setForm({ ...form, exampleVi })} /></Field>
            <Field label="例句中文"><TextInput value={form.exampleZh} onChange={(exampleZh) => setForm({ ...form, exampleZh })} /></Field>
          </div>
          <Field label="注释"><TextArea value={form.note} onChange={(note) => setForm({ ...form, note })} rows={2} /></Field>
          <Field label="标签">
            <div className="admin-toolbar" style={{ marginBottom: 0 }}>
              {TAG_OPTIONS.map(([tag, label]) => (
                <button
                  key={tag}
                  type="button"
                  className={`admin-tab${form.tags.includes(tag) ? ' on' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除词条"
          confirmLabel="移入回收站"
          onConfirm={remove}
          onClose={() => setDeleteTarget(null)}
          busy={deleting}
        >
          <p><strong className="vi">{deleteTarget.vi}</strong> · {deleteTarget.zh}</p>
          <p className="muted">ID：{deleteTarget.id}。关联课程与句子会保留，词条可从回收站恢复。</p>
        </ConfirmDialog>
      )}
    </AdminPage>
  );
}
