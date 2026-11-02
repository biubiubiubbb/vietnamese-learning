import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { ALPHABET, TONES, CONSONANT_GROUPS, VOWEL_GROUPS, MINIMAL_PAIRS, TONE_RULES } from '../content/pronunciation';
import SpeakButton, { type SpeakButtonHandle } from '../components/SpeakButton';
import ShadowingRecorder from '../components/ShadowingRecorder';

/** 带发音的卡片：点卡片任意位置即可发音，右上角喇叭同步显示播放态。 */
function SpeakCard({
  title,
  text,
  padding = 16,
  titleSize = 20,
  children,
}: {
  title: string;
  text: string;
  padding?: number;
  titleSize?: number;
  children: ReactNode;
}) {
  const speakRef = useRef<SpeakButtonHandle>(null);
  const toggle = () => speakRef.current?.toggle();

  return (
    <div
      className="card word-card"
      style={{ padding }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="flex spread mb8">
        <span className="vi" style={{ fontWeight: 800, fontSize: titleSize }}>{title}</span>
        <SpeakButton ref={speakRef} text={text} size={28} />
      </div>
      {children}
    </div>
  );
}

export default function PronunciationPage() {
  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 34, marginBottom: 24 }}>发音中心</h1>

      {/* 六声调 */}
      <section className="section">
        <div className="section-head">
          <h2>六个声调</h2>
          <span className="chip chip-orange">核心</span>
        </div>
        <div className="card">
          <div style={{ display: 'grid', gap: 14 }}>
            {TONES.map((t) => (
              <div key={t.name} className="flex gap16 wrap" style={{ alignItems: 'center', padding: '12px 14px', background: 'var(--paper)', borderRadius: 12, border: 'var(--bd-thin)' }}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 800 }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{t.mark === '无符号' ? '无调号' : `调号 ${t.mark}`}</div>
                </div>
                <svg width="80" height="52" viewBox="0 0 70 52" style={{ flexShrink: 0, background: 'var(--card)', borderRadius: 8, border: 'var(--bd-thin)' }}>
                  <path d={t.contour} fill="none" stroke="var(--orange)" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 14 }}>{t.zhFeel}</div>
                  <div className="flex gap8 mt8">
                    <span className="vi" style={{ fontWeight: 800, fontSize: 18 }}>{t.example.vi}</span>
                    <span className="muted" style={{ fontSize: 14 }}>{t.example.zh}</span>
                  </div>
                </div>
                <SpeakButton text={t.example.vi} />
              </div>
            ))}
          </div>
          <div className="tip-bar mt16">
            <div>
              <strong>记忆钩子：</strong>ma（平·鬼）→ má（锐·妈妈）→ mà（玄·但是）→ mả（问·坟墓）→ mã（跌·马）→ mạ（重·秧苗）。同一个音节，六个调六个意思。
            </div>
          </div>
        </div>
      </section>

      {/* 29 字母 */}
      <section className="section">
        <div className="section-head">
          <h2>29 个字母</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {ALPHABET.map((a) => (
            <SpeakCard key={a.letter} title={a.letter} text={a.name} padding={14} titleSize={22}>
              <div className="muted" style={{ fontSize: 13 }}>
                <div>名称 <span className="vi">{a.name}</span> · {a.ipa}</div>
                <div>近似：{a.zhApprox}</div>
                {a.note && <div style={{ color: 'var(--orange-deep)', marginTop: 4 }}>※ {a.note}</div>}
              </div>
            </SpeakCard>
          ))}
        </div>
      </section>

      {/* 跟读录音 */}
      <ShadowingRecorder />

      {/* 易混音：声母、韵母与最小对立体合并 */}
      <section className="section">
        <div className="section-head">
          <h2>易混音</h2>
        </div>
        {[...CONSONANT_GROUPS, ...VOWEL_GROUPS].map((g) => (
          <div key={g.title} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>{g.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {g.items.map((s) => (
                <SpeakCard key={s.sound} title={s.sound} text={s.example.vi}>
                  <div style={{ fontSize: 14 }}>
                    <span className="muted">{s.ipa}</span> · {s.zhApprox}
                  </div>
                  <div className="mt8" style={{ fontSize: 14 }}>
                    <span className="vi" style={{ fontWeight: 700 }}>{s.example.vi}</span> — {s.example.zh}
                  </div>
                  {s.note && <div className="muted mt8" style={{ fontSize: 13, color: 'var(--orange-deep)' }}>※ {s.note}</div>}
                </SpeakCard>
              ))}
            </div>
          </div>
        ))}
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>最小对立体</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {MINIMAL_PAIRS.map((p, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="flex spread gap12" style={{ alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div className="vi" style={{ fontWeight: 800, fontSize: 20 }}>{p.pair[0]}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{p.zh[0]}</div>
                  </div>
                  <span className="muted">vs</span>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div className="vi" style={{ fontWeight: 800, fontSize: 20 }}>{p.pair[1]}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{p.zh[1]}</div>
                  </div>
                </div>
                <div className="flex spread mt12">
                  <span className="muted" style={{ fontSize: 13 }}>{p.point}</span>
                  <div className="flex gap8">
                    <SpeakButton text={p.pair[0]} size={28} />
                    <SpeakButton text={p.pair[1]} size={28} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 标调规则 */}
      <section className="section">
        <div className="section-head"><h2>标调规则</h2></div>
        <div style={{ display: 'grid', gap: 16 }}>
          {TONE_RULES.map((r) => (
            <div key={r.title} className="card">
              <h3 style={{ marginBottom: 8 }}>{r.title}</h3>
              <p>{r.body}</p>
              {r.examples && (
                <div className="flex gap12 wrap mt12">
                  {r.examples.map((ex, i) => (
                    <span key={i} className="chip chip-sky" style={{ fontSize: 14 }}>
                      <span className="vi" style={{ fontWeight: 700 }}>{ex.vi}</span> {ex.zh}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
