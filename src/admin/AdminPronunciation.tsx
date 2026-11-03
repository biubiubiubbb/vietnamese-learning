import { useEffect, useState } from 'react';
import { api } from './api';
import type { PronunciationData } from '../content/pronunciation';
import {
  AlphabetEditor,
  MinimalPairsEditor,
  PronunciationSaveButton,
  SoundGroupsEditor,
  ToneRulesEditor,
  TonesEditor,
} from './pronunciationEditors';
import {
  AdminPage,
  Banner,
  Card,
  Loading,
  useNotice,
} from './ui';

type PronKey = keyof PronunciationData;

const TABS: Array<{ key: PronKey; label: string }> = [
  { key: 'alphabet', label: '字母' },
  { key: 'tones', label: '声调' },
  { key: 'consonantGroups', label: '声母组' },
  { key: 'vowelGroups', label: '韵母组' },
  { key: 'minimalPairs', label: '最小对立体' },
  { key: 'toneRules', label: '标调规则' },
];

export default function AdminPronunciation() {
  const [data, setData] = useState<PronunciationData | null>(null);
  const [active, setActive] = useState<PronKey>('alphabet');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const notice = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<PronunciationData>('/api/admin/pronunciation'));
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = <K extends PronKey>(key: K, value: PronunciationData[K]) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await Promise.all(
        TABS.map((tab) => api.put(`/api/admin/pronunciation/${tab.key}`, { payload: data[tab.key] })),
      );
      notice.ok('发音中心已保存，前端立即生效');
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage title="发音中心">
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
              >
                {tab.label}（{(data[tab.key] as unknown[]).length}）
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
            <PronunciationSaveButton saving={saving} onSave={save} />
          </Card>
        </>
      )}
    </AdminPage>
  );
}
