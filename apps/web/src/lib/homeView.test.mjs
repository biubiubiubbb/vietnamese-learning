import test from 'node:test';
import assert from 'node:assert/strict';
import { selectCurrentUnit } from './homeView.ts';

function unit(id, lessonIds) {
  return { id, level: 'A1', order: 1, title: id, subtitle: '', lessonIds };
}

test('没有单元时返回 undefined（首页不再白屏）', () => {
  assert.equal(selectCurrentUnit([], 'l1-1'), undefined);
});

test('下一课所属单元已删除时回退到第一个单元', () => {
  const units = [unit('u1', ['l1-1']), unit('u2', ['l2-1'])];
  assert.equal(selectCurrentUnit(units, 'orphan-lesson')?.id, 'u1');
});

test('优先返回包含下一课的单元', () => {
  const units = [unit('u1', ['l1-1']), unit('u2', ['l2-1'])];
  assert.equal(selectCurrentUnit(units, 'l2-1')?.id, 'u2');
});
