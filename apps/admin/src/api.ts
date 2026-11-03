export class UnauthorizedError extends Error {
  constructor() {
    super('未登录');
  }
}

/** API 基地址：开发时走 Vite 代理，独立部署时用 VITE_API_BASE 指向 API 域名。 */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');

export function apiUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${API_BASE}${url}`;
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(apiUrl(url), {
    credentials: 'include',
    ...init,
    headers,
  });
  if (response.status === 401) throw new UnauthorizedError();
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? `请求失败（${response.status}）`);
  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
  upload: <T>(url: string, form: FormData) =>
    request<T>(url, { method: 'POST', body: form }),
};
