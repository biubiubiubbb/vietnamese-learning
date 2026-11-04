import { useEffect, useState } from 'react';
import { api } from './api';
import type { PronunciationData } from '@viet/shared/pronunciation';
import {
  AlphabetEditor,
  MinimalPairsEditor,
  SoundGroupsEditor,
  ToneRulesEditor,
  TonesEditor,
} from './pronunciationEditors';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  Icon,
  Loading,
  StatusDot,
  useNotice,
  useUnsavedGuard,
  type IconName,
} from './ui';

type PronKey = keyof PronunciationData;

const TABS: Array<{ key: PronKey; label: string; icon: IconName }> = [
  { key: 'alphabet', label: '字母', icon: 'letter' },
  { key: 'tones', label: '声调', icon: 'tone' },
  { key: 'consonantGroups', label: '声母组', icon: 'wave' },
  { key: 'vowelGroups', label: '韵母组', icon: 'wave' },
  { key: 'minimalPairs', label: '最小对立体', icon: 'pair' },
  { key: 'toneRules', label: '标调规则', icon: 'rule' },
];

export default function AdminPronunciation() {
  const [data, setData] = useState<PronunciationData | null>(null);
  const [active, setActive] = useState<PronKey>('alphabet');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const notice = useNotice();
  useUnsavedGuard(dirty);

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<PronunciationData>('/api/admin/pronunciation'));
      setDirty(false);
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = <K extends PronKey>(key: K, value: PronunciationData[K]) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await Promise.all(
        TABS.map((tab) => api.put(`/api/admin/pronunciation/${tab.key}`, { payload: data[tab.key] })),
      );
      setDirty(false);
      notice.ok('已保存');
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="发音中心"
      subtitle="按板块编辑，所有板块随保存条一次性提交。"
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {loading ? <Loading /> : data && (
        <>
          <div className="admin-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`admin-tab${active === tab.key ? ' on' : ''}`}
                onClick={() => setActive(tab.key)}
                title={`${tab.label} ${(data[tab.key] as unknown[]).length} 条`}
              >
                <Icon name={tab.icon} />
                {tab.label}
                <span className="admin-seg-count">{(data[tab.key] as unknown[]).length}</span>
              </button>
            ))}
          </div>
          <Card>
            {active === 'alphabet' && <AlphabetEditor value={data.alphabet} onChange={(value) => update('alphabet', value)} />}
            {active === 'tones' && <TonesEditor value={data.tones} onChange={(value) => update('tones', value)} />}
            {active === 'consonantGroups' && (
              <SoundGroupsEditor value={data.consonantGroups} onChange={(value) => update('consonantGroups', value)} addLabel="添加声母组" />
            )}
            {active === 'vowelGroups' && (
              <SoundGroupsEditor value={data.vowelGroups} onChange={(value) => update('vowelGroups', value)} addLabel="添加韵母组" />
            )}
            {active === 'minimalPairs' && <MinimalPairsEditor value={data.minimalPairs} onChange={(value) => update('minimalPairs', value)} />}
            {active === 'toneRules' && <ToneRulesEditor value={data.toneRules} onChange={(value) => update('toneRules', value)} />}
          </Card>
          <div className="admin-savebar">
            <span className="admin-savebar-status">
              <StatusDot tone={dirty ? 'danger' : 'green'} label={dirty ? '有未保存修改' : '已保存'} />
              {dirty ? '有未保存修改' : '已保存'}
            </span>
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>保存全部板块</Button>
          </div>
        </>
      )}
    </AdminPage>
  );
}
