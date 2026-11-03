import { Link } from 'react-router-dom';
import { UNITS, unitProgress } from '../content/curriculum';
import { MAP_W, MAP_H, nodePosition } from '../lib/mapPositions';
import { useProgress } from './ProgressContext';

/**
 * 课程登山地图：从山脚营地出发，沿 Z 字形山道爬向山顶。
 * 每个单元是一个营地；桌面按山势排布，窄屏退化为单列竖路径。
 */

/** 岛屿图标：每单元一个宫崎骏式小物（粗描边手绘 SVG） */
function IslandIcon({ unitId, color }: { unitId: string; color: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (unitId) {
    case 'a1-u1': // 发音：音符泡泡
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <circle cx="14" cy="27" r="5" {...s} fill={color} fillOpacity="0.25" />
          <path d="M19 27 V10 L30 8 V22" {...s} />
          <circle cx="30" cy="22" r="4" {...s} fill={color} fillOpacity="0.25" />
          <circle cx="9" cy="11" r="2.4" {...s} />
        </svg>
      );
    case 'a1-u2': // 问候：对话气泡
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M8 8 H26 V20 H15 L10 25 V20 H8 Z" {...s} fill={color} fillOpacity="0.25" />
          <path d="M20 14 H32 V24 H29 V28 L25 24 H20" {...s} />
        </svg>
      );
    case 'a1-u3': // 数字时间：怀表
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <circle cx="20" cy="23" r="11" {...s} fill={color} fillOpacity="0.25" />
          <path d="M20 16 V23 L25 26" {...s} />
          <path d="M16 8 H24 M20 8 V12" {...s} />
        </svg>
      );
    case 'a1-u4': // 家庭：小屋
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M7 19 L20 8 L33 19" {...s} />
          <path d="M10 18 V31 H30 V18" {...s} fill={color} fillOpacity="0.25" />
          <rect x="17" y="23" width="6" height="8" {...s} />
        </svg>
      );
    case 'a2-u5': // 购物：菜篮
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M9 18 H31 L28 32 H12 Z" {...s} fill={color} fillOpacity="0.25" />
          <path d="M14 18 C14 12 18 8 20 8 C22 8 26 12 26 18" {...s} />
          <path d="M16 23 V28 M20 23 V29 M24 23 V28" {...s} />
        </svg>
      );
    case 'a2-u6': // 饮食：咖啡杯
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M10 16 H27 V28 C27 31 24 33 21 33 H16 C13 33 10 31 10 28 Z" {...s} fill={color} fillOpacity="0.25" />
          <path d="M27 18 H30 C33 18 33 24 27 24" {...s} />
          <path d="M14 12 C14 10 16 10 16 8 M20 12 C20 10 22 10 22 8" {...s} />
        </svg>
      );
    case 'a2-u7': // 出行：路牌
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M20 8 V34" {...s} />
          <path d="M20 11 H32 L35 14 L32 17 H20" {...s} fill={color} fillOpacity="0.25" />
          <path d="M20 20 H9 L6 23 L9 26 H20" {...s} fill={color} fillOpacity="0.25" />
        </svg>
      );
    default: // a2-u8 计划：纸飞机
      return (
        <svg viewBox="0 0 40 40" width="34" height="34" style={{ color }}>
          <path d="M6 20 L34 8 L24 34 L19 23 Z" {...s} fill={color} fillOpacity="0.25" />
          <path d="M19 23 L34 8" {...s} />
        </svg>
      );
  }
}

type NodeState = 'done' | 'current' | 'locked';

const STATE_COLOR: Record<NodeState, string> = {
  done: 'var(--ok)',
  current: 'var(--orange)',
  locked: 'var(--ink-soft)',
};

