import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_POSITIONS, MAP_H, MAP_W, nodePosition, buildMountainPath } from './mapPositions.ts';

test('前八个单元沿用固定营地坐标', () => {
  for (let i = 0; i < BASE_POSITIONS.length; i += 1) {
    assert.deepEqual(nodePosition(i), BASE_POSITIONS[i]);
  }
});

// 回归：后台新增第 9 个单元后，原实现 POS[i] 为 undefined，解构时抛
// "undefined is not iterable"，导致整个课程地图白屏。
test('第 9 个及之后的单元也能得到画布内的有效坐标', () => {
  for (let i = BASE_POSITIONS.length; i < 40; i += 1) {
    const [x, y] = nodePosition(i);
    assert.ok(Number.isFinite(x) && x >= 0 && x <= MAP_W, `x 越界：${x}`);
    assert.ok(Number.isFinite(y) && y >= 0 && y <= MAP_H, `y 越界：${y}`);
  }
});

// 回归：管理员清空所有单元后，AdventureMap 原实现直接对 pts[0] 解引用，
// 抛 "Cannot read properties of undefined"，课程地图与首页白屏。
test('空坐标序列生成山道路径时不崩溃且返回空字符串', () => {
  assert.equal(buildMountainPath([]), '');
});

test('单个营地生成包含起点与冲顶段的合法路径', () => {
  const d = buildMountainPath([[300, 620]]);
  assert.ok(d.startsWith('M 300 620'), `路径应从起点开始：${d}`);
  assert.ok(d.includes('560 128'), `路径应以山顶冲顶结束：${d}`);
});

test('多个营地的路径包含所有营地坐标', () => {
  const positions = BASE_POSITIONS.slice(0, 3);
  const d = buildMountainPath(positions);
  for (const [x, y] of positions) {
    assert.ok(d.includes(`${x} ${y}`), `路径缺少营地 ${x},${y}：${d}`);
  }
});
