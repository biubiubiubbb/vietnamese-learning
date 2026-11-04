import type { AlphabetItem, MinimalPair, RuleNote, SoundGroup, ToneItem } from '@viet/shared/types';
import { EditableList, PairListEditor } from './editors';
import { Button, Field, TextArea, TextInput } from './ui';

type SoundItem = SoundGroup['items'][number];

export function AlphabetEditor({
  value,
  onChange,
}: {
  value: AlphabetItem[];
  onChange: (value: AlphabetItem[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ letter: '', name: '', ipa: '', zhApprox: '', note: '' })}
      addLabel="添加字母"
      emptyText="还没有字母"
      render={(item, update) => (
        <>
          <div className="admin-grid-3">
            <Field label="展示字母"><TextInput value={item.letter} onChange={(letter) => update({ letter })} /></Field>
            <Field label="朗读名称"><TextInput value={item.name} onChange={(name) => update({ name })} /></Field>
            <Field label="IPA"><TextInput value={item.ipa} onChange={(ipa) => update({ ipa })} /></Field>
          </div>
          <div className="admin-grid-2">
            <Field label="中文近似"><TextInput value={item.zhApprox} onChange={(zhApprox) => update({ zhApprox })} /></Field>
            <Field label="注释"><TextInput value={item.note ?? ''} onChange={(note) => update({ note: note || undefined })} /></Field>
          </div>
        </>
      )}
    />
  );
}

export function TonesEditor({
  value,
  onChange,
}: {
  value: ToneItem[];
  onChange: (value: ToneItem[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ name: '', mark: '', sample: '', contour: '', zhFeel: '', example: { vi: '', zh: '' } })}
      addLabel="添加声调"
      emptyText="还没有声调"
      render={(item, update) => (
        <>
          <div className="admin-grid-2">
            <Field label="名称"><TextInput value={item.name} onChange={(name) => update({ name })} /></Field>
            <Field label="调号"><TextInput value={item.mark} onChange={(mark) => update({ mark })} /></Field>
          </div>
          <div className="admin-grid-2">
            <Field label="示例音节"><TextInput value={item.sample} onChange={(sample) => update({ sample })} /></Field>
            <Field label="声调曲线 SVG path" hint="例如 M 8 34 L 62 34">
              <TextInput value={item.contour} onChange={(contour) => update({ contour })} />
            </Field>
          </div>
          <div className="admin-grid-2">
            <Field label="中文感受"><TextArea value={item.zhFeel} onChange={(zhFeel) => update({ zhFeel })} rows={2} /></Field>
            <div>
              <Field label="曲线预览">
                <svg width="120" height="52" viewBox="0 0 70 52" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', borderRadius: 8 }}>
                  <path d={item.contour} fill="none" stroke="var(--orange)" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </Field>
            </div>
          </div>
          <div className="admin-grid-2">
            <Field label="示例词越南语"><TextInput value={item.example.vi} onChange={(vi) => update({ example: { ...item.example, vi } })} /></Field>
            <Field label="示例词中文"><TextInput value={item.example.zh} onChange={(zh) => update({ example: { ...item.example, zh } })} /></Field>
          </div>
        </>
      )}
    />
  );
}

export function SoundGroupsEditor({
  value,
  onChange,
  addLabel = '添加音组',
}: {
  value: SoundGroup[];
  onChange: (value: SoundGroup[]) => void;
  addLabel?: string;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ title: '', items: [] })}
      addLabel={addLabel}
      emptyText="还没有音组"
      collapsible
      defaultCollapsed
      summary={(group) => (
        <>
          {group.title || '未命名分组'}
          <span className="muted">· {group.items.length} 个音</span>
        </>
      )}
      render={(group, update) => (
        <>
          <Field label="分组标题"><TextInput value={group.title} onChange={(title) => update({ title })} /></Field>
          <Field label="组内条目">
            <EditableList<SoundItem>
              items={group.items}
              onChange={(items) => update({ items })}
              create={() => ({ sound: '', ipa: '', zhApprox: '', example: { vi: '', zh: '' }, note: '' })}
              addLabel="添加音"
              emptyText="这个分组还没有音"
              render={(item, updateItem) => (
                <>
                  <div className="admin-grid-3">
                    <Field label="音"><TextInput value={item.sound} onChange={(sound) => updateItem({ sound })} /></Field>
                    <Field label="IPA"><TextInput value={item.ipa} onChange={(ipa) => updateItem({ ipa })} /></Field>
                    <Field label="中文近似"><TextInput value={item.zhApprox} onChange={(zhApprox) => updateItem({ zhApprox })} /></Field>
                  </div>
                  <div className="admin-grid-2">
                    <Field label="示例词越南语"><TextInput value={item.example.vi} onChange={(vi) => updateItem({ example: { ...item.example, vi } })} /></Field>
                    <Field label="示例词中文"><TextInput value={item.example.zh} onChange={(zh) => updateItem({ example: { ...item.example, zh } })} /></Field>
                  </div>
                  <Field label="注释"><TextInput value={item.note ?? ''} onChange={(note) => updateItem({ note: note || undefined })} /></Field>
                </>
              )}
            />
          </Field>
        </>
      )}
    />
  );
}

export function MinimalPairsEditor({
  value,
  onChange,
}: {
  value: MinimalPair[];
  onChange: (value: MinimalPair[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ pair: ['', ''], zh: ['', ''], point: '' })}
      addLabel="添加最小对立体"
      emptyText="还没有最小对立体"
      render={(item, update) => {
        const rows = item.pair.map((vi, index) => ({ vi, zh: item.zh[index] ?? '' }));
        return (
          <>
            <Field label="对比词">
              <EditableList
                items={rows}
                onChange={(next) => update({ pair: next.map((row) => row.vi), zh: next.map((row) => row.zh) })}
                create={() => ({ vi: '', zh: '' })}
                addLabel="添加对比词"
                render={(row, updateRow) => (
                  <div className="admin-grid-2">
                    <Field label="越南语"><TextInput value={row.vi} onChange={(vi) => updateRow({ vi })} /></Field>
                    <Field label="中文"><TextInput value={row.zh} onChange={(zh) => updateRow({ zh })} /></Field>
                  </div>
                )}
              />
            </Field>
            <Field label="辨析点"><TextArea value={item.point} onChange={(point) => update({ point })} rows={2} /></Field>
          </>
        );
      }}
    />
  );
}

export function ToneRulesEditor({
  value,
  onChange,
}: {
  value: RuleNote[];
  onChange: (value: RuleNote[]) => void;
}) {
  return (
    <EditableList
      items={value}
      onChange={onChange}
      create={() => ({ title: '', body: '', examples: [] })}
      addLabel="添加标调规则"
      emptyText="还没有标调规则"
      render={(item, update) => (
        <>
          <Field label="标题"><TextInput value={item.title} onChange={(title) => update({ title })} /></Field>
          <Field label="正文"><TextArea value={item.body} onChange={(body) => update({ body })} rows={3} /></Field>
          <Field label="示例"><PairListEditor items={item.examples ?? []} onChange={(examples) => update({ examples })} /></Field>
        </>
      )}
    />
  );
}

export function PronunciationSaveButton({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <Button variant="primary" onClick={onSave} disabled={saving}>
        {saving ? '保存中…' : '保存'}
      </Button>
    </div>
  );
}
