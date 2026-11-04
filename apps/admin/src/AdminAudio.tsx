import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, apiUrl } from './api';
import {
  AdminPage,
  Banner,
  Button,
  Loading,
  Modal,
  Select,
  TextInput,
  useNotice,
} from './ui';

interface AudioAsset {
  id: number;
  voice: 'female' | 'male' | 'human';
  source: string;
  status: string;
  enabled: boolean;
  error?: string | null;
  updatedAt: number;
  bytes: number;
}

type AudioType = 'word' | 'sentence' | 'pronunciation';

interface AudioGroup {
  text: string;
  type: AudioType;
  zh: string;
  female: AudioAsset | null;
  male: AudioAsset | null;
  human: AudioAsset | null;
}

interface AudioList {
  items: AudioGroup[];
  total: number;
  page: number;
  pageSize: number;
}

const VOICE_LABEL: Record<string, string> = { female: '女声', male: '男声', human: '人声' };
const TYPE_LABEL: Record<AudioType, string> = { word: '单词', sentence: '句子', pronunciation: '发音' };
const TYPE_OPTIONS: Array<{ value: '' | AudioType; label: string }> = [
  { value: '', label: '全部' },
  { value: 'word', label: '单词' },
  { value: 'sentence', label: '句子' },
  { value: 'pronunciation', label: '发音' },
];

function isReady(asset: AudioAsset | null): asset is AudioAsset {
  return !!asset && asset.status === 'ready' && asset.bytes > 0;
}

function isPlayable(asset: AudioAsset | null) {
  return isReady(asset) && asset.enabled;
}

function isGenerating(asset: AudioAsset | null) {
  return !!asset && (asset.status === 'pending' || asset.status === 'generating');
}

function isFailed(asset: AudioAsset | null) {
  return !!asset && asset.status === 'failed';
}

function formatTime(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function FemaleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="8" r="5" />
      <path d="M10 13v6M7 16h6" />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="8" cy="11" r="5" />
      <path d="M11.6 7.4L17 2M13 2h4v4" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="7" y="2" width="6" height="9" rx="3" />
      <path d="M4 10a6 6 0 0 0 12 0M10 16v3" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6 3l10 7-10 7z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 8a7 7 0 1 1 2 5" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 8h3l4-3v10l-4-3H4z" />
      <path d="M14 7c1.2 1.6 1.2 4.4 0 6" />
    </svg>
  );
}

function VoiceBadge({ voice, asset }: { voice: 'female' | 'male' | 'human'; asset: AudioAsset | null }) {
  const playable = isPlayable(asset);
  const generating = isGenerating(asset);
  const failed = isFailed(asset);
  const tone = playable ? voice : 'off';
  const label = asset
    ? generating
      ? `${VOICE_LABEL[voice]}生成中`
      : failed
        ? `${VOICE_LABEL[voice]}生成失败${asset.error ? `：${asset.error}` : ''}`
        : playable
          ? `${VOICE_LABEL[voice]}可用`
          : `${VOICE_LABEL[voice]}已停用`
    : voice === 'human'
      ? '未录制'
      : `${VOICE_LABEL[voice]}缺失`;

  return (
    <span className={`audio-voice audio-voice-${tone}`} title={label} aria-label={label}>
      {voice === 'female' ? <FemaleIcon /> : voice === 'male' ? <MaleIcon /> : <MicIcon />}
      {generating && <span className="audio-voice-ring" />}
      {failed && <span className="audio-voice-dot" />}
    </span>
  );
}

