import { useMemo, useState } from 'react';
import { exercisesOfLesson, sentencesOfLesson } from '../content/sentences';
import { checkFill, normalizeAnswer } from '../lib/quiz';
import { CHUNK_ROLE_COLOR, type Sentence, type SentenceExercise } from '../content/types';

type BlankEx = Extract<SentenceExercise, { type: 'blank' }>;
type OrderEx = Extract<SentenceExercise, { type: 'order' }>;
type TranslateEx = Extract<SentenceExercise, { type: 'translate' }>;

function shuffleBySeed(items: number[], seed: string): number[] {
  const arr = [...items];
  let n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = arr.length - 1; i > 0; i--) {
    n = (n * 1103515245 + 12345) % 2147483648;
    const j = n % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ExerciseShell({
  type,
  ok,
  submitted,
  children,
  explain,
}: {
  type: string;
  ok: boolean;
  submitted: boolean;
  children: React.ReactNode;
  explain?: string;
}) {
  return (
    <div className="card mb16" style={submitted ? { background: ok ? 'var(--ok-bg)' : 'var(--err-bg)' } : {}}>
      <div className="flex gap8 mb12">
        <span className="chip" style={{ fontSize: 12 }}>{type}</span>
      </div>
      {children}
      {submitted && (
        <div className="anim-pop mt8">
          <strong style={{ color: ok ? 'var(--ok)' : 'var(--err)' }}>{ok ? '✓ 答对了' : '✗ 再想想'}</strong>
          {explain && <p className="muted mt8" style={{ fontSize: 14 }}>{explain}</p>}
        </div>
      )}
    </div>
  );
}

function BlankExercise({ ex, sentence, onResult }: { ex: BlankEx; sentence: Sentence; onResult: (ok: boolean) => void }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const masked = sentence.chunks.map((c, i) => (i === ex.chunkIndex ? '___' : c.vi)).join(' ');
  const ok = submitted && checkFill(value, ex.answer, ex.accept);
  const submit = () => {
    setSubmitted(true);
    onResult(checkFill(value, ex.answer, ex.accept));
  };

  return (
    <ExerciseShell type="挖空" ok={ok} submitted={submitted} explain={ex.explain}>
      <div className="sentence-vi mb8" style={{ fontSize: 20 }}>{masked}</div>
      <div className="muted mb12" style={{ fontSize: 13 }}>{sentence.zh}</div>
      <div className="flex gap12 wrap mb12">
        <input
          value={value}
          disabled={submitted}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && value.trim() && !submitted) submit(); }}
          placeholder="填入缺失的词块…"
          style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, minWidth: 220, background: 'var(--card)' }}
        />
        {ex.hint && !submitted && (
          <button type="button" className="btn btn-sm" onClick={() => setHintShown(true)}>提示</button>
        )}
      </div>
      {hintShown && ex.hint && <p className="muted mb8" style={{ fontSize: 13 }}>提示：{ex.hint}</p>}
      {!submitted ? (
        <button type="button" className="btn btn-primary btn-sm" disabled={!value.trim()} onClick={submit}>提交</button>
      ) : (
        !ok && <p className="muted" style={{ fontSize: 13 }}>正确答案：{ex.answer}</p>
      )}
    </ExerciseShell>
  );
}

