import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SENTENCES, sentenceById, sentencesOfLesson, exercisesOfLesson } from '../content/sentences';
import { vocabById } from '../content/vocab';
import { dueSentences } from '../lib/progress';
import { checkFill, normalizeAnswer } from '../lib/quiz';
import { useProgress } from './ProgressContext';
import SpeakButton, { type SpeakButtonHandle } from './SpeakButton';
import {
  CHUNK_ROLE_COLOR,
  CHUNK_ROLE_LABEL,
  SENTENCE_TAG_COLOR,
  SENTENCE_TAG_LABEL,
  type Sentence,
  type SentenceExercise,
  type SentenceTag,
} from '../content/types';

type Scope = 'lesson' | 'learned' | 'all';
type BlankEx = Extract<SentenceExercise, { type: 'blank' }>;
type OrderEx = Extract<SentenceExercise, { type: 'order' }>;
type TranslateEx = Extract<SentenceExercise, { type: 'translate' }>;

const ALL_TAGS = Object.keys(SENTENCE_TAG_LABEL) as SentenceTag[];

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

function ChunkLegend() {
  return (
    <div className="chunk-legend mt8">
      {(Object.keys(CHUNK_ROLE_LABEL) as Array<keyof typeof CHUNK_ROLE_LABEL>).map((r) => (
        <span key={r}>
          <i style={{ background: CHUNK_ROLE_COLOR[r] }} />
          {CHUNK_ROLE_LABEL[r]}
        </span>
      ))}
    </div>
  );
}

function SentenceCard({ s, showZh }: { s: Sentence; showZh: boolean }) {
  const { state } = useProgress();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const card = state.sentenceCards[s.id];
  const zhVisible = showZh || revealed;
  const chunk = selected === null ? null : s.chunks[selected];
  const hanViet = chunk?.vocabId ? vocabById.get(chunk.vocabId)?.hanViet : undefined;

  return (
    <div className="card sentence-card">
      <div className="flex spread gap8 wrap mb8">
        <div className="flex gap8">
          <span className="badge-num" style={{ minWidth: 28, height: 28, fontSize: 12 }}>{s.order}</span>
          <span className="chip" style={{ fontSize: 12 }}>
            <i className="tag-dot" style={{ background: SENTENCE_TAG_COLOR[s.tag] }} />
            {SENTENCE_TAG_LABEL[s.tag]}
          </span>
          {card && <span className="chip chip-teal" style={{ fontSize: 12 }}>复习 {card.box}/5 盒</span>}
        </div>
        <button type="button" className="btn btn-sm" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? '收起拆解' : '拆解'}
        </button>
      </div>

      <div
        className="flex gap8 wrap"
        style={{ alignItems: 'flex-start', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label={zhVisible ? '隐藏中文释义' : '显示中文释义'}
        onClick={() => setRevealed((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setRevealed((v) => !v);
          }
        }}
      >
        <span className="sentence-vi">{s.vi}</span>
        <SpeakButton text={s.vi} size={30} />
      </div>

      {zhVisible && <div className="mt8" style={{ fontSize: 15 }}>{s.zh}</div>}

      {open && (
        <div className="mt12 anim-pop">
          <div className="flex gap8 wrap">
            {s.chunks.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`sentence-chunk${selected === i ? ' on' : ''}`}
                style={{ borderBottomColor: CHUNK_ROLE_COLOR[c.role] }}
                aria-label={`词块 ${c.vi}，${CHUNK_ROLE_LABEL[c.role]}`}
                aria-pressed={selected === i}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                {c.vi}
              </button>
            ))}
          </div>
          {chunk && (
            <div className="chunk-panel mt8">
              <strong className="vi">{chunk.vi}</strong> — {chunk.zh} · {CHUNK_ROLE_LABEL[chunk.role]}
              {hanViet ? ` · 汉越：${hanViet}` : ''}
            </div>
          )}
          <ChunkLegend />
        </div>
      )}

      {s.note && (
        <div className="tip-bar mt12">
          <div>※ {s.note}</div>
        </div>
      )}
    </div>
  );
}

