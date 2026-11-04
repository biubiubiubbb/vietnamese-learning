import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const PORT = 8300 + Math.floor(Math.random() * 200);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'viet-trash-test-'));

let server;
let cookie = '';

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`服务提前退出：${server.exitCode}`);
    try {
      const res = await fetch(`${BASE}/api/config`);
      if (res.ok) return;
    } catch {
      // 服务尚未就绪
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('服务启动超时');
}

async function api(method, url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) cookie = setCookies.map((item) => item.split(';')[0]).join('; ');
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } finally {
    if (data === undefined) data = text;
  }
  return { status: res.status, data };
}

test.before(async () => {
  server = spawn(process.execPath, ['--import', 'tsx', 'src/index.ts'], {
    cwd: path.resolve(ROOT, 'apps/api'),
    env: { ...process.env, DATA_DIR, PORT: String(PORT), ADMIN_PASSWORD: 'testpass123' },
    stdio: 'ignore',
  });
  await waitForServer();
  const login = await api('POST', '/api/auth/login', { username: 'admin', password: 'testpass123' });
  assert.equal(login.status, 200, '管理员登录失败');
});

test.after(() => {
  server?.kill('SIGTERM');
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

test('回收站恢复课程也必须校验所属单元，避免产生孤儿课程', async () => {
  assert.equal((await api('POST', '/api/admin/units', {
    id: 'zz-u1', level: 'A1', order: 9, title: '测试单元', subtitle: '',
  })).status, 201);
  assert.equal((await api('POST', '/api/admin/lessons', {
    id: 'zz-l1', unitId: 'zz-u1', order: 1, title: '测试课',
    goals: [], vocabIds: [], grammar: [], dialogues: [], exercises: [],
  })).status, 201);

  assert.equal((await api('DELETE', '/api/admin/lessons/zz-l1')).status, 200);
  assert.equal((await api('DELETE', '/api/admin/units/zz-u1')).status, 200);

  // 专属恢复接口会拒绝，回收站接口此前会绕过校验并成功恢复
  const dedicated = await api('POST', '/api/admin/lessons/zz-l1/restore');
  assert.equal(dedicated.status, 409);
  const fromTrash = await api('POST', '/api/admin/trash/lessons/zz-l1/restore');
  assert.equal(fromTrash.status, 409);
  assert.match(String(fromTrash.data.error), /单元/);

  // 先恢复单元后，回收站恢复课程应当成功，且内容没有孤儿课程
  assert.equal((await api('POST', '/api/admin/trash/units/zz-u1/restore')).status, 200);
  assert.equal((await api('POST', '/api/admin/trash/lessons/zz-l1/restore')).status, 200);

  const content = await api('GET', '/api/content');
  assert.equal(content.status, 200);
  const unitIds = new Set(content.data.units.map((unit) => unit.id));
  const lesson = content.data.lessons.find((item) => item.id === 'zz-l1');
  assert.ok(lesson, '课程应已恢复');
  assert.ok(unitIds.has(lesson.unitId), '恢复后的课程必须归属一个存在的单元');
});

test('回收站恢复句子也必须校验所属课程', async () => {
  const sentence = {
    id: 'zz-s1', lessonId: 'zz-l1', vi: 'Xin chào', zh: '你好', tag: 'greeting',
    chunks: [{ vi: 'Xin chào', zh: '你好', role: 'greeting' }], exercises: [], dialogues: [], vocabIds: [],
  };
  assert.equal((await api('POST', '/api/admin/sentences', sentence)).status, 201);
  assert.equal((await api('DELETE', '/api/admin/sentences/zz-s1')).status, 200);
  assert.equal((await api('DELETE', '/api/admin/lessons/zz-l1')).status, 200);

  const fromTrash = await api('POST', '/api/admin/trash/sentences/zz-s1/restore');
  assert.equal(fromTrash.status, 409);
  assert.match(String(fromTrash.data.error), /课程/);
});