export default function AdventureMap() {
  const { state } = useProgress();

  const nodes = UNITS.map((u, i) => {
    const { done, total } = unitProgress(u, state.completedLessons);
    const st: NodeState = done === total ? 'done' : done > 0 || i === 0 || unitProgress(UNITS[i - 1], state.completedLessons).done === UNITS[i - 1].lessonIds.length ? 'current' : 'locked';
    const [x, y] = nodePosition(i);
    return { unit: u, done, total, st, x, y, i };
  });

  // 山道：沿山体折返向上，最后一段从最高营地冲顶
  const pts = nodes.map((n) => [n.x, n.y] as const);
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const dir = x1 >= x0 ? 1 : -1;
    const bend = Math.abs(x1 - x0) > 260 ? 70 : 45;
    pathD += ` C ${x0 + dir * bend} ${y0}, ${x1 - dir * bend} ${y1}, ${x1} ${y1}`;
  }
  const [lastX, lastY] = pts[pts.length - 1];
  pathD += ` C ${lastX - 20} ${lastY - 40}, 560 165, 560 128`;

  return (
    <div className="adventure-map" role="list" aria-label="课程登山地图">
      <svg className="map-svg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
        <defs>
          <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
          </filter>
          <linearGradient id="peak-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EDF2DF" />
            <stop offset="100%" stopColor="#D5E2C1" />
          </linearGradient>
        </defs>

        {/* 远山 */}
        <path
          d="M0 620 C 140 540 260 570 380 500 C 480 445 560 470 660 420 C 780 360 900 420 1050 520 L 1050 720 L 0 720 Z"
          fill="#E8EEDB"
        />
        {/* 主山体 */}
        <path
          d="M70 720 C 150 650 240 560 300 480 C 360 390 430 300 500 200 C 525 165 545 135 560 118 C 575 135 595 165 620 200 C 690 300 760 390 820 480 C 880 560 950 640 1030 720 Z"
          fill="url(#peak-face)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* 背光坡面 */}
        <path
          d="M560 118 C 575 135 595 165 620 200 C 690 300 760 390 820 480 C 880 560 950 640 1030 720 L 560 720 Z"
          fill="rgba(46,31,18,0.055)"
        />
        {/* 雪顶 */}
        <path
          d="M496 228 C 516 192 536 158 560 118 C 584 158 604 192 624 228 L 606 214 L 590 232 L 574 214 L 558 232 L 542 214 L 526 232 L 510 216 Z"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* 等高线 */}
        <g fill="none" stroke="rgba(46,31,18,0.15)" strokeWidth="1.6" strokeDasharray="5 7">
          <path d="M155 655 C 260 600 380 575 520 578 C 680 582 830 610 960 660" />
          <path d="M250 530 C 350 490 450 472 560 474 C 670 476 770 496 860 540" />
          <path d="M338 420 C 420 388 490 376 560 378 C 630 380 700 394 770 420" />
          <path d="M420 312 C 480 288 522 280 560 282 C 600 284 650 296 700 314" />
        </g>
        {/* 山脚松树 */}
        <g stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M92 700 l15 -34 l15 34 z" fill="#8FBF72" />
          <path d="M120 704 l12 -26 l12 26 z" fill="#BCD89A" />
          <path d="M935 706 l16 -36 l16 36 z" fill="#8FBF72" />
          <path d="M968 710 l13 -28 l13 28 z" fill="#BCD89A" />
        </g>
        {/* 山顶旗 */}
        <g>
          <path d="M560 120 V84" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <path d="M560 86 H596 L584 97 L596 108 H560 Z" fill="var(--orange)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
        {/* 山道 */}
        <path d={pathD} fill="none" stroke="var(--card)" strokeWidth="9" strokeLinecap="round" opacity="0.8" />
        <path d={pathD} fill="none" stroke="var(--ink-soft)" strokeWidth="3.5"
          strokeDasharray="1 13" strokeLinecap="round" opacity="0.75" filter="url(#pencil)" />
      </svg>

      {nodes.map(({ unit, done, total, st, x, y, i }) => (
        <Link
          key={unit.id}
          to={`/unit/${unit.id}`}
          role="listitem"
          className={`map-node node-${st}`}
          style={{ left: (x / MAP_W) * 100 + '%', top: (y / MAP_H) * 100 + '%', animationDelay: `${i * 90}ms` }}
          aria-label={`单元${unit.order} ${unit.title}，${done}/${total} 课`}
        >
          {st === 'current' && (
            <svg className="map-flag" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 22 V3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M6 4 H19 L15 8 L19 12 H6 Z" fill="var(--orange)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          )}
          <span className="map-island">
            <IslandIcon unitId={unit.id} color={STATE_COLOR[st]} />
            {st === 'done' && <span className="map-check" aria-hidden="true">✓</span>}
          </span>
          <span className="map-label">
            <span className="map-label-title">{unit.title}</span>
            <span className="map-label-sub">{unit.level} · {done}/{total} 课</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
