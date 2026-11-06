import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// 复现生产环境：API 部署在反向代理之后（Railway / Nginx），代理会通过
// X-Forwarded-For 传递真实客户端 IP。若服务端不信任代理，req.ip 恒为代理 IP，
// 注册限流（同一 IP 每小时 10 次）就会变成所有用户共享的全局额度。
const ROOT = path.resolve(import.meta.dirname, '../../..');
const PORT = 8700 + Math.floor(Math.random() * 150);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'viet-register-test-'));

let server;

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

async function register(username, clientIp) {
  const res = await fetch(`${BASE}/api/account/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': clientIp,
    },
    body: JSON.stringify({ username, password: 'Passw0rd123' }),
  });
  return res.status;
}

test.before(async () => {
  server = spawn(process.execPath, ['--import', 'tsx', 'src/index.ts'], {
    cwd: path.resolve(ROOT, 'apps/api'),
    env: { ...process.env, DATA_DIR, PORT: String(PORT), ADMIN_PASSWORD: 'testpass123' },
    stdio: 'ignore',
  });
  await waitForServer();
});

test.after(() => {
  server?.kill('SIGTERM');
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

test('代理之后的注册限流按真实客户端 IP 计数', async () => {
  // 11 个不同用户分别从不同真实 IP 注册，不应共用同一个限流额度。
  for (let i = 0; i < 11; i += 1) {
    const status = await register(`rla${i}proxied`, `203.0.113.${i + 1}`);
    assert.equal(status, 201, `第 ${i + 1} 个不同 IP 的注册被限流拦截`);
  }
});

test('同一真实客户端 IP 仍然保留每小时 10 次的注册上限', async () => {
  const clientIp = '198.51.100.77';
  for (let i = 0; i < 10; i += 1) {
    const status = await register(`rlb${i}sameip`, clientIp);
    assert.equal(status, 201, `同一 IP 的第 ${i + 1} 次注册应成功`);
  }
  const blocked = await register('rlbblockeduser', clientIp);
  assert.equal(blocked, 429, '同一 IP 超过 10 次注册时应返回 429');
});
