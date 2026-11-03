import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  CHUNK_ROLE_LABEL,
  type ChunkRole,
  type Dialogue,
  type DialogueLine,
  type Exercise,
  type GrammarPoint,
  type SentenceChunk,
  type SentenceExercise,
  type VocabItem,
} from '@viet/shared/types';
import { Button, Field, Select, TextArea, TextInput } from './ui';

export type VocabOption = Pick<VocabItem, 'id' | 'vi' | 'zh'>;

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function EditableList<T>({
  items,
  onChange,
  create,
  render,
  addLabel,
  emptyText = '暂无内容',
}: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  emptyText?: string;
}) {
  const setAt = (index: number, patch: Partial<T>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-list-editor">
      {items.length === 0 && <div className="admin-empty">{emptyText}</div>}
      {items.map((item, index) => (
        <div className="admin-list-item" key={index}>
          <div className="admin-list-head">
            <span className="idx">#{index + 1}</span>
            <div className="admin-list-actions">
              <Button onClick={() => move(index, -1)}>↑</Button>
              <Button onClick={() => move(index, 1)}>↓</Button>
              <Button variant="danger" onClick={() => remove(index)}>删除</Button>
            </div>
          </div>
          {render(item, (patch) => setAt(index, patch))}
        </div>
      ))}
      <div>
        <Button onClick={() => onChange([...items, create()])}>+ {addLabel}</Button>
      </div>
    </div>
  );
}

export function StringListEditor({
  values,
  onChange,
  placeholder,
  addLabel = '添加一条',
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div>
      {values.map((value, index) => (
        <div className="admin-inline" key={index}>
          <TextInput
            value={value}
            placeholder={placeholder}
            onChange={(next) => onChange(values.map((item, i) => (i === index ? next : item)))}
          />
          <Button variant="danger" onClick={() => onChange(values.filter((_, i) => i !== index))}>删除</Button>
        </div>
      ))}
      <Button onClick={() => onChange([...values, ''])}>+ {addLabel}</Button>
    </div>
  );
}

export function PairListEditor({
  items,
  onChange,
  addLabel = '添加例句',
}: {
  items: Array<{ vi: string; zh: string }>;
  onChange: (items: Array<{ vi: string; zh: string }>) => void;
  addLabel?: string;
}) {
  return (
    <EditableList
      items={items}
      onChange={onChange}
      create={() => ({ vi: '', zh: '' })}
      addLabel={addLabel}
      emptyText="还没有例句"
      render={(item, update) => (
        <div className="admin-grid-2">
          <Field label="越南语"><TextInput value={item.vi} onChange={(vi) => update({ vi })} /></Field>
          <Field label="中文"><TextInput value={item.zh} onChange={(zh) => update({ zh })} /></Field>
        </div>
      )}
    />
  );
}

export function VocabPicker({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: VocabOption[];
}) {
  const [query, setQuery] = useState('');
  const selected = value
    .map((id) => options.find((option) => option.id === id))
    .filter((option): option is VocabOption => Boolean(option));
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((option) => !value.includes(option.id))
      .filter((option) => !q || `${option.id} ${option.vi} ${option.zh}`.toLowerCase().includes(q))
      .slice(0, 60);
  }, [options, query, value]);

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  };

  return (
    <div>
      <div className="admin-chip-row">
        {selected.length === 0 && <span className="muted" style={{ fontSize: 12 }}>还没有选择词汇</span>}
        {selected.map((option) => (
          <span className="admin-sel-chip" key={option.id}>
            {option.vi} · {option.id}
            <button type="button" onClick={() => toggle(option.id)} aria-label={`移除 ${option.id}`}>×</button>
          </span>
        ))}
      </div>
      <TextInput value={query} onChange={setQuery} placeholder="搜索词条" />
      <div className="admin-picker-list">
        {filtered.map((option) => (
          <label className="admin-picker-item" key={option.id}>
            <input type="checkbox" checked={false} onChange={() => toggle(option.id)} />
            <span className="vi">{option.vi}</span>
            <span className="muted">{option.zh}</span>
            <span className="admin-mini-id">{option.id}</span>
          </label>
        ))}
        {filtered.length === 0 && <span className="muted" style={{ fontSize: 12 }}>没有更多匹配词条</span>}
      </div>
    </div>
  );
}

