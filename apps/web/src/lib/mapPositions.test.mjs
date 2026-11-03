import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_POSITIONS, MAP_H, MAP_W, nodePosition } from './mapPositions.ts';

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
