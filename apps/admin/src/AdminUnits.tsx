import { useEffect, useState } from 'react';
import { api } from './api';
import type { Lesson, Unit } from '@viet/shared/types';
import { DialogueEditor, GrammarEditor, LessonExerciseEditor, StringListEditor, VocabPicker, type VocabOption } from './editors';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  Field,
  Loading,
  Modal,
  Select,
  TextInput,
  useNotice,
} from './ui';

const emptyUnit = (): Unit => ({
  id: '', level: 'A1', order: 0, title: '', subtitle: '', lessonIds: [],
});

const emptyLesson = (unitId: string): Lesson => ({
  id: '', unitId, order: 0, title: '', goals: [], vocabIds: [],
  grammar: [], dialogues: [], exercises: [],
});

export default function AdminUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [vocabOptions, setVocabOptions] = useState<VocabOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unitForm, setUnitForm] = useState<Unit | null>(null);
  const [lessonForm, setLessonForm] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [unitRows, lessonRows, vocabRows] = await Promise.all([
        api.get<Unit[]>('/api/admin/units'),
        api.get<Lesson[]>('/api/admin/lessons'),
        api.get<VocabOption[]>('/api/admin/vocab'),
      ]);
      setUnits(unitRows);
      setLessons(lessonRows);
      setVocabOptions(vocabRows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openUnit = (unit?: Unit) => {
    setUnitForm(unit ? { ...unit } : emptyUnit());
  };

  const openLesson = (unitId: string, lesson?: Lesson) => {
    setLessonForm(lesson ? { ...lesson } : emptyLesson(unitId));
  };

  const saveUnit = async () => {
    if (!unitForm) return;
    if (!unitForm.id.trim() || !unitForm.title.trim()) {
      notice.err('ID 和标题不能为空');
      return;
    }
    setSaving(true);
    try {
      if (units.some((u) => u.id === unitForm.id)) {
        await api.put(`/api/admin/units/${unitForm.id}`, unitForm);
      } else {
        await api.post('/api/admin/units', unitForm);
      }
      notice.ok('单元已保存，前端立即生效');
      setUnitForm(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const saveLesson = async () => {
    if (!lessonForm) return;
    if (!lessonForm.id.trim() || !lessonForm.title.trim()) {
      notice.err('ID 和标题不能为空');
      return;
    }
    setSaving(true);
    try {
      if (lessons.some((l) => l.id === lessonForm.id)) {
        await api.put(`/api/admin/lessons/${lessonForm.id}`, lessonForm);
      } else {
        await api.post('/api/admin/lessons', lessonForm);
      }
      notice.ok('课程已保存，前端立即生效');
      setLessonForm(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (kind: 'units' | 'lessons', id: string) => {
    if (!window.confirm(`确定删除这个${kind === 'units' ? '单元' : '课程'}吗？将进入回收站。`)) return;
    try {
      await api.del(`/api/admin/${kind}/${id}`);
      notice.ok('已移入回收站');
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const moveUnit = async (id: string, direction: -1 | 1) => {
    const index = units.findIndex((u) => u.id === id);
    const target = index + direction;
    if (target < 0 || target >= units.length) return;
    const next = [...units];
    [next[index], next[target]] = [next[target], next[index]];
    setUnits(next);
    await api.post('/api/admin/units/reorder', { ids: next.map((u) => u.id) });
    await load();
  };

  const moveLesson = async (unitId: string, id: string, direction: -1 | 1) => {
    const list = lessons.filter((l) => l.unitId === unitId);
    const index = list.findIndex((l) => l.id === id);
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    setLessons([...lessons.filter((l) => l.unitId !== unitId), ...next]);
    await api.post('/api/admin/lessons/reorder', { ids: next.map((l) => l.id) });
    await load();
  };

  return (
    <AdminPage
      title="课程结构"
      actions={<Button variant="primary" onClick={() => openUnit()}>新增单元</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      {loading ? <Loading /> : (
        <div className="admin-grid">
          {units.map((unit) => {
            const unitLessons = lessons.filter((l) => l.unitId === unit.id);
            return (
              <Card key={unit.id}>
                <div className="admin-page-head" style={{ marginBottom: 10 }}>
                  <div>
                    <h2>{unit.order}. {unit.title} <span className="admin-status admin-status-ready">{unit.level}</span></h2>
                    <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{unit.subtitle} · {unit.id}</p>
                  </div>
                  <div className="admin-row-actions">
                    <Button onClick={() => moveUnit(unit.id, -1)}>上移</Button>
                    <Button onClick={() => moveUnit(unit.id, 1)}>下移</Button>
                    <Button onClick={() => openUnit(unit)}>编辑单元</Button>
                    <Button onClick={() => openLesson(unit.id)}>新增课程</Button>
                    <Button variant="danger" onClick={() => remove('units', unit.id)}>删除</Button>
                  </div>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>顺序</th><th>ID</th><th>课程</th><th>词汇</th><th>语法</th><th>对话</th><th>练习</th><th>操作</th></tr></thead>
                    <tbody>
                      {unitLessons.map((lesson) => (
                        <tr key={lesson.id}>
                          <td>{lesson.order}</td>
                          <td>{lesson.id}</td>
                          <td><strong>{lesson.title}</strong></td>
                          <td>{lesson.vocabIds.length}</td>
                          <td>{lesson.grammar.length}</td>
                          <td>{lesson.dialogues.length}</td>
                          <td>{lesson.exercises.length}</td>
                          <td>
                            <div className="admin-row-actions">
                              <Button onClick={() => moveLesson(unit.id, lesson.id, -1)}>↑</Button>
                              <Button onClick={() => moveLesson(unit.id, lesson.id, 1)}>↓</Button>
                              <Button onClick={() => openLesson(unit.id, lesson)}>编辑</Button>
                              <Button variant="danger" onClick={() => remove('lessons', lesson.id)}>删除</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {unitLessons.length === 0 && (
                        <tr><td colSpan={8}><div className="admin-empty">这个单元还没有课程</div></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {unitForm && (
        <Modal
          title={units.some((u) => u.id === unitForm.id) ? '编辑单元' : '新增单元'}
          onClose={() => setUnitForm(null)}
          footer={
            <>
              <Button onClick={() => setUnitForm(null)}>取消</Button>
              <Button variant="primary" onClick={saveUnit} disabled={saving}>{saving ? '保存中…' : '保存'}</Button>
            </>
          }
        >
          <Field label="ID" hint="创建后不可修改">
            <TextInput value={unitForm.id} onChange={(id) => setUnitForm({ ...unitForm, id })} disabled={units.some((u) => u.id === unitForm.id)} />
          </Field>
          <div className="admin-grid-2">
            <Field label="级别">
              <Select value={unitForm.level} onChange={(level) => setUnitForm({ ...unitForm, level: level as 'A1' | 'A2' })} options={[{ value: 'A1', label: 'A1' }, { value: 'A2', label: 'A2' }]} />
            </Field>
            <Field label="顺序"><TextInput type="number" value={String(unitForm.order)} onChange={(order) => setUnitForm({ ...unitForm, order: Number(order) || 0 })} /></Field>
          </div>
          <Field label="标题"><TextInput value={unitForm.title} onChange={(title) => setUnitForm({ ...unitForm, title })} /></Field>
          <Field label="副标题"><TextInput value={unitForm.subtitle} onChange={(subtitle) => setUnitForm({ ...unitForm, subtitle })} /></Field>
        </Modal>
      )}

      {lessonForm && (
        <Modal
          title={lessons.some((l) => l.id === lessonForm.id) ? '编辑课程' : '新增课程'}
          wide
          onClose={() => setLessonForm(null)}
          footer={
            <>
              <Button onClick={() => setLessonForm(null)}>取消</Button>
              <Button variant="primary" onClick={saveLesson} disabled={saving}>{saving ? '保存中…' : '保存并立即生效'}</Button>
            </>
          }
        >
          <div className="admin-grid-2">
            <Field label="ID" hint="创建后不可修改">
              <TextInput value={lessonForm.id} onChange={(id) => setLessonForm({ ...lessonForm, id })} disabled={lessons.some((l) => l.id === lessonForm.id)} />
            </Field>
            <Field label="所属单元">
              <Select value={lessonForm.unitId} onChange={(unitId) => setLessonForm({ ...lessonForm, unitId })} options={units.map((u) => ({ value: u.id, label: `${u.order}. ${u.title}` }))} />
            </Field>
          </div>
          <div className="admin-grid-2">
            <Field label="顺序"><TextInput type="number" value={String(lessonForm.order)} onChange={(order) => setLessonForm({ ...lessonForm, order: Number(order) || 0 })} /></Field>
            <Field label="标题"><TextInput value={lessonForm.title} onChange={(title) => setLessonForm({ ...lessonForm, title })} /></Field>
          </div>
          <Field label="学习目标">
            <StringListEditor values={lessonForm.goals} onChange={(goals) => setLessonForm({ ...lessonForm, goals })} placeholder="例如：认识越南语 29 个字母" addLabel="添加目标" />
          </Field>
          <Field label="关联词汇">
            <VocabPicker value={lessonForm.vocabIds} onChange={(vocabIds) => setLessonForm({ ...lessonForm, vocabIds })} options={vocabOptions} />
          </Field>
          <Field label="语法点">
            <GrammarEditor value={lessonForm.grammar} onChange={(grammar) => setLessonForm({ ...lessonForm, grammar })} />
          </Field>
          <Field label="对话">
            <DialogueEditor value={lessonForm.dialogues} onChange={(dialogues) => setLessonForm({ ...lessonForm, dialogues })} />
          </Field>
          <Field label="课程练习">
            <LessonExerciseEditor value={lessonForm.exercises} onChange={(exercises) => setLessonForm({ ...lessonForm, exercises })} />
          </Field>
        </Modal>
      )}
    </AdminPage>
  );
}
