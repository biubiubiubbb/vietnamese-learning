/** API 基地址：开发时走 Vite 代理，独立部署时用 VITE_API_BASE 指向 API 域名。 */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');

export function apiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE}${path}`;
}
