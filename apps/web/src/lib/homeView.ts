import type { Unit } from '@viet/shared/types';

/**
 * 首页「当前单元」：优先取包含下一课的单元，否则回退到第一个单元。
 * 后台可以清空（软删除）全部单元但仍有课程存在，此时必须返回 undefined，
 * 由调用方跳过单元区域，避免对 undefined 解引用导致首页白屏。
 */
export function selectCurrentUnit(units: Unit[], lessonId: string | undefined): Unit | undefined {
  if (!lessonId || units.length === 0) return undefined;
  return units.find((unit) => unit.lessonIds.includes(lessonId)) ?? units[0];
}
