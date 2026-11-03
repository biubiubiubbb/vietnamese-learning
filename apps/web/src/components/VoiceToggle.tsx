import { useEffect, useState } from 'react';
import {
  getPreferredVoice,
  setPreferredVoice,
  subscribeVoice,
  type VoiceGender,
} from '../lib/speech';

const OPTIONS: Array<{ value: VoiceGender; label: string }> = [
  { value: 'female', label: '女声' },
  { value: 'male', label: '男声' },
];

export default function VoiceToggle() {
  const [voice, setVoice] = useState<VoiceGender>(getPreferredVoice);

  useEffect(() => subscribeVoice(setVoice), []);

  return (
    <div className="voice-toggle" role="group" aria-label="朗读音色">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`tag-chip${voice === option.value ? ' tag-chip-on' : ''}`}
          aria-pressed={voice === option.value}
          onClick={() => setPreferredVoice(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