export function GrammarEditor({
  value,
  onChange,
}: {
  value: GrammarPoint[];
  onChange: (value: GrammarPoint[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ id: newId('g'), title: '', explanation: '', examples: [], tips: [] })}
      addLabel="添加语法点"
      emptyText="还没有语法点"
      render={(item, update) => (
        <>
          <div className="admin-grid-2">
            <Field label="标题"><TextInput value={item.title} onChange={(title) => update({ title })} /></Field>
            <Field label="内部 ID"><span className="admin-mini-id">{item.id}</span></Field>
          </div>
          <Field label="讲解"><TextArea value={item.explanation} onChange={(explanation) => update({ explanation })} rows={3} /></Field>
          <Field label="记忆提示"><StringListEditor values={item.tips ?? []} onChange={(tips) => update({ tips })} addLabel="添加提示" /></Field>
          <Field label="例句"><PairListEditor items={item.examples ?? []} onChange={(examples) => update({ examples })} /></Field>
        </>
      )}
    />
  );
}

export function DialogueEditor({
  value,
  onChange,
}: {
  value: Dialogue[];
  onChange: (value: Dialogue[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ id: newId('d'), title: '', lines: [{ speaker: '', vi: '', zh: '' }] })}
      addLabel="添加对话"
      emptyText="还没有对话"
      render={(dialogue, update) => (
        <>
          <div className="admin-grid-2">
            <Field label="对话标题"><TextInput value={dialogue.title} onChange={(title) => update({ title })} /></Field>
            <Field label="内部 ID"><span className="admin-mini-id">{dialogue.id}</span></Field>
          </div>
          <Field label="台词">
            <EditableList<DialogueLine>
              items={dialogue.lines}
              onChange={(lines) => update({ lines })}
              create={() => ({ speaker: '', vi: '', zh: '' })}
              addLabel="添加台词"
              emptyText="还没有台词"
              render={(line, updateLine) => (
                <div className="admin-grid-3">
                  <Field label="说话人"><TextInput value={line.speaker} onChange={(speaker) => updateLine({ speaker })} /></Field>
                  <Field label="越南语"><TextInput value={line.vi} onChange={(vi) => updateLine({ vi })} /></Field>
                  <Field label="中文"><TextInput value={line.zh} onChange={(zh) => updateLine({ zh })} /></Field>
                </div>
              )}
            />
          </Field>
        </>
      )}
    />
  );
}

interface ExerciseDraft {
  id: string;
  type: 'choice' | 'fill';
  prompt: string;
  audioText: string;
  explain: string;
  options: string[];
  answer: number;
  answerText: string;
  accept: string[];
  hint: string;
}

function exerciseToDraft(ex: Exercise): ExerciseDraft {
  if (ex.type === 'choice') {
    return {
      id: ex.id, type: 'choice', prompt: ex.prompt, audioText: ex.audioText ?? '',
      explain: ex.explain ?? '', options: ex.options, answer: ex.answer,
      answerText: '', accept: [], hint: '',
    };
  }
  return {
    id: ex.id, type: 'fill', prompt: ex.prompt, audioText: ex.audioText ?? '',
    explain: ex.explain ?? '', options: [], answer: 0,
    answerText: ex.answer, accept: ex.accept ?? [], hint: ex.hint ?? '',
  };
}

function draftToExercise(draft: ExerciseDraft): Exercise {
  if (draft.type === 'choice') {
    return {
      id: draft.id,
      type: 'choice',
      prompt: draft.prompt,
      audioText: draft.audioText || undefined,
      options: draft.options,
      answer: draft.answer,
      explain: draft.explain || undefined,
    };
  }
  return {
    id: draft.id,
    type: 'fill',
    prompt: draft.prompt,
    audioText: draft.audioText || undefined,
    answer: draft.answerText,
    accept: draft.accept.length ? draft.accept : undefined,
    hint: draft.hint || undefined,
    explain: draft.explain || undefined,
  };
}

function emptyExercise(type: 'choice' | 'fill' = 'choice'): ExerciseDraft {
  return {
    id: newId('e'), type, prompt: '', audioText: '', explain: '',
    options: type === 'choice' ? ['', '', ''] : [], answer: 0,
    answerText: '', accept: [], hint: '',
  };
}

