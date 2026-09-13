import { ADMIN_PATH } from '@/config/site';
import { api } from '@/lib/api';
import type { PricingConfig } from '@/lib/pricing';
import type { AdminUser, Category, ContactSubmission, Paginated, Post, PostStatus, PostSummary } from '@/lib/types';

/** Absolute path inside the admin panel, e.g. adminPath('posts') → /login-yenkoadmin/posts */
export function adminPath(path = ''): string {
  return path ? `${ADMIN_PATH}/${path.replace(/^\//, '')}` : ADMIN_PATH;
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: PostStatus;
  publishedAt: string | null;
  categoryId: number | null;
};

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
};

export type UploadResult = { url: string; width: number; height: number; size: number; mimeType: string };

export type PricingMeta = { updatedAt: string | null; isDefault: boolean };
type PricingResponse = { data: PricingConfig; meta: PricingMeta };

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && !(key === 'page' && Number(value) <= 1)) search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

export const adminApi = {
  me: (signal?: AbortSignal) => api<{ data: AdminUser }>('/auth/me', { signal }).then((response) => response.data),
  login: (email: string, password: string) => api<{ data: AdminUser }>('/auth/login', { body: { email, password } }).then((response) => response.data),
  logout: () => api<void>('/auth/logout', { method: 'POST' }),

  listPosts: (params: { page?: number; status?: string; category?: string; q?: string }, signal?: AbortSignal) =>
    api<Paginated<PostSummary>>(`/admin/posts${query({ ...params, perPage: 15 })}`, { signal }),
  getPost: (id: number, signal?: AbortSignal) => api<{ data: Post }>(`/admin/posts/${id}`, { signal }).then((response) => response.data),
  createPost: (input: PostInput) => api<{ data: Post }>('/admin/posts', { body: input }).then((response) => response.data),
  updatePost: (id: number, input: PostInput) => api<{ data: Post }>(`/admin/posts/${id}`, { method: 'PUT', body: input }).then((response) => response.data),
  deletePost: (id: number) => api<void>(`/admin/posts/${id}`, { method: 'DELETE' }),

  listCategories: (signal?: AbortSignal) => api<{ data: Category[] }>('/admin/categories', { signal }).then((response) => response.data),
  createCategory: (input: CategoryInput) => api<{ data: Category }>('/admin/categories', { body: input }).then((response) => response.data),
  updateCategory: (id: number, input: CategoryInput) =>
    api<{ data: Category }>(`/admin/categories/${id}`, { method: 'PUT', body: input }).then((response) => response.data),
  deleteCategory: (id: number) => api<void>(`/admin/categories/${id}`, { method: 'DELETE' }),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api<{ data: UploadResult }>('/admin/uploads', { form }).then((response) => response.data);
  },

  listSubmissions: (params: { page?: number; topic?: string }, signal?: AbortSignal) =>
    api<Paginated<ContactSubmission>>(`/admin/contact-submissions${query(params)}`, { signal }),

  getPricing: (signal?: AbortSignal) => api<PricingResponse>('/admin/pricing', { signal }),
  savePricing: (data: PricingConfig) => api<PricingResponse>('/admin/pricing', { method: 'PUT', body: { data } }),
  resetPricing: () => api<PricingResponse>('/admin/pricing/reset', { method: 'POST' }),
};
