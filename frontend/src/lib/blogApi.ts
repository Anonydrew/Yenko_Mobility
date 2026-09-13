import { api } from './api';
import type { Category, Paginated, Post, PostSummary } from './types';

export function listPosts(params: { page?: number; perPage?: number; category?: string }, signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set('page', String(params.page));
  if (params.perPage) query.set('perPage', String(params.perPage));
  if (params.category) query.set('category', params.category);
  const suffix = query.toString() ? `?${query}` : '';

  return api<Paginated<PostSummary>>(`/posts${suffix}`, { signal });
}

export function getPost(slug: string, signal?: AbortSignal) {
  return api<{ data: Post }>(`/posts/${encodeURIComponent(slug)}`, { signal }).then((response) => response.data);
}

export function listCategories(signal?: AbortSignal) {
  return api<{ data: Category[] }>('/categories', { signal }).then((response) => response.data);
}