function OrderExercise({ ex, sentence, onResult }: { ex: OrderEx; sentence: Sentence; onResult: (ok: boolean) => void }) {
  const shuffled = useMemo(
    () => shuffleBySeed(sentence.chunks.map((_, i) => i), ex.id),
    [sentence.id, ex.id],
  );
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const correctVi = ex.answer.map((i) => sentence.chunks[i].vi).join(' ');
  const pickedVi = picked.map((i) => sentence.chunks[i].vi).join(' ');
  const ok = submitted && normalizeAnswer(pickedVi) === normalizeAnswer(correctVi);
  const submit = () => {
    setSubmitted(true);
    onResult(normalizeAnswer(pickedVi) === normalizeAnswer(correctVi));
  };

  return (
    <ExerciseShell type="词序" ok={ok} submitted={submitted} explain={ex.explain}>
      <div className="muted mb8" style={{ fontSize: 13 }}>{sentence.zh}</div>
      <div className="order-bank answer mb12">
        {picked.length === 0 && <span className="muted" style={{ fontSize: 13 }}>点击下方词块，按越南语语序排列</span>}
        {picked.map((i, pos) => (
          <button
            key={`${i}-${pos}`}
            type="button"
            className="sentence-chunk"
            style={{
              borderBottomColor: submitted && ex.answer[pos] !== i ? 'var(--err)' : CHUNK_ROLE_COLOR[sentence.chunks[i].role],
            }}
            disabled={submitted}
            onClick={() => setPicked(picked.filter((_, p) => p !== pos))}
          >
            {sentence.chunks[i].vi}
          </button>
        ))}
      </div>
      <div className="order-bank mb12">
        {shuffled.filter((i) => !picked.includes(i)).map((i) => (
          <button
            key={i}
            type="button"
            className="sentence-chunk"
            style={{ borderBottomColor: CHUNK_ROLE_COLOR[sentence.chunks[i].role] }}
            disabled={submitted}
            onClick={() => setPicked([...picked, i])}
          >
            {sentence.chunks[i].vi}
          </button>
        ))}
        {picked.length === sentence.chunks.length && <span className="muted" style={{ fontSize: 13 }}>词块已用完，点上方词块可移除</span>}
      </div>
      {!submitted ? (
        <button type="button" className="btn btn-primary btn-sm" disabled={picked.length === 0} onClick={submit}>提交</button>
      ) : (
        !ok && <p className="muted" style={{ fontSize: 13 }}>正确语序：{correctVi}</p>
      )}
    </ExerciseShell>
  );
}

function TranslateExercise({ ex, sentence, onResult }: { ex: TranslateEx; sentence: Sentence; onResult: (ok: boolean) => void }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const ok = submitted && checkFill(value, ex.answer, ex.accept);
  const submit = () => {
    setSubmitted(true);
    onResult(checkFill(value, ex.answer, ex.accept));
  };

  return (
    <ExerciseShell type="中译越" ok={ok} submitted={submitted} explain={ex.explain}>
      <div className="mb8" style={{ fontSize: 16, fontWeight: 700 }}>{sentence.zh}</div>
      <div className="muted mb12" style={{ fontSize: 13 }}>把这句话写成越南语</div>
      <div className="flex gap12 wrap mb12">
        <input
          value={value}
          disabled={submitted}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && value.trim() && !submitted) submit(); }}
          placeholder="输入越南语…"
          style={{ padding: '10px 14px', border: 'var(--bd-thin)', borderRadius: 10, minWidth: 260, flex: '1 1 260px', background: 'var(--card)' }}
        />
        {!submitted && (
          <button type="button" className="btn btn-sm" onClick={() => setHintShown(true)}>提示</button>
        )}
      </div>
      {hintShown && (
        <p className="muted mb8" style={{ fontSize: 13 }}>
          词块银行：{sentence.chunks.map((c) => c.vi).join(' / ')}
        </p>
      )}
      {!submitted ? (
        <button type="button" className="btn btn-primary btn-sm" disabled={!value.trim()} onClick={submit}>提交</button>
      ) : (
        !ok && <p className="muted" style={{ fontSize: 13 }}>参考答案：{ex.answer}</p>
      )}
    </ExerciseShell>
  );
}

export default function SentencePractice({
  lessonId,
  onAnswer,
}: {
  lessonId: string;
  onAnswer: (exId: string, ok: boolean) => void;
}) {
  const exercises = useMemo(() => exercisesOfLesson(lessonId), [lessonId]);
  const sentenceOfExercise = useMemo(() => {
    const map = new Map<string, Sentence>();
    sentencesOfLesson(lessonId).forEach((s) => s.exercises.forEach((ex) => map.set(ex.id, s)));
    return map;
  }, [lessonId]);

  return (
    <>
      {exercises.map((ex) => {
        const sentence = sentenceOfExercise.get(ex.id);
        if (!sentence) return null;
        const onResult = (ok: boolean) => onAnswer(ex.id, ok);
        if (ex.type === 'blank') return <BlankExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
        if (ex.type === 'order') return <OrderExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
        return <TranslateExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
      })}
    </>
  );
}
