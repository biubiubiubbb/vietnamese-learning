import { useEffect, useState } from 'react';
import { api } from './api';
import { POS_LABEL, TAG_LABEL, type Pos, type VocabTag } from '@viet/shared/types';
import {
  AdminPage,
  Banner,
  Button,
  Field,
  Loading,
  Modal,
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
  id: '', vi: '', zh: '', pos: 'n', hanViet: '', exampleVi: '', exampleZh: '', note: '', tags: [],
});

const POS_OPTIONS = Object.entries(POS_LABEL).map(([value, label]) => ({ value, label }));
const TAG_OPTIONS = Object.entries(TAG_LABEL) as Array<[VocabTag, string]>;

export default function AdminVocab() {
  const [rows, setRows] = useState<VocabRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<VocabForm | null>(null);
  const [saving, setSaving] = useState(false);
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

  const remove = async (id: string) => {
    if (!window.confirm(`确定删除词条 ${id} 吗？将进入回收站。`)) return;
    try {
      await api.del(`/api/admin/vocab/${id}`);
      notice.ok('词条已移入回收站');
      await load();
    } catch (e) {
      notice.err((e as Error).message);
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

  return (
    <AdminPage
      title="词汇库"
      actions={<Button variant="primary" onClick={() => open()}>新增词条</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar">
        <TextInput value={query} onChange={setQuery} placeholder="搜索越南语 / 中文 / ID" />
        <Button onClick={() => load()}>搜索</Button>
        <span className="muted" style={{ fontSize: 12.5 }}>共 {rows.length} 条</span>
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>越南语</th><th>中文</th><th>词性</th><th>标签</th><th>操作</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td className="vi">{row.vi}</td>
                  <td>{row.zh}{row.hanViet ? <span className="muted"> · 汉越 {row.hanViet}</span> : null}</td>
                  <td>{POS_LABEL[row.pos]}</td>
                  <td>{(row.tags ?? []).map((tag) => TAG_LABEL[tag]).join(' / ') || '—'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Button onClick={() => open(row)}>编辑</Button>
                      <Button variant="danger" onClick={() => remove(row.id)}>删除</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6}><div className="admin-empty">没有匹配的词条</div></td></tr>}
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
              <Button variant="primary" onClick={save} disabled={saving}>{saving ? '保存中…' : '保存'}</Button>
            </>
          }
        >
          <div className="admin-grid-2">
            <Field label="ID" hint="创建后不可修改"><TextInput value={form.id} onChange={(id) => setForm({ ...form, id })} disabled={rows.some((row) => row.id === form.id)} /></Field>
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
    </AdminPage>
  );
}