export function LessonExerciseEditor({
  value,
  onChange,
}: {
  value: Exercise[];
  onChange: (value: Exercise[]) => void;
}) {
  const drafts = value.map(exerciseToDraft);
  return (
    <EditableList
      items={drafts}
      onChange={(next) => onChange(next.map(draftToExercise))}
      create={() => emptyExercise()}
      addLabel="添加课程练习"
      emptyText="还没有课程练习"
      render={(item, update) => (
        <>
          <div className="admin-grid-2">
            <Field label="题型">
              <Select
                value={item.type}
                onChange={(type) => {
                  const next = emptyExercise(type as 'choice' | 'fill');
                  update({ ...next, id: item.id, prompt: item.prompt, audioText: item.audioText, explain: item.explain });
                }}
                options={[{ value: 'choice', label: '选择题' }, { value: 'fill', label: '填空题' }]}
              />
            </Field>
            <Field label="内部 ID"><span className="admin-mini-id">{item.id}</span></Field>
          </div>
          <Field label="题干"><TextInput value={item.prompt} onChange={(prompt) => update({ prompt })} /></Field>
          <Field label="音频文本">
            <TextInput value={item.audioText} onChange={(audioText) => update({ audioText })} />
          </Field>
          {item.type === 'choice' ? (
            <>
              <Field label="选项">
                <StringListEditor values={item.options} onChange={(options) => update({ options })} placeholder="选项内容" addLabel="添加选项" />
              </Field>
              <Field label="正确答案">
                <Select
                  value={String(item.answer)}
                  onChange={(answer) => update({ answer: Number(answer) })}
                  options={item.options.map((option, index) => ({ value: String(index), label: `${String.fromCharCode(65 + index)} · ${option || '未填写'}` }))}
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="答案"><TextInput value={item.answerText} onChange={(answerText) => update({ answerText })} /></Field>
              <Field label="可接受答案">
                <StringListEditor values={item.accept} onChange={(accept) => update({ accept })} placeholder="另一个可接受写法" addLabel="添加可接受答案" />
              </Field>
              <Field label="提示"><TextInput value={item.hint} onChange={(hint) => update({ hint })} /></Field>
            </>
          )}
          <Field label="解析"><TextArea value={item.explain} onChange={(explain) => update({ explain })} rows={2} /></Field>
        </>
      )}
    />
  );
}

export function SentenceChunksEditor({
  value,
  onChange,
  vocabOptions,
}: {
  value: SentenceChunk[];
  onChange: (value: SentenceChunk[]) => void;
  vocabOptions: VocabOption[];
}) {
  const preview = value.map((chunk) => chunk.vi).filter(Boolean).join(' ');
  return (
    <>
      <EditableList
        items={value}
        onChange={onChange}
        create={() => ({ vi: '', zh: '', role: 'subject' as ChunkRole, vocabId: undefined })}
        addLabel="添加词块"
        emptyText="还没有词块"
        render={(chunk, update) => (
          <>
            <div className="admin-grid-3">
              <Field label="越南语"><TextInput value={chunk.vi} onChange={(vi) => update({ vi })} /></Field>
              <Field label="中文"><TextInput value={chunk.zh} onChange={(zh) => update({ zh })} /></Field>
              <Field label="语法角色">
                <Select
                  value={chunk.role}
                  onChange={(role) => update({ role: role as ChunkRole })}
                  options={Object.entries(CHUNK_ROLE_LABEL).map(([value, label]) => ({ value, label }))}
                />
              </Field>
            </div>
            <Field label="关联词条">
              <Select
                value={chunk.vocabId ?? ''}
                onChange={(vocabId) => update({ vocabId: vocabId || undefined })}
                options={[
                  { value: '', label: '不关联词条' },
                  ...vocabOptions.map((option) => ({ value: option.id, label: `${option.vi} · ${option.zh} · ${option.id}` })),
                ]}
              />
            </Field>
          </>
        )}
      />
      <div className="admin-preview-line">拼接预览：{preview || '（尚未填写词块）'}</div>
    </>
  );
}

interface SentenceExerciseDraft {
  id: string;
  type: 'blank' | 'order' | 'translate';
  chunkIndex: number;
  answer: string;
  accept: string[];
  hint: string;
  explain: string;
  order: number[];
}

function sentenceExerciseToDraft(ex: SentenceExercise): SentenceExerciseDraft {
  if (ex.type === 'blank') {
    return {
      id: ex.id, type: 'blank', chunkIndex: ex.chunkIndex, answer: ex.answer,
      accept: ex.accept ?? [], hint: ex.hint ?? '', explain: ex.explain ?? '', order: [],
    };
  }
  if (ex.type === 'order') {
    return {
      id: ex.id, type: 'order', chunkIndex: 0, answer: '',
      accept: [], hint: '', explain: ex.explain ?? '', order: ex.answer,
    };
  }
  return {
    id: ex.id, type: 'translate', chunkIndex: 0, answer: ex.answer,
    accept: ex.accept ?? [], hint: ex.hint ?? '', explain: ex.explain ?? '', order: [],
  };
}

