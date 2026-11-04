import { api } from './api';

export interface CustomerUser {
  id: number;
  username: string;
  status: 'normal' | 'disabled';
  createdAt: number;
  lastLoginAt: number | null;
  lastStudyAt: number | null;
}

export interface CustomerListRow extends CustomerUser {
  completed: number;
  dueVocab: number;
  dueSentence: number;
}

export interface CustomerListResponse {
  users: CustomerListRow[];
  total: number;
  totalLessons: number;
  page: number;
  pageSize: number;
}

export interface UnitProgress {
  id: string;
  title: string;
  level: string;
  order: number;
  done: number;
  total: number;
  pct: number;
}

export interface CustomerDetail {
  user: CustomerUser;
  totalLessons: number;
  completedCount: number;
  completionRate: number;
  accuracy: number | null;
  dueVocab: number;
  dueSentence: number;
  units: UnitProgress[];
  completedLessons: Array<{
    lessonId: string;
    title: string;
    unitTitle: string;
    completedAt: number;
  }>;
  scores: Array<{
    lessonId: string;
    title: string;
    unitTitle: string;
    correct: number;
    total: number;
    rate: number;
    at: number;
  }>;
  cards: {
    vocab: { total: number; boxes: number[]; due: number };
    sentence: { total: number; boxes: number[]; due: number };
  };
}

export const customerApi = {
  list: (params: { q: string; status: string; page: number }) => {
    const search = new URLSearchParams();
    if (params.q) search.set('q', params.q);
    if (params.status) search.set('status', params.status);
    search.set('page', String(params.page));
    return api.get<CustomerListResponse>(`/api/admin/customers?${search.toString()}`);
  },
  detail: (id: string | number) => api.get<CustomerDetail>(`/api/admin/customers/${id}`),
  setStatus: (id: number, status: 'normal' | 'disabled') =>
    api.patch<{ ok: true; status: string }>(`/api/admin/customers/${id}`, { status }),
  resetPassword: (id: number, password: string, confirmPassword: string) =>
    api.post<{ ok: true }>(`/api/admin/customers/${id}/reset-password`, { password, confirmPassword }),
  remove: (id: number, username: string) =>
    api.del<{ ok: true }>(`/api/admin/customers/${id}`, { username }),
};

export function formatTime(value: number | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
