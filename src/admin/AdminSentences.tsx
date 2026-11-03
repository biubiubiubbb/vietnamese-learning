import { useEffect, useState } from 'react';
import { api } from './api';
import { SENTENCE_TAG_LABEL, type Lesson, type Sentence, type SentenceTag } from '../content/types';
import { SentenceChunksEditor, SentenceExercisesEditor, type VocabOption } from './editors';
import {
  AdminPage,
  Banner,
  Button,
  Field,
  Loading,
  Modal,
  Select,
  TextInput,
  useNotice,
} from './ui';

interface LessonRow {
  id: string;
  unitId: string;
  order: number;
  title: string;
}

const TAG_OPTIONS = Object.entries(SENTENCE_TAG_LABEL).map(([value, label]) => ({ value, label }));

const emptySentence = (lessonId: string): Sentence => ({
  id: '', lessonId, order: 0, vi: '', zh: '', tag: 'statement',
  chunks: [], exercises: [], note: undefined,
});

export default function AdminSentences() {
  const [rows, setRows] = useState<Sentence[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [vocabOptions, setVocabOptions] = useState<VocabOption[]>([]);
  const [lessonFilter, setLessonFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Sentence | null>(null);
  const [saving, setSaving] = useState(false);
  const notice = useNotice();

  const load = async (lessonId = lessonFilter) => {
    setLoading(true);
    setError('');
    try {
      const [sentenceRows, lessonRows, vocabRows] = await Promise.all([
        api.get<Sentence[]>(`/api/admin/sentences${lessonId ? `?lessonId=${lessonId}` : ''}`),
        lessons.length ? Promise.resolve(lessons as Lesson[]) : api.get<Lesson[]>('/api/admin/lessons'),
        vocabOptions.length ? Promise.resolve(vocabOptions) : api.get<VocabOption[]>('/api/admin/vocab'),
      ]);
      setRows(sentenceRows);
      setLessons(lessonRows);
      setVocabOptions(vocabRows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(''); }, []);

  const open = (row?: Sentence) => {
    setForm(row ? { ...row } : emptySentence(lessons[0]?.id ?? ''));
  };

  const save = async () => {
    if (!form) return;
    if (!form.id.trim() || !form.vi.trim() || !form.zh.trim() || !form.lessonId) {
      notice.err('ID、所属课程、越南语和中文不能为空');
      return;
    }
    if (form.chunks.length === 0) {
      notice.err('至少需要一个词块');
      return;
    }
    const normalize = (value: string) =>
      value.normalize('NFC').replace(/[.,!?;:…]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const joined = form.chunks.map((chunk) => chunk.vi).join(' ');
    if (normalize(joined) !== normalize(form.vi)) {
      notice.err('词块拼接结果与句子越南语不一致，请先修正词块');
      return;
    }
    setSaving(true);
    try {
      if (rows.some((row) => row.id === form.id)) {
        await api.put(`/api/admin/sentences/${form.id}`, form);
      } else {
        await api.post('/api/admin/sentences', form);
      }
      notice.ok('句子已保存，前端与整句音频会自动更新');
      setForm(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(`确定删除句子 ${id} 吗？将进入回收站。`)) return;
    try {
      await api.del(`/api/admin/sentences/${id}`);
      notice.ok('句子已移入回收站');
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  return (
    <AdminPage
      title="句子与句子练习"
      actions={<Button variant="primary" onClick={() => open()}>新增句子</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar">
        <Select
          value={lessonFilter}
          onChange={(value) => { setLessonFilter(value); load(value); }}
          options={[{ value: '', label: '全部课程' }, ...lessons.map((lesson) => ({ value: lesson.id, label: `${lesson.id} · ${lesson.title}` }))]}
        />
        <span className="muted" style={{ fontSize: 12.5 }}>共 {rows.length} 句</span>
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>课程</th><th>句子</th><th>句型</th><th>词块</th><th>练习</th><th>操作</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.lessonId}</td>
                  <td className="vi">{row.vi}<div className="muted" style={{ fontFamily: 'inherit' }}>{row.zh}</div></td>
                  <td>{SENTENCE_TAG_LABEL[row.tag]}</td>
                  <td>{row.chunks.length}</td>
                  <td>{row.exercises.length}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Button onClick={() => open(row)}>编辑</Button>
                      <Button variant="danger" onClick={() => remove(row.id)}>删除</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7}><div className="admin-empty">没有符合条件的句子</div></td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal
          title={rows.some((row) => row.id === form.id) ? '编辑句子' : '新增句子'}
          wide
          onClose={() => setForm(null)}
          footer={
            <>
              <Button onClick={() => setForm(null)}>取消</Button>
              <Button variant="primary" onClick={save} disabled={saving}>{saving ? '保存中…' : '保存并立即生效'}</Button>
            </>
          }
        >
          <div className="admin-grid-2">
            <Field label="ID" hint="创建后不可修改">
              <TextInput value={form.id} onChange={(id) => setForm({ ...form, id })} disabled={rows.some((row) => row.id === form.id)} />
            </Field>
            <Field label="所属课程">
              <Select value={form.lessonId} onChange={(lessonId) => setForm({ ...form, lessonId })} options={lessons.map((lesson) => ({ value: lesson.id, label: `${lesson.id} · ${lesson.title}` }))} />
            </Field>
          </div>
          <div className="admin-grid-2">
            <Field label="顺序"><TextInput type="number" value={String(form.order)} onChange={(order) => setForm({ ...form, order: Number(order) || 0 })} /></Field>
            <Field label="句型">
              <Select value={form.tag} onChange={(tag) => setForm({ ...form, tag: tag as SentenceTag })} options={TAG_OPTIONS} />
            </Field>
          </div>
          <Field label="越南语"><TextInput value={form.vi} onChange={(vi) => setForm({ ...form, vi })} /></Field>
          <Field label="中文"><TextInput value={form.zh} onChange={(zh) => setForm({ ...form, zh })} /></Field>
          <Field label="注释"><TextInput value={form.note ?? ''} onChange={(note) => setForm({ ...form, note: note || undefined })} /></Field>
          <Field label="词块拆解">
            <SentenceChunksEditor value={form.chunks} onChange={(chunks) => setForm({ ...form, chunks })} vocabOptions={vocabOptions} />
          </Field>
          <Field label="句子练习">
            <SentenceExercisesEditor value={form.exercises} onChange={(exercises) => setForm({ ...form, exercises })} chunks={form.chunks} />
          </Field>
        </Modal>
      )}
    </AdminPage>
  );
}
