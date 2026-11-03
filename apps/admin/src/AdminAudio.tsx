import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, apiUrl } from './api';
import {
  AdminPage,
  Banner,
  Button,
  Loading,
  Modal,
  Select,
  StatusChip,
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

interface AudioGroup {
  text: string;
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

function formatTime(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function AdminAudio() {
  const [params] = useSearchParams();
  const [rows, setRows] = useState<AudioGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState(params.get('status') ?? '');
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

  const load = async (nextPage = page) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('pageSize', String(pageSize));
      if (status) params.set('status', status);
      if (query.trim()) params.set('q', query.trim());
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

  useEffect(() => { load(1); }, [status, pageSize]);

  useEffect(() => {
    const generating = rows.some((row) =>
      [row.female, row.male].some((asset) => asset?.status === 'pending' || asset?.status === 'generating'),
    );
    if (!generating) return;
    const timer = setInterval(() => { load(); }, 4000);
    return () => clearInterval(timer);
  }, [rows, page, pageSize, status, query]);

  const search = () => {
    setPage(1);
    load(1);
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

  const regenerate = async (asset: AudioAsset | null) => {
    if (!asset) return;
    if (asset.voice === 'human') return;
    try {
      await api.post(`/api/admin/audio/${asset.id}/regenerate`);
      notice.ok(`已提交${VOICE_LABEL[asset.voice]}重新生成`);
      await load();
    } catch (e) {
      notice.err((e as Error).message);
    }
  };

  const toggleEnabled = async (asset: AudioAsset | null) => {
    if (!asset) return;
    try {
      await api.patch(`/api/admin/audio/${asset.id}`, { enabled: !asset.enabled });
      notice.ok(`${VOICE_LABEL[asset.voice]}已${asset.enabled ? '停用' : '启用'}`);
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

  const renderSystemCell = (asset: AudioAsset | null) => (
    <div>
      <div style={{ marginBottom: 5 }}>
        {asset ? <StatusChip status={asset.enabled ? asset.status : 'disabled'} /> : <span className="admin-status admin-status-pending">待生成</span>}
      </div>
      <div className="admin-row-actions">
        <Button onClick={() => preview(asset)} disabled={!asset?.enabled || asset?.status !== 'ready'}>试听</Button>
        <Button onClick={() => regenerate(asset)} disabled={!asset || asset.status === 'generating'}>重生成</Button>
        {asset && <Button variant={asset.enabled ? 'danger' : 'default'} onClick={() => toggleEnabled(asset)}>{asset.enabled ? '停用' : '启用'}</Button>}
      </div>
      {asset?.error && <div className="muted" style={{ fontSize: 11 }}>{asset.error}</div>}
    </div>
  );

  return (
    <AdminPage
      title="音频管理"
      actions={<Button onClick={regenerateAll} disabled={busy}>{busy ? '提交中…' : '补齐缺失音频'}</Button>}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}
      <div className="admin-toolbar">
        <TextInput value={query} onChange={setQuery} placeholder="搜索朗读文本" />
        <Button onClick={search}>搜索</Button>
        <Select
          value={status}
          onChange={(value) => { setStatus(value); setPage(1); }}
          options={[
            { value: '', label: '全部状态' },
            { value: 'ready', label: '已就绪' },
            { value: 'pending', label: '待生成' },
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
        <span className="muted" style={{ fontSize: 12.5 }}>共 {total} 条文本</span>
      </div>

      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table" style={{ minWidth: 900 }}>
            <thead><tr><th>文本</th><th>女声（系统）</th><th>男声（系统）</th><th>人声（录制）</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.text}>
                  <td className="vi" style={{ maxWidth: 260 }}>{row.text}</td>
                  <td>{renderSystemCell(row.female)}</td>
                  <td>{renderSystemCell(row.male)}</td>
                  <td>
                    <div style={{ marginBottom: 5 }}>
                      {row.human ? <StatusChip status={row.human.enabled ? 'ready' : 'disabled'} /> : <span className="admin-status admin-status-pending">未录制</span>}
                    </div>
                    <div className="admin-row-actions">
                      {row.human && <Button onClick={() => preview(row.human)} disabled={!row.human.enabled}>试听</Button>}
                      <Button onClick={() => openRecorder(row.text)}>{row.human ? '重录' : '录音'}</Button>
                      {row.human && <Button variant={row.human.enabled ? 'danger' : 'default'} onClick={() => toggleEnabled(row.human)}>{row.human.enabled ? '停用' : '启用'}</Button>}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4}><div className="admin-empty">没有符合条件的音频</div></td></tr>}
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
