import { useEffect, useRef, useState } from 'react';
import { speak } from '../lib/speech';

const DEFAULT_TEXT = 'Tiếng Việt có sáu thanh điệu.';

export default function ShadowingRecorder() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);

  const supported =
    typeof MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const start = async () => {
    setError(null);
    if (!supported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecording(false);
      };
      rec.start();
      setRecording(true);
    } catch (err) {
      setRecording(false);
      const name = err instanceof DOMException ? err.name : '';
      setError(
        name === 'NotAllowedError' || name === 'SecurityError'
          ? '麦克风权限被拒绝：请在浏览器里允许本站使用麦克风后重试。'
          : name === 'NotFoundError'
            ? '没有找到可用的麦克风。'
            : '没能打开麦克风，请检查系统和浏览器设置。',
      );
    }
  };

  const stop = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
  };

  return (
    <section className="section">
      <div className="section-head">
        <h2>跟读录音</h2>
      </div>

      <div className="card">
        <div className="muted mb8" style={{ fontSize: 13, fontWeight: 700 }}>练习句子</div>
        <div className="flex gap12 wrap mb16">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="vi"
            style={{ flex: '1 1 280px', padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, background: 'var(--paper)' }}
          />
          <button type="button" className="btn btn-sm" onClick={() => { void speak(text, 0.78); }}>
            ▶ 听原音
          </button>
        </div>

        {!supported ? (
          <div className="tip-bar">
            <div>当前浏览器不支持录音，或页面不在安全环境（HTTPS / localhost）。可以先用「听原音」跟读。</div>
          </div>
        ) : (
          <div className="flex gap12 wrap" style={{ alignItems: 'center' }}>
            {recording ? (
              <button type="button" className="btn" style={{ background: 'var(--err)', color: '#FFFDF6' }} onClick={stop}>
                ■ 停止录音
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => { void start(); }}>
                {audioUrl ? '重新录音' : '● 开始录音'}
              </button>
            )}
            {recording && (
              <span className="chip chip-teal">
                <span className="sound-wave" style={{ width: 16, height: 14 }} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                录音中…
              </span>
            )}
            {audioUrl && !recording && <span className="chip chip-yellow">已录好，回放看看</span>}
          </div>
        )}

        {error && (
          <div className="tip-bar mt16" style={{ borderLeftColor: 'var(--err)' }}>
            <div>{error}</div>
          </div>
        )}

        {audioUrl && (
          <div className="mt16">
            <div className="muted mb8" style={{ fontSize: 13, fontWeight: 700 }}>我的录音</div>
            <audio controls src={audioUrl} style={{ width: '100%' }} />
          </div>
        )}

        <p className="muted mt16" style={{ fontSize: 13 }}>录音只留在本页内存里，刷新即丢弃，不会上传。</p>
      </div>
    </section>
  );
}
