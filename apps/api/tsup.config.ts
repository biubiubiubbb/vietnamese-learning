import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  // tsup 默认会去掉 `node:` 前缀，导致 node:sqlite 变成裸 `sqlite`，生产启动失败。
  removeNodeProtocol: false,
});
