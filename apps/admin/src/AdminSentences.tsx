import { useEffect, useState } from 'react';
import { api } from './api';
import { SENTENCE_TAG_LABEL, type Lesson, type Sentence, type SentenceTag } from '@viet/shared/types';
import { SentenceChunksEditor, SentenceExercisesEditor, checkChunkMatch, type VocabOption } from './editors';
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
  id: newId('s'), lessonId, order: 0, vi: '', zh: '', tag: 'statement',
  chunks: [], exercises: [], note: undefined,
});

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export default function AdminSentences() {
  const [rows, setRows] = useState<Sentence[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [vocabOptions, setVocabOptions] = useState<VocabOption[]>([]);
  const [lessonFilter, setLessonFilter] = useState('');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<SentenceTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Sentence | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sentence | null>(null);
  const [deleting, setDeleting] = useState(false);
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
      notice.err('所属课程、越南语和中文不能为空');
      return;
    }
    const match = checkChunkMatch(form.chunks, form.vi);
    if (!match.ok) {
      notice.err(match.message);
      return;
    }
    setSaving(true);
    try {
      if (rows.some((row) => row.id === form.id)) {
        await api.put(`/api/admin/sentences/${form.id}`, form);
      } else {
        await api.post('/api/admin/sentences', form);
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
      await api.del(`/api/admin/sentences/${deleteTarget.id}`);
      notice.ok('句子已移入回收站');
      setDeleteTarget(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const keyword = query.trim().toLowerCase();
  const filtered = rows.filter((row) =>
    (!keyword || `${row.id} ${row.vi} ${row.zh}`.toLowerCase().includes(keyword))
    && (tagFilter === 'all' || row.tag === tagFilter),
  );
  const filtering = keyword.length > 0 || tagFilter !== 'all';
  const formMatch = form ? checkChunkMatch(form.chunks, form.vi) : null;

  const clearFilters = () => {
    setQuery('');
    setTagFilter('all');
    setLessonFilter('');
    load('');
  };

  return (
    <AdminPage
      title="句子与句子练习"
      actions={<Button variant="primary" onClick={() => open()}><Icon name="plus" />新增句子</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <TextInput
            value={query}
            onChange={setQuery}
            placeholder="搜索句子 / 中文 / ID"
            onKeyDown={(event) => { if (event.key === 'Enter') load(); }}
          />
          <Button onClick={() => load()}><Icon name="search" />搜索</Button>
        </div>
        <Select
          value={lessonFilter}
          onChange={(value) => { setLessonFilter(value); load(value); }}
          options={[{ value: '', label: '全部课程' }, ...lessons.map((lesson) => ({ value: lesson.id, label: `${lesson.id} · ${lesson.title}` }))]}
        />
        <span className="muted" style={{ fontSize: 12.5 }}>
          {filtering ? `筛选 ${filtered.length} / ${rows.length} 句` : `共 ${rows.length} 句`}
        </span>
      </div>
      <div className="admin-chips" style={{ marginBottom: 12 }}>
        <button type="button" className={`admin-tab${tagFilter === 'all' ? ' on' : ''}`} onClick={() => setTagFilter('all')}>
          全部句型
        </button>
        {TAG_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`admin-tab${tagFilter === value ? ' on' : ''}`}
            onClick={() => setTagFilter((current) => (current === value ? 'all' : value as SentenceTag))}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>课程</th><th>句子</th><th>句型</th><th>词块</th><th>练习</th><th>操作</th></tr></thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="admin-row-clickable" onClick={() => open(row)}>
                  <td>{row.id}</td>
                  <td>{row.lessonId}</td>
                  <td className="vi">{row.vi}<div className="muted" style={{ fontFamily: 'inherit' }}>{row.zh}</div></td>
                  <td>{SENTENCE_TAG_LABEL[row.tag]}</td>
                  <td>
                    <span className={`admin-count-cell${row.chunks.length === 0 ? ' zero' : ''}`} title={`词块 ${row.chunks.length} 个`}>
                      <Icon name="pair" />{row.chunks.length}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-count-cell${row.exercises.length === 0 ? ' zero' : ''}`} title={`练习 ${row.exercises.length} 道`}>
                      <Icon name="check" />{row.exercises.length}
                    </span>
                  </td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <div className="admin-row-actions">
                      <IconButton icon="edit" label={`编辑 ${row.id}`} tone="sky" onClick={() => open(row)} />
                      <IconButton icon="trash" label={`删除 ${row.id}`} tone="danger" onClick={() => setDeleteTarget(row)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty">
                      {filtering ? '没有符合条件的句子' : '还没有句子'}
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
          title={rows.some((row) => row.id === form.id) ? '编辑句子' : '新增句子'}
          wide
          onClose={() => setForm(null)}
          footer={
            <>
              <Button onClick={() => setForm(null)}>取消</Button>
              <Button variant="primary" onClick={save} loading={saving} disabled={!formMatch?.ok}>保存</Button>
            </>
          }
        >
          <Field label="所属课程">
            <Select value={form.lessonId} onChange={(lessonId) => setForm({ ...form, lessonId })} options={lessons.map((lesson) => ({ value: lesson.id, label: `${lesson.id} · ${lesson.title}` }))} />
          </Field>
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
            <SentenceChunksEditor
              value={form.chunks}
              onChange={(chunks) => setForm({ ...form, chunks })}
              vocabOptions={vocabOptions}
              sentence={form.vi}
            />
          </Field>
          <Field label="句子练习">
            <SentenceExercisesEditor value={form.exercises} onChange={(exercises) => setForm({ ...form, exercises })} chunks={form.chunks} />
          </Field>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除句子"
          confirmLabel="移入回收站"
          onConfirm={remove}
          onClose={() => setDeleteTarget(null)}
          busy={deleting}
        >
          <p><strong className="vi">{deleteTarget.vi}</strong></p>
          <p className="muted">{deleteTarget.zh}</p>
          <p className="muted">ID：{deleteTarget.id}。词块与练习一并移入回收站，可随时恢复。</p>
        </ConfirmDialog>
      )}
    </AdminPage>
  );
}