function draftToSentenceExercise(draft: SentenceExerciseDraft): SentenceExercise {
  if (draft.type === 'blank') {
    return {
      id: draft.id,
      type: 'blank',
      chunkIndex: Number(draft.chunkIndex),
      answer: draft.answer,
      accept: draft.accept.length ? draft.accept : undefined,
      hint: draft.hint || undefined,
      explain: draft.explain || undefined,
    };
  }
  if (draft.type === 'order') {
    return {
      id: draft.id,
      type: 'order',
      answer: draft.order,
      explain: draft.explain || undefined,
    };
  }
  return {
    id: draft.id,
    type: 'translate',
    answer: draft.answer,
    accept: draft.accept.length ? draft.accept : undefined,
    hint: draft.hint || undefined,
    explain: draft.explain || undefined,
  };
}

function emptySentenceExercise(type: 'blank' | 'order' | 'translate' = 'blank'): SentenceExerciseDraft {
  return {
    id: newId('se'), type, chunkIndex: 0, answer: '', accept: [], hint: '',
    explain: '', order: [],
  };
}

function OrderPicker({
  chunks,
  value,
  onChange,
}: {
  chunks: SentenceChunk[];
  value: number[];
  onChange: (value: number[]) => void;
}) {
  return (
    <div>
      <div className="admin-order-bank">
        {value.map((chunkIndex, position) => (
          <button
            className="admin-order-chip on"
            type="button"
            key={`${chunkIndex}-${position}`}
            onClick={() => onChange(value.filter((_, i) => i !== position))}
          >
            {position + 1}. {chunks[chunkIndex]?.vi || `词块 ${chunkIndex + 1}`}
          </button>
        ))}
      </div>
      <div className="admin-order-bank">
        {chunks.map((chunk, index) => (
          value.includes(index) ? null : (
            <button
              className="admin-order-chip"
              type="button"
              key={index}
              onClick={() => onChange([...value, index])}
            >
              {chunk.vi || `词块 ${index + 1}`}
            </button>
          )
        ))}
      </div>
      <div className="admin-inline">
        <Button onClick={() => onChange(chunks.map((_, index) => index))}>按原顺序</Button>
        <Button onClick={() => onChange([])}>清空</Button>
      </div>
    </div>
  );
}

export function SentenceExercisesEditor({
  value,
  onChange,
  chunks,
}: {
  value: SentenceExercise[];
  onChange: (value: SentenceExercise[]) => void;
  chunks: SentenceChunk[];
}) {
  const drafts = value.map(sentenceExerciseToDraft);
  return (
    <EditableList
      items={drafts}
      onChange={(next) => onChange(next.map(draftToSentenceExercise))}
      create={() => emptySentenceExercise()}
      addLabel="添加句子练习"
      emptyText="还没有句子练习"
      render={(item, update) => (
        <>
          <div className="admin-grid-2">
            <Field label="题型">
              <Select
                value={item.type}
                onChange={(type) => {
                  const next = emptySentenceExercise(type as 'blank' | 'order' | 'translate');
                  update({ ...next, id: item.id, explain: item.explain });
                }}
                options={[
                  { value: 'blank', label: '挖空' },
                  { value: 'order', label: '词序' },
                  { value: 'translate', label: '中译越' },
                ]}
              />
            </Field>
            <Field label="内部 ID"><span className="admin-mini-id">{item.id}</span></Field>
          </div>
          {item.type === 'blank' && (
            <>
              <Field label="挖空词块">
                <Select
                  value={String(item.chunkIndex)}
                  onChange={(chunkIndex) => update({ chunkIndex: Number(chunkIndex) })}
                  options={chunks.map((chunk, index) => ({ value: String(index), label: `#${index + 1} ${chunk.vi || '未填写'}` }))}
                />
              </Field>
              <Field label="答案"><TextInput value={item.answer} onChange={(answer) => update({ answer })} /></Field>
              <Field label="可接受答案">
                <StringListEditor values={item.accept} onChange={(accept) => update({ accept })} addLabel="添加可接受答案" />
              </Field>
              <Field label="提示"><TextInput value={item.hint} onChange={(hint) => update({ hint })} /></Field>
            </>
          )}
          {item.type === 'order' && (
            <Field label="正确词序">
              <OrderPicker chunks={chunks} value={item.order} onChange={(order) => update({ order })} />
            </Field>
          )}
          {item.type === 'translate' && (
            <>
              <Field label="参考答案"><TextInput value={item.answer} onChange={(answer) => update({ answer })} /></Field>
              <Field label="可接受答案">
                <StringListEditor values={item.accept} onChange={(accept) => update({ accept })} addLabel="添加可接受答案" />
              </Field>
              <Field label="提示"><TextInput value={item.hint} onChange={(hint) => update({ hint })} /></Field>
            </>
          )}
          <Field label="解析"><TextArea value={item.explain} onChange={(explain) => update({ explain })} rows={2} /></Field>
        </>
      )}
    />
  );
}
