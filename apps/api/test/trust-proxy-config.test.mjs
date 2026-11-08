import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// 回归测试：TRUST_PROXY=true 曾被 Number() 转成 NaN，
// Express 因此静默关闭了代理信任，req.ip 回退为代理地址，
// 所有用户共享每小时 10 次的注册额度，第 11 个用户开始被 429 拦截。
const ROOT = path.resolve(import.meta.dirname, '../../..');
const PORT = 9100 + Math.floor(Math.random() * 150);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'viet-trust-proxy-test-'));

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
    env: {
      ...process.env,
      DATA_DIR,
      PORT: String(PORT),
      ADMIN_PASSWORD: 'testpass123',
      TRUST_PROXY: 'true',
    },
    stdio: 'ignore',
  });
  await waitForServer();
});

test.after(() => {
  server?.kill('SIGTERM');
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

test('TRUST_PROXY=true 时注册限流仍按真实客户端 IP 计数', async () => {
  for (let i = 0; i < 11; i += 1) {
    const status = await register(`tpa${i}proxied`, `203.0.113.${i + 1}`);
    assert.equal(status, 201, `第 ${i + 1} 个不同 IP 的注册被限流拦截`);
  }
});

// TRUST_PROXY=true 曾被解析成跳数 1。多级代理链路（X-Forwarded-For: 客户端, CDN/边缘代理）
// 下 req.ip 只会取到最近一跳代理的地址，所有用户再次共享每小时 10 次的注册额度。
test('TRUST_PROXY=true 时多级代理链路仍按真实客户端 IP 计数', async () => {
  for (let i = 0; i < 11; i += 1) {
    const status = await register(`tpb${i}proxied`, `198.51.100.${i + 1}, 10.0.0.10`);
    assert.equal(status, 201, `第 ${i + 1} 个不同客户端（两级代理）的注册被限流拦截`);
  }
});
