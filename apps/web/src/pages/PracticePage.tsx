import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VOCAB } from '../content/vocab';
import { SENTENCES } from '../content/sentences';
import { checkAnswer, stripTones } from '../lib/quiz';
import { speak } from '../lib/speech';

type Mode = 'listen-word' | 'listen-sentence' | 'dictation' | 'untoned' | 'translate';

const MODES: Array<{ key: Mode; label: string; group: '听力' | '拼写' }> = [
  { key: 'listen-word', label: '听词选义', group: '听力' },
  { key: 'listen-sentence', label: '听句选中文', group: '听力' },
  { key: 'dictation', label: '听写句子', group: '听力' },
  { key: 'untoned', label: '补全声调', group: '拼写' },
  { key: 'translate', label: '中译越', group: '拼写' },
];

type Question =
  | {
      kind: 'choice';
      audio: string;
      prompt: string;
      options: string[];
      answer: number;
    }
  | {
      kind: 'input';
      audio?: string;
      prompt: string;
      display?: string;
      sub?: string;
      answer: string;
      hint?: string;
      check: 'exact' | 'toneless';
    };

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sample<T>(items: T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}

function buildChoiceQuestions(mode: Mode): Question[] {
  const isSentence = mode === 'listen-sentence';
  const pool = isSentence
    ? SENTENCES.map((s) => ({ audio: s.vi, answer: s.zh }))
    : VOCAB.map((v) => ({ audio: v.vi, answer: v.zh }));
  return sample(pool, 10).map((item) => {
    const distractors = sample(pool.filter((x) => x.answer !== item.answer), 3).map((x) => x.answer);
    const options = shuffle([item.answer, ...distractors]);
    return {
      kind: 'choice',
      audio: item.audio,
      prompt: isSentence ? '听句子，选出中文意思' : '听读音，选出中文释义',
      options,
      answer: options.indexOf(item.answer),
    };
  });
}

function buildQuestions(mode: Mode): Question[] {
  if (mode === 'listen-word' || mode === 'listen-sentence') return buildChoiceQuestions(mode);

  if (mode === 'dictation') {
    return sample(SENTENCES, 5).map((s) => ({
      kind: 'input',
      audio: s.vi,
      prompt: '听写句子：把听到的越南语写下来',
      answer: s.vi,
      hint: s.zh,
      check: 'exact' as const,
    }));
  }

  if (mode === 'untoned') {
    return sample(VOCAB, 10).map((v) => ({
      kind: 'input',
      prompt: '补全声调：把下面这串字母写回带声调的越南语',
      display: stripTones(v.vi),
      sub: `意思：${v.zh}`,
      answer: v.vi,
      check: 'toneless' as const,
    }));
  }

  return sample(VOCAB, 10).map((v) => ({
    kind: 'input',
    prompt: '看中文，写出越南语',
    display: v.zh,
    answer: v.vi,
    check: 'exact' as const,
  }));
}

function PlayButton({ text, primary = false }: { text: string; primary?: boolean }) {
  return (
    <button
      type="button"
      className={`btn btn-sm${primary ? ' btn-primary' : ''}`}
      onClick={() => { void speak(text, 0.78); }}
    >
      ▶ 播放
    </button>
  );
}

