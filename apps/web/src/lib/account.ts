import { apiUrl } from './apiBase';
import type { ProgressState } from './progress';

export interface AccountUser {
  id: number;
  username: string;
  status: 'normal' | 'disabled';
  createdAt: number;
  lastLoginAt: number | null;
  lastStudyAt: number | null;
}

export class AccountError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    ...init,
    headers,
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new AccountError(response.status, data.error ?? `请求失败（${response.status}）`);
  }
  return data as T;
}

export const accountApi = {
  me: () => request<{ user: AccountUser }>('/api/account/me'),
  register: (username: string, password: string) =>
    request<{ user: AccountUser }>('/api/account/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<{ user: AccountUser }>('/api/account/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ ok: true }>('/api/account/logout', { method: 'POST' }),
  progress: () => request<ProgressState>('/api/account/progress'),
  completeLesson: (lessonId: string) =>
    request<{ ok: true }>('/api/account/progress/lesson', {
      method: 'POST',
      body: JSON.stringify({ lessonId }),
    }),
  saveScore: (lessonId: string, correct: number, total: number) =>
    request<{ ok: true }>('/api/account/progress/score', {
      method: 'POST',
      body: JSON.stringify({ lessonId, correct, total }),
    }),
  gradeCard: (kind: 'vocab' | 'sentence', itemId: string, grade: 'again' | 'good') =>
    request<{ ok: true; card: { box: number; due: number } }>('/api/account/progress/card', {
      method: 'POST',
      body: JSON.stringify({ kind, itemId, grade }),
    }),
  resetProgress: () => request<{ ok: true }>('/api/account/progress', { method: 'DELETE' }),
};

export function validateUsername(value: string): string | null {
  return /^[A-Za-z0-9_]{4,20}$/.test(value.trim())
    ? null
    : '用户名需 4–20 位，仅限字母、数字和下划线';
}

export function validatePassword(value: string): string | null {
  const password = value.trim();
  const ok = password.length >= 8 && password.length <= 64 && /[A-Za-z]/.test(password) && /\d/.test(password);
  return ok ? null : '密码需 8–64 位，且同时包含字母和数字';
}
