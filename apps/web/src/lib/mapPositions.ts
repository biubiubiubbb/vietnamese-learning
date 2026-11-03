/**
 * 课程登山地图的布局计算。
 * 前八个单元沿用固定构图，新增单元沿山道继续向上延伸，
 * 避免单元数量变化时坐标数组越界。
 */

export const MAP_W = 1050;
export const MAP_H = 720;

/** 八个营地在山体上的固定坐标：沿折返山道自下而上 */
export const BASE_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [300, 620],
  [540, 605],
  [755, 560],
  [620, 505],
  [420, 450],
  [540, 395],
  [675, 335],
  [555, 255],
];

/** 第 index 个营地的坐标（从 0 开始），index 超出固定构图时沿山道向上追加。 */
export function nodePosition(index: number): readonly [number, number] {
  if (index < BASE_POSITIONS.length) return BASE_POSITIONS[index];
  const [lastX, lastY] = BASE_POSITIONS[BASE_POSITIONS.length - 1];
  const step = index - BASE_POSITIONS.length + 1;
  return [lastX + (step % 2 === 1 ? 80 : -80), Math.max(60, lastY - step * 55)];
}