export function SentenceReview({ sentences, scope }: { sentences: Sentence[]; scope: Scope }) {
  const { state, gradeSentence } = useProgress();
  // 进入复习时冻结牌堆，避免评分后牌堆变动导致跳卡
  const [deck] = useState(() =>
    dueSentences(state, sentences.map((s) => s.id))
      .slice(0, 20)
      .map((id) => sentenceById.get(id))
      .filter((s): s is Sentence => Boolean(s)),
  );
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const speakRef = useRef<SpeakButtonHandle>(null);

  if (sentences.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 36 }}>
        <strong>这个筛选下没有可复习的句子</strong>
        <p className="muted mt8">换个范围或句型标签试试。</p>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>这批句子都复习完了</strong>
        <p className="muted mt8">
          {scope === 'all' ? '全部句子的复习计划都已排好，明天再来。' : '切换到「全部」范围，或去学新单元。'}
        </p>
      </div>
    );
  }

  if (idx >= deck.length) {
    return (
      <div className="card anim-pop" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <strong style={{ fontSize: 18 }}>本轮复习完成！</strong>
        <p className="muted mt8">共复习 {deck.length} 个句子。</p>
      </div>
    );
  }

  const s = deck[idx];

  const handleGrade = (g: 'again' | 'good') => {
    gradeSentence(s.id, g);
    setFlipped(false);
    setIdx(idx + 1);
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="flex spread mb16">
        <span className="chip">第 {idx + 1} / {deck.length} 张</span>
      </div>

      <div
        className="card"
        style={{ textAlign: 'center', padding: 40, cursor: 'pointer', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}
        onClick={() => speakRef.current?.toggle()}
        role="button"
        tabIndex={0}
        aria-label={`朗读句子 ${s.vi}`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setFlipped(!flipped);
          }
        }}
      >
        <div className="flex" style={{ justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="sentence-vi">{s.vi}</span>
          <SpeakButton ref={speakRef} text={s.vi} size={34} />
        </div>
        {flipped && (
          <div className="anim-pop">
            <div style={{ fontSize: 18, marginTop: 6 }}>{s.zh}</div>
            <div className="flex gap8 wrap mt12" style={{ justifyContent: 'center' }}>
              {s.chunks.map((c, i) => (
                <span
                  key={i}
                  className="chip"
                  style={{ fontSize: 12, borderBottom: `3px solid ${CHUNK_ROLE_COLOR[c.role]}` }}
                >
                  <span className="vi">{c.vi}</span> · {c.zh}
                </span>
              ))}
            </div>
            {s.note && <div className="tip-bar mt16" style={{ textAlign: 'left' }}><div>※ {s.note}</div></div>}
          </div>
        )}
      </div>

      <div className="flex gap16 mt16" style={{ justifyContent: 'center' }}>
        <button className="btn btn-review btn-review-miss" onClick={() => handleGrade('again')}>
          忘了
        </button>
        <button className="btn btn-review btn-review-show" onClick={() => setFlipped(true)} disabled={flipped}>
          显示答案
        </button>
        <button className="btn btn-review btn-review-ok" onClick={() => handleGrade('good')}>
          记住了 ✓
        </button>
      </div>
    </div>
  );
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
      <div className="sentence-vi mb8">{masked}</div>
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

export default function SentenceSection({ lessonId }: { lessonId: string }) {
  const { state } = useProgress();
  const [scope, setScope] = useState<Scope>('lesson');
  const [activeTags, setActiveTags] = useState<SentenceTag[]>([]);
  const [showZh, setShowZh] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const lessonSentences = useMemo(() => sentencesOfLesson(lessonId), [lessonId]);
  const exercises = useMemo(() => exercisesOfLesson(lessonId), [lessonId]);
  const sentenceOfExercise = useMemo(() => {
    const map = new Map<string, Sentence>();
    lessonSentences.forEach((s) => s.exercises.forEach((ex) => map.set(ex.id, s)));
    return map;
  }, [lessonSentences]);

  const scoped = useMemo(() => {
    if (scope === 'lesson') return lessonSentences;
    if (scope === 'learned') return SENTENCES.filter((s) => state.completedLessons.includes(s.lessonId));
    return SENTENCES;
  }, [scope, lessonSentences, state.completedLessons]);

  const filtered = useMemo(
    () => scoped.filter((s) => activeTags.length === 0 || activeTags.includes(s.tag)),
    [scoped, activeTags],
  );

  if (lessonSentences.length === 0) return null;

  const dueCount = Math.min(dueSentences(state, filtered.map((s) => s.id)).length, 20);
  const answeredCount = exercises.filter((ex) => answers[ex.id] !== undefined).length;
  const correctCount = Object.values(answers).filter(Boolean).length;

  const toggleTag = (t: SentenceTag) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <section className="section">
      <div className="section-head spread">
        <h2>句子 · {lessonSentences.length} 句</h2>
        <div className="flex gap8 wrap">
          <Link to="/review" className="btn btn-sm btn-yellow">
            复习（{dueCount}）→
          </Link>
          <button type="button" className="btn btn-sm" onClick={() => setShowZh(!showZh)} aria-pressed={showZh}>
            {showZh ? '隐藏中文对照' : '显示中文对照'}
          </button>
        </div>
      </div>

      <div className="flex gap8 wrap mb8">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>范围</span>
        {([
          ['lesson', '本课'],
          ['learned', '已学'],
          ['all', '全部'],
        ] as Array<[Scope, string]>).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tag-chip${scope === key ? ' tag-chip-on' : ''}`}
            aria-pressed={scope === key}
            onClick={() => setScope(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap8 wrap mb16">
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>句型</span>
        {ALL_TAGS.map((t) => {
          const on = activeTags.includes(t);
          return (
            <button
              key={t}
              type="button"
              className={`tag-chip${on ? ' tag-chip-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggleTag(t)}
            >
              <i className="tag-dot" style={{ background: SENTENCE_TAG_COLOR[t] }} />
              {SENTENCE_TAG_LABEL[t]}
            </button>
          );
        })}
        {activeTags.length > 0 && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setActiveTags([])}>清除</button>
        )}
      </div>

      {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 36 }}>
              <strong>这个筛选下没有句子</strong>
              <p className="muted mt8">换个范围或句型标签试试。</p>
            </div>
          ) : (
            <div className="stagger" style={{ display: 'grid', gap: 12 }}>
              {filtered.map((s) => <SentenceCard key={s.id} s={s} showZh={showZh} />)}
            </div>
          )}

          {exercises.length > 0 && (
            <section style={{ marginTop: 28 }}>
              <div className="section-head spread">
                <h2 style={{ fontSize: 20 }}>句子练习 · {exercises.length} 题</h2>
                <span className="chip">已答 {answeredCount}/{exercises.length}</span>
              </div>
              {exercises.map((ex) => {
                const sentence = sentenceOfExercise.get(ex.id);
                if (!sentence) return null;
                const onResult = (ok: boolean) => setAnswers((prev) => ({ ...prev, [ex.id]: ok }));
                if (ex.type === 'blank') return <BlankExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
                if (ex.type === 'order') return <OrderExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
                return <TranslateExercise key={ex.id} ex={ex} sentence={sentence} onResult={onResult} />;
              })}
              {answeredCount === exercises.length && (
                <div
                  className="card anim-pop"
                  style={{ textAlign: 'center', background: correctCount === exercises.length ? 'var(--ok-bg)' : 'var(--yellow-glow)' }}
                >
                  <div style={{ fontSize: 20, fontWeight: 800 }}>句子练习得分 {correctCount} / {exercises.length}</div>
                  <p className="muted mt8" style={{ fontSize: 14 }}>
                    {correctCount === exercises.length ? '句子结构已经很稳了。' : '回看拆解，再读一遍错句。'}
                  </p>
                </div>
              )}
            </section>
          )}
    </section>
  );
}