function AudioSwitch({
  on,
  mid = false,
  label,
  disabled = false,
  onClick,
}: {
  on: boolean;
  mid?: boolean;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={label}
      className={`audio-switch${on ? ' on' : ''}${mid ? ' mid' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <SpeakerIcon />
      <span className="audio-track"><span className="audio-knob" /></span>
    </button>
  );
}

function IconButton({
  label,
  tone = 'plain',
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  tone?: 'plain' | 'female' | 'male' | 'human' | 'orange';
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`audio-icon-btn audio-icon-btn-${tone}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function AdminAudio() {
  const [params] = useSearchParams();
  const [rows, setRows] = useState<AudioGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState(params.get('status') ?? '');
  const [typeFilter, setTypeFilter] = useState<'' | AudioType>('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recordText, setRecordText] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'recording' | 'review' | 'uploading'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState('');
  const [recording, setRecording] = useState<{ blob: Blob; mime: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewRef = useRef<HTMLAudioElement | null>(null);
  const notice = useNotice();

  const load = async (
    nextPage = page,
    filters?: { q?: string; type?: '' | AudioType; status?: string },
  ) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('pageSize', String(pageSize));
      const nextQuery = filters?.q ?? query;
      const nextType = filters?.type ?? typeFilter;
      const nextStatus = filters?.status ?? status;
      if (nextStatus) params.set('status', nextStatus);
      if (nextType) params.set('type', nextType);
      if (nextQuery.trim()) params.set('q', nextQuery.trim());
      const data = await api.get<AudioList>(`/api/admin/audio?${params}`);
      setRows(data.items);
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [status, pageSize, typeFilter]);

  useEffect(() => {
    const generating = rows.some((row) =>
      [row.female, row.male].some((asset) => isGenerating(asset)),
    );
    if (!generating) return;
    const timer = setInterval(() => { load(); }, 4000);
    return () => clearInterval(timer);
  }, [rows, page, pageSize, status, typeFilter, query]);

  const search = () => {
    setPage(1);
    load(1);
  };

  const clearFilters = () => {
    setQuery('');
    setTypeFilter('');
    setStatus('');
    setPage(1);
    load(1, { q: '', type: '', status: '' });
  };

  const preview = (asset: AudioAsset | null) => {
    if (!asset) return;
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current = null;
    }
    const audio = new Audio(apiUrl(`/api/admin/audio/${asset.id}/stream`));
    previewRef.current = audio;
    audio.play().catch(() => notice.err('无法播放该音频'));
  };

  const systemAssets = (row: AudioGroup) => [row.female, row.male].filter((asset): asset is AudioAsset => !!asset);

  const missingVoices = (row: AudioGroup) => {
    const voices: Array<'female' | 'male'> = [];
    if (!isGenerating(row.female) && !isReady(row.female)) voices.push('female');
    if (!isGenerating(row.male) && !isReady(row.male)) voices.push('male');
    return voices;
  };

  const toggleSystem = async (row: AudioGroup) => {
    const assets = systemAssets(row);
    if (assets.length === 0) return;
    const next = !assets.every((asset) => asset.enabled);
    try {
      await Promise.all(
        assets.map((asset) => api.patch(`/api/admin/audio/${asset.id}`, { enabled: next })),
      );
      notice.ok(next ? '系统音已启用' : '系统音已停用');
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const toggleAsset = async (asset: AudioAsset | null) => {
    if (!asset) return;
    try {
      await api.patch(`/api/admin/audio/${asset.id}`, { enabled: !asset.enabled });
      notice.ok(`${VOICE_LABEL[asset.voice]}已${asset.enabled ? '停用' : '启用'}`);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const regenerateRow = async (row: AudioGroup) => {
    const voices = missingVoices(row);
    if (voices.length === 0) return;
    try {
      await api.post<{ queued: number }>('/api/admin/audio/regenerate', { text: row.text, voices });
      notice.ok(`已提交${voices.map((voice) => VOICE_LABEL[voice]).join('、')}生成`);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const regenerateAll = async () => {
    setBusy(true);
    try {
      const result = await api.post<{ texts: number; queued: number }>('/api/admin/audio/regenerate-all');
      notice.ok(`已提交 ${result.queued} 个生成任务`);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const cleanupRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl('');
    setRecording(null);
    setElapsed(0);
  };

  const openRecorder = (text: string) => {
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current = null;
    }
    cleanupRecording();
    setRecordText(text);
    setPhase('idle');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const mime = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mime });
        setRecording({ blob, mime });
        setBlobUrl(URL.createObjectURL(blob));
        setPhase('review');
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setElapsed(0);
      setPhase('recording');
      timerRef.current = setInterval(() => setElapsed((value) => value + 1), 1000);
    } catch (e) {
      notice.err(`无法使用麦克风：${(e as Error).message}`);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    recorderRef.current?.stop();
    recorderRef.current = null;
  };

  const saveRecording = async () => {
    if (!recordText || !recording) return;
    setPhase('uploading');
    try {
      const form = new FormData();
      form.append('text', recordText);
      form.append('voice', 'human');
      form.append('file', recording.blob, `recording.${recording.mime.includes('mp4') ? 'm4a' : 'webm'}`);
      await api.upload('/api/admin/audio/record', form);
      notice.ok('人声录音已保存并替换线上音频');
      cleanupRecording();
      setRecordText(null);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
      setPhase('review');
    }
  };

  const closeRecorder = () => {
    if (phase === 'recording') stopRecording();
    cleanupRecording();
    setRecordText(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminPage
      title="音频管理"
      actions={<Button onClick={regenerateAll} disabled={busy}>{busy ? '提交中…' : '补齐缺失音频'}</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar">
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="搜索越南语或中文释义"
          onKeyDown={(event) => { if (event.key === 'Enter') search(); }}
        />
        <Button onClick={search}>搜索</Button>
        <div className="admin-seg" role="group" aria-label="内容类型">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value || 'all'}
              type="button"
              className={`admin-seg-item${typeFilter === option.value ? ' on' : ''}`}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Select
          value={status}
          onChange={(value) => { setStatus(value); setPage(1); }}
          options={[
            { value: '', label: '全部状态' },
            { value: 'pending', label: '待生成' },
            { value: 'missing', label: '有缺失' },
            { value: 'generating', label: '生成中' },
            { value: 'failed', label: '失败' },
            { value: 'disabled', label: '已停用' },
          ]}
        />
        <Select
          value={String(pageSize)}
          onChange={(value) => { setPageSize(Number(value)); setPage(1); }}
          options={[{ value: '20', label: '20 条/页' }, { value: '50', label: '50 条/页' }, { value: '100', label: '100 条/页' }]}
        />
        <span className="muted" style={{ fontSize: 12.5 }}>共 {total} 条内容</span>
      </div>

      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table audio-table">
            <thead><tr><th>内容</th><th>系统音</th><th>人声</th></tr></thead>
            <tbody>
              {rows.map((row) => {
                const system = systemAssets(row);
                const allOn = system.length > 0 && system.every((asset) => asset.enabled);
                const mid = system.some((asset) => asset.enabled) && !allOn;
                const voices = missingVoices(row);
                const regenLabel = voices.length > 0
                  ? `补齐${voices.map((voice) => VOICE_LABEL[voice]).join('、')}`
                  : system.some((asset) => isGenerating(asset))
                    ? '系统音生成中'
                    : '女声与男声均已生成';

                return (
                  <tr key={row.text}>
                    <td>
                      <div className="audio-content">
                        <div className="vi audio-vi" title={row.text}>{row.text}</div>
                        <div className="audio-meaning">
                          {row.zh || '—'}
                          <span className={`audio-type-tag audio-type-${row.type}`}>{TYPE_LABEL[row.type]}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="audio-line">
                        <VoiceBadge voice="female" asset={row.female} />
                        <VoiceBadge voice="male" asset={row.male} />
                        <AudioSwitch
                          on={allOn}
                          mid={mid}
                          label={allOn ? '系统音已启用' : mid ? '系统音部分启用' : '系统音已停用'}
                          disabled={system.length === 0}
                          onClick={() => toggleSystem(row)}
                        />
                      </div>
                      <div className="audio-line audio-actions">
                        <IconButton
                          tone="female"
                          label={isPlayable(row.female) ? '试听女声' : '女声不可用'}
                          disabled={!isPlayable(row.female)}
                          onClick={() => preview(row.female)}
                        ><PlayIcon /></IconButton>
                        <IconButton
                          tone="male"
                          label={isPlayable(row.male) ? '试听男声' : '男声不可用'}
                          disabled={!isPlayable(row.male)}
                          onClick={() => preview(row.male)}
                        ><PlayIcon /></IconButton>
                        <IconButton
                          tone={voices.length > 0 ? 'orange' : 'plain'}
                          label={regenLabel}
                          disabled={voices.length === 0}
                          onClick={() => regenerateRow(row)}
                        ><RefreshIcon /></IconButton>
                      </div>
                    </td>
                    <td>
                      <div className="audio-line">
                        <VoiceBadge voice="human" asset={row.human} />
                        {row.human && (
                          <AudioSwitch
                            on={row.human.enabled}
                            label={row.human.enabled ? '人声已启用' : '人声已停用'}
                            onClick={() => toggleAsset(row.human)}
                          />
                        )}
                      </div>
                      <div className="audio-line audio-actions">
                        {row.human && (
                          <IconButton
                            tone="human"
                            label={isPlayable(row.human) ? '试听人声' : '人声不可用'}
                            disabled={!isPlayable(row.human)}
                            onClick={() => preview(row.human)}
                          ><PlayIcon /></IconButton>
                        )}
                        <IconButton
                          tone="human"
                          label={row.human ? '重新录制人声' : '录制人声'}
                          onClick={() => openRecorder(row.text)}
                        ><MicIcon /></IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="admin-empty">
                      <span>没有符合条件的音频</span>
                      <Button variant="ghost" onClick={clearFilters}>清除筛选</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-inline" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
        <Button onClick={() => { load(Math.max(1, page - 1)); }} disabled={page <= 1}>上一页</Button>
        <span className="muted" style={{ fontSize: 12.5 }}>第 {page} / {totalPages} 页</span>
        <Button onClick={() => { load(Math.min(totalPages, page + 1)); }} disabled={page >= totalPages}>下一页</Button>
      </div>

      {recordText !== null && (
        <Modal
          title="录音 · 人声"
          onClose={closeRecorder}
          footer={
            phase === 'review' || phase === 'uploading' ? (
              <>
                <Button onClick={closeRecorder} disabled={phase === 'uploading'}>取消</Button>
                <Button variant="primary" onClick={saveRecording} disabled={phase === 'uploading'}>
                  {phase === 'uploading' ? '保存中…' : '保存并替换'}
                </Button>
              </>
            ) : undefined
          }
        >
          <p className="vi" style={{ fontSize: 18, fontWeight: 800, marginTop: 0 }}>{recordText}</p>
          <div className="admin-recorder">
            <div className="admin-rec-time">{formatTime(elapsed)}</div>
            {phase === 'idle' && (
              <div className="admin-rec-actions">
                <Button variant="primary" onClick={startRecording}>开始录音</Button>
              </div>
            )}
            {phase === 'recording' && (
              <div className="admin-rec-actions">
                <Button variant="danger" onClick={stopRecording}>停止录音</Button>
              </div>
            )}
            {(phase === 'review' || phase === 'uploading') && blobUrl && (
              <>
                <audio src={blobUrl} controls style={{ width: '100%', marginTop: 8 }} />
                <div className="admin-rec-actions">
                  <Button onClick={() => { cleanupRecording(); setPhase('idle'); }} disabled={phase === 'uploading'}>重录</Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
