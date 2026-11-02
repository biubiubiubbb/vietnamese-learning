import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { MouseEvent } from 'react';
import { speak, stopSpeaking, isSpeechSupported, pickVietnameseVoice } from '../lib/speech';

interface Props {
  text: string;
  size?: number;
  label?: string;
}

export interface SpeakButtonHandle {
  /** 开始朗读；若正在朗读则停止。供外层卡片点击复用同一套播放态。 */
  toggle: () => void;
}

const SpeakButton = forwardRef<SpeakButtonHandle, Props>(function SpeakButton(
  { text, size = 34, label },
  ref,
) {
  const [hasVoice, setHasVoice] = useState(true);
  const [playing, setPlaying] = useState(false);
  const tokenRef = useRef(0);

  useEffect(() => {
    const check = () => setHasVoice(isSpeechSupported() && pickVietnameseVoice() !== null);
    check();
    const t = setTimeout(check, 600);
    return () => clearTimeout(t);
  }, []);

  const start = async () => {
    const token = ++tokenRef.current;
    setPlaying(true);
    const started = performance.now();
    await speak(text);
    // 短词朗读很快结束，保证波浪至少可见一小段时间
    const elapsed = performance.now() - started;
    if (elapsed < 450) {
      await new Promise((resolve) => setTimeout(resolve, 450 - elapsed));
    }
    // 只有仍是最新一次点击才收起播放态，避免重播时状态错乱
    if (tokenRef.current === token) setPlaying(false);
  };

  const toggle = () => {
    if (playing) {
      tokenRef.current += 1;
      stopSpeaking();
      setPlaying(false);
      return;
    }
    void start();
  };

  useImperativeHandle(ref, () => ({ toggle }), [playing, text]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggle();
  };

  const supported = isSpeechSupported();
  const disabled = !supported;

  return (
    <button
      type="button"
      className={`speak-btn${playing ? ' playing' : ''}`}
      style={{ width: size, height: size }}
      disabled={disabled}
      title={
        !supported
          ? '当前浏览器不支持语音合成'
          : hasVoice
            ? playing
              ? `正在朗读：${text}`
              : `朗读：${text}`
            : `朗读：${text}（系统未安装越南语语音，可能读不准）`
      }
      aria-label={playing ? `停止朗读 ${text}` : `朗读 ${text}`}
      aria-pressed={playing}
      onClick={handleClick}
    >
      {playing ? (
        <span
          className="sound-wave"
          style={{ width: size * 0.52, height: size * 0.5 }}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
        </span>
      ) : (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
      {label ? <span className="speak-label">{label}</span> : null}
    </button>
  );
});

export default SpeakButton;
