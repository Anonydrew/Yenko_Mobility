export type PostStatus = 'draft' | 'published';

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
};

export type PostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  status: PostStatus;
  publishedAt: string | null;
  categoryId: number;
  category: { id: number; name: string; slug: string };
  readingMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type Post = PostSummary & { body: string };

export type PageMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = { data: T[]; meta: PageMeta };

export type ContactTopic = 'general' | 'support' | 'partnerships' | 'careers' | 'press' | 'waitlist';

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  topic: ContactTopic;
  campus: string | null;
  message: string;
  createdAt: string;
};

export type AdminUser = {
  id: number;
  email: string;
  createdAt: string;
};