function Runner({ mode, onRestart }: { mode: Mode; onRestart: () => void }) {
  const questions = useMemo(() => buildQuestions(mode), [mode]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [nearTone, setNearTone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (idx >= questions.length) {
    return (
      <div className="card anim-pop" style={{ textAlign: 'center', padding: 40, maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>本组得分 {score} / {questions.length}</div>
        <p className="muted mb16">
          {score === questions.length ? '全对！这组已经很稳了。' : '错题再听一遍原音，跟着读一次。'}
        </p>
        <div className="flex gap12" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onRestart}>再来一组</button>
          <Link to="/review" className="btn">去复习 →</Link>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  const submit = () => {
    if (submitted) return;
    if (q.kind === 'choice') {
      if (selected === null) return;
      if (selected === q.answer) setScore((s) => s + 1);
      setNearTone(false);
      setSubmitted(true);
      return;
    }
    if (!value.trim()) return;
    const ok = checkAnswer(value, q.answer, q.check);
    const near = q.check === 'toneless' && !ok && stripTones(value) === stripTones(q.answer);
    if (ok) setScore((s) => s + 1);
    setNearTone(near);
    setSubmitted(true);
  };

  const next = () => {
    setIdx((i) => i + 1);
    setSelected(null);
    setValue('');
    setSubmitted(false);
    setNearTone(false);
    setShowHint(false);
  };

  const choiceOk = q.kind === 'choice' && submitted && selected === q.answer;
  const inputOk = q.kind === 'input' && submitted && checkAnswer(value, q.answer, q.check);

  return (
    <div className="card" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="flex spread mb16">
        <span className="chip">第 {idx + 1} / {questions.length} 题</span>
        <span className="chip chip-teal">{score} 分</span>
      </div>

      <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>{q.prompt}</div>

      {q.kind === 'choice' ? (
        <>
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            <PlayButton text={q.audio} primary />
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = 'var(--card)';
              if (submitted && i === q.answer) bg = 'var(--ok-bg)';
              else if (submitted && i === selected) bg = 'var(--err-bg)';
              else if (selected === i) bg = 'var(--orange-soft)';
              return (
                <button
                  key={i}
                  type="button"
                  className="btn"
                  style={{ background: bg, justifyContent: 'flex-start', padding: '12px 18px' }}
                  disabled={submitted}
                  onClick={() => setSelected(i)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {q.display && (
            <div
              className={mode === 'translate' ? '' : 'vi'}
              style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', padding: '10px 0' }}
            >
              {q.display}
            </div>
          )}
          {q.sub && <div className="muted" style={{ textAlign: 'center', fontSize: 14 }}>{q.sub}</div>}
          {q.audio && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <PlayButton text={q.audio} primary />
            </div>
          )}
          <div className="flex gap12 wrap mb12">
            <input
              value={value}
              disabled={submitted}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { if (!submitted) submit(); else next(); } }}
              placeholder="输入越南语…"
              style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, flex: '1 1 240px', background: 'var(--card)', fontFamily: 'var(--font-vi)' }}
            />
            {q.hint && !submitted && (
              <button type="button" className="btn btn-sm" onClick={() => setShowHint(true)}>提示</button>
            )}
          </div>
          {showHint && q.hint && <p className="muted mb8" style={{ fontSize: 13 }}>提示：{q.hint}</p>}
        </>
      )}

      {submitted && (
        <div className="anim-pop mt16">
          <strong style={{ color: choiceOk || inputOk ? 'var(--ok)' : 'var(--err)' }}>
            {choiceOk || inputOk
              ? '✓ 答对了'
              : nearTone
                ? '✗ 字母对了，声调还没写对'
                : '✗ 再听一遍试试'}
          </strong>
          {!(choiceOk || inputOk) && (
            <p className="muted mt8" style={{ fontSize: 14 }}>
              正确答案：<span className="vi" style={{ fontWeight: 700 }}>{q.kind === 'choice' ? q.options[q.answer] : q.answer}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex gap12 mt16">
        {!submitted ? (
          <button
            className="btn btn-primary"
            disabled={q.kind === 'choice' ? selected === null : !value.trim()}
            onClick={submit}
          >
            提交
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            {isLast ? '看结果 →' : '下一题 →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  const [params] = useSearchParams();
  const paramMode = params.get('mode');
  const initialMode = MODES.find((m) => m.key === paramMode)?.key ?? 'listen-word';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [round, setRound] = useState(0);

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 34, marginBottom: 24 }}>练习</h1>

      <div className="flex gap8 wrap mb8">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>听力</span>
        {MODES.filter((m) => m.group === '听力').map((m) => (
          <button
            key={m.key}
            type="button"
            className={`tag-chip${mode === m.key ? ' tag-chip-on' : ''}`}
            aria-pressed={mode === m.key}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex gap8 wrap mb24">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>拼写</span>
        {MODES.filter((m) => m.group === '拼写').map((m) => (
          <button
            key={m.key}
            type="button"
            className={`tag-chip${mode === m.key ? ' tag-chip-on' : ''}`}
            aria-pressed={mode === m.key}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Runner key={`${mode}-${round}`} mode={mode} onRestart={() => setRound((r) => r + 1)} />
    </div>
  );
}
