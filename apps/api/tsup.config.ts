import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  // tsup 默认会去掉 `node:` 前缀，导致 node:sqlite 变成裸 `sqlite`，生产启动失败。
  removeNodeProtocol: false,
  // shared 内部使用无扩展名相对导入，必须一并打包，否则 `node dist/index.js` 无法解析
  noExternal: ['@viet/shared'],
});
