import { useEffect, useState } from 'react';
import { api } from './api';
import type { Lesson, Unit } from '@viet/shared/types';
import { DialogueEditor, GrammarEditor, LessonExerciseEditor, StringListEditor, VocabPicker, type VocabOption } from './editors';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  ConfirmDialog,
  Field,
  Icon,
  IconButton,
  Loading,
  Modal,
  MoreMenu,
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

type DeleteTarget = { kind: 'units' | 'lessons'; id: string; title: string };

export default function AdminUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [vocabOptions, setVocabOptions] = useState<VocabOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unitForm, setUnitForm] = useState<Unit | null>(null);
  const [lessonForm, setLessonForm] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragUnit, setDragUnit] = useState<string | null>(null);
  const [dragLesson, setDragLesson] = useState<{ unitId: string; id: string } | null>(null);
  const [dropUnit, setDropUnit] = useState<string | null>(null);
  const [dropLesson, setDropLesson] = useState<string | null>(null);
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
      notice.ok('已保存');
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
      notice.ok('已保存');
      setLessonForm(null);
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
      await api.del(`/api/admin/${deleteTarget.kind}/${deleteTarget.id}`);
      notice.ok('已移入回收站');
      setDeleteTarget(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setDeleting(false);
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

  const dropUnitOn = async (targetId: string) => {
    if (!dragUnit || dragUnit === targetId) return;
    const from = units.findIndex((u) => u.id === dragUnit);
    const to = units.findIndex((u) => u.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...units];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setUnits(next);
    setDragUnit(null);
    setDropUnit(null);
    try {
      await api.post('/api/admin/units/reorder', { ids: next.map((u) => u.id) });
    } finally {
      await load();
    }
  };

  const dropLessonOn = async (unitId: string, targetId: string) => {
    if (!dragLesson || dragLesson.unitId !== unitId || dragLesson.id === targetId) return;
    const list = lessons.filter((l) => l.unitId === unitId);
    const from = list.findIndex((l) => l.id === dragLesson.id);
    const to = list.findIndex((l) => l.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setLessons([...lessons.filter((l) => l.unitId !== unitId), ...next]);
    setDragLesson(null);
    setDropLesson(null);
    try {
      await api.post('/api/admin/lessons/reorder', { ids: next.map((l) => l.id) });
    } finally {
      await load();
    }
  };

  return (
    <AdminPage
      title="课程结构"
      subtitle="拖动手柄可排序，单元内课程只在本单元内移动。"
      actions={<Button variant="primary" onClick={() => openUnit()}><Icon name="plus" />新增单元</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      {loading ? <Loading /> : (
        <div className="admin-grid">
          {units.map((unit) => {
            const unitLessons = lessons.filter((l) => l.unitId === unit.id);
            return (
              <div
                key={unit.id}
                className={`${dropUnit === unit.id ? 'admin-drop-target' : ''}${dragUnit === unit.id ? ' admin-dragging' : ''}`}
                onDragOver={(event) => {
                  if (!dragUnit) return;
                  event.preventDefault();
                  setDropUnit(unit.id);
                }}
                onDragLeave={() => setDropUnit((current) => (current === unit.id ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  dropUnitOn(unit.id);
                }}
              >
                <Card>
                  <div className="admin-page-head" style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span
                        className="admin-drag-handle"
                        draggable
                        aria-label="拖动排序单元"
                        title="拖动排序单元"
                        onDragStart={() => setDragUnit(unit.id)}
                        onDragEnd={() => { setDragUnit(null); setDropUnit(null); }}
                      >
                        <Icon name="drag" />
                      </span>
                      <div>
                        <h2>{unit.order}. {unit.title} <span className="admin-status admin-status-ready">{unit.level}</span></h2>
                        <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{unit.subtitle} · {unit.id}</p>
                      </div>
                    </div>
                    <div className="admin-row-actions">
                      <IconButton icon="up" label="上移单元" onClick={() => moveUnit(unit.id, -1)} disabled={units[0]?.id === unit.id} />
                      <IconButton icon="down" label="下移单元" onClick={() => moveUnit(unit.id, 1)} disabled={units[units.length - 1]?.id === unit.id} />
                      <IconButton icon="edit" label="编辑单元" tone="sky" onClick={() => openUnit(unit)} />
                      <IconButton icon="plus" label="新增课程" tone="green" onClick={() => openLesson(unit.id)} />
                      <MoreMenu
                        items={[
                          {
                            label: '删除单元',
                            icon: 'trash',
                            tone: 'danger',
                            onSelect: () => setDeleteTarget({ kind: 'units', id: unit.id, title: unit.title }),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>顺序</th><th>ID</th><th>课程</th><th>词汇</th><th>语法</th><th>对话</th><th>练习</th><th>操作</th></tr></thead>
                      <tbody>
                        {unitLessons.map((lesson) => (
                          <tr
                            key={lesson.id}
                            className={`${dropLesson === lesson.id ? 'admin-drop-target' : ''}${dragLesson?.id === lesson.id ? ' admin-dragging' : ''}`}
                            onDragOver={(event) => {
                              if (!dragLesson || dragLesson.unitId !== unit.id) return;
                              event.preventDefault();
                              setDropLesson(lesson.id);
                            }}
                            onDragLeave={() => setDropLesson((current) => (current === lesson.id ? null : current))}
                            onDrop={(event) => {
                              event.preventDefault();
                              dropLessonOn(unit.id, lesson.id);
                            }}
                          >
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span
                                  className="admin-drag-handle"
                                  draggable
                                  aria-label="拖动排序课程"
                                  title="拖动排序课程"
                                  onDragStart={() => setDragLesson({ unitId: unit.id, id: lesson.id })}
                                  onDragEnd={() => { setDragLesson(null); setDropLesson(null); }}
                                >
                                  <Icon name="drag" />
                                </span>
                                {lesson.order}
                              </div>
                            </td>
                            <td>{lesson.id}</td>
                            <td><strong>{lesson.title}</strong></td>
                            <td>
                              <span className={`admin-count-cell${lesson.vocabIds.length === 0 ? ' zero' : ''}`} title={`关联词汇 ${lesson.vocabIds.length} 个`}>
                                <Icon name="letter" />{lesson.vocabIds.length}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-count-cell${lesson.grammar.length === 0 ? ' zero' : ''}`} title={`语法点 ${lesson.grammar.length} 个`}>
                                <Icon name="rule" />{lesson.grammar.length}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-count-cell${lesson.dialogues.length === 0 ? ' zero' : ''}`} title={`对话 ${lesson.dialogues.length} 组`}>
                                <Icon name="pair" />{lesson.dialogues.length}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-count-cell${lesson.exercises.length === 0 ? ' zero' : ''}`} title={`练习 ${lesson.exercises.length} 道`}>
                                <Icon name="check" />{lesson.exercises.length}
                              </span>
                            </td>
                            <td>
                              <div className="admin-row-actions">
                                <IconButton icon="up" label="上移课程" onClick={() => moveLesson(unit.id, lesson.id, -1)} disabled={unitLessons[0]?.id === lesson.id} />
                                <IconButton icon="down" label="下移课程" onClick={() => moveLesson(unit.id, lesson.id, 1)} disabled={unitLessons[unitLessons.length - 1]?.id === lesson.id} />
                                <IconButton icon="edit" label="编辑课程" tone="sky" onClick={() => openLesson(unit.id, lesson)} />
                                <IconButton
                                  icon="trash"
                                  label="删除课程"
                                  tone="danger"
                                  onClick={() => setDeleteTarget({ kind: 'lessons', id: lesson.id, title: lesson.title })}
                                />
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
              </div>
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
              <Button variant="primary" onClick={saveUnit} loading={saving}>保存</Button>
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
              <Button variant="primary" onClick={saveLesson} loading={saving}>保存</Button>
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

      {deleteTarget && (
        <ConfirmDialog
          title={deleteTarget.kind === 'units' ? '删除单元' : '删除课程'}
          confirmLabel="移入回收站"
          onConfirm={remove}
          onClose={() => setDeleteTarget(null)}
          busy={deleting}
        >
          <p>将删除 <strong>{deleteTarget.title}</strong>（{deleteTarget.id}）。</p>
          <p className="muted">内容会移入回收站，可随时恢复。</p>
        </ConfirmDialog>
      )}
    </AdminPage>
  );
}
