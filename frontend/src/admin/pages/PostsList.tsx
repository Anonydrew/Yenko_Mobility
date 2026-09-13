import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/blog/Pagination';
import Button from '@/components/ui/Button';
import { EyeIcon, FileTextIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { formatDate, isFuture } from '@/lib/format';
import type { PostSummary } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { adminApi, adminPath } from '../adminApi';
import { useAuth, useSessionGuard } from '../AuthContext';
import { AdminPageHeader, EmptyState, iconButton, Notice, Panel, StatusPill } from '../components/AdminUi';
import ConfirmDialog from '../components/ConfirmDialog';

const selectClass = 'h-10 rounded-xl border border-line bg-surface-sunken px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink';

export default function PostsList() {
  useDocumentTitle('Posts · Admin');
  const { markSignedOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  const page = Math.max(1, Number(params.get('page')) || 1);
  const status = params.get('status') ?? '';
  const category = params.get('category') ?? '';
  const q = params.get('q') ?? '';

  const [search, setSearch] = useState(q);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [toDelete, setToDelete] = useState<PostSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const posts = useAsync((signal) => adminApi.listPosts({ page, status, category, q }, signal), [page, status, category, q]);
  const categories = useAsync((signal) => adminApi.listCategories(signal), []);
  useSessionGuard(posts.error, categories.error);

  const updateParams = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  // Show a message passed from the editor (e.g. after deleting a post), then clear it from history.
  useEffect(() => {
    const message = (location.state as { notice?: string } | null)?.notice;
    if (message) {
      setNotice({ tone: 'success', text: message });
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location, navigate]);

  // Debounce the search box.
  useEffect(() => {
    if (search === q) return;
    const timer = window.setTimeout(() => updateParams({ q: search.trim(), page: '' }), 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminApi.deletePost(toDelete.id);
      setNotice({ tone: 'success', text: `“${toDelete.title}” was deleted.` });
      posts.reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) markSignedOut();
      setNotice({ tone: 'error', text: err instanceof ApiError ? err.message : 'The post could not be deleted.' });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const items = posts.data?.data ?? [];
  const meta = posts.data?.meta;
  const filtered = Boolean(status || category || q);

  const hrefFor = (n: number) => {
    const next = new URLSearchParams(params);
    if (n > 1) next.set('page', String(n));
    else next.delete('page');
    const text = next.toString();
    return adminPath(`posts${text ? `?${text}` : ''}`);
  };

  return (
    <div>
      <AdminPageHeader
        title="Posts"
        description={meta ? `${meta.total} ${meta.total === 1 ? 'post' : 'posts'}${filtered ? ' match your filters' : ''}` : 'Write and publish blog posts.'}
        actions={
          <Button to={adminPath('posts/new')} variant="dark">
            <PlusIcon width={18} height={18} /> New post
          </Button>
        }
      />

      {notice && (
        <Notice tone={notice.tone} onDismiss={() => setNotice(null)} className="mt-6">
          {notice.text}
        </Notice>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search posts</span>
          <SearchIcon width={18} height={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or excerpt"
            className="h-10 w-full rounded-xl border border-line bg-surface-sunken pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </label>
        <select aria-label="Filter by status" value={status} onChange={(event) => updateParams({ status: event.target.value, page: '' })} className={selectClass}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select aria-label="Filter by category" value={category} onChange={(event) => updateParams({ category: event.target.value, page: '' })} className={selectClass}>
          <option value="">All categories</option>
          {(categories.data ?? []).map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <Panel className="mt-4 overflow-hidden [&>div]:p-0">
        {posts.status === 'loading' && items.length === 0 ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-6 w-6" />
          </div>
        ) : posts.status === 'error' ? (
          <div className="p-5">
            <Notice tone="error">
              {posts.error.message}{' '}
              <button type="button" onClick={posts.reload} className="font-medium underline">
                Try again
              </button>
            </Notice>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={FileTextIcon}
            title={filtered ? 'No posts match these filters' : 'No posts yet'}
            text={filtered ? 'Try a different search or clear the filters.' : 'Write your first post to get the blog going.'}
            action={
              filtered ? (
                <Button variant="secondary" onClick={() => setParams({}, { replace: true })}>
                  Clear filters
                </Button>
              ) : (
                <Button to={adminPath('posts/new')} variant="dark">
                  New post
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Published
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Updated
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={posts.status === 'loading' ? 'opacity-60' : undefined}>
                {items.map((post) => {
                  const live = post.status === 'published' && !isFuture(post.publishedAt);
                  return (
                    <tr key={post.id} className="border-t border-line align-middle hover:bg-surface-muted/50">
                      <td className="max-w-md px-5 py-4">
                        <Link to={adminPath(`posts/${post.id}`)} className="font-medium hover:underline hover:underline-offset-4">
                          {post.title}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-ink-muted">/blog/{post.slug}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{post.category.name}</td>
                      <td className="px-5 py-4">
                        <StatusPill status={post.status} publishedAt={post.publishedAt} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-muted">{post.status === 'published' ? formatDate(post.publishedAt) : '—'}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-muted">{formatDate(post.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {live && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className={iconButton} aria-label={`View “${post.title}” on the website`} title="View on website">
                              <EyeIcon width={18} height={18} />
                            </a>
                          )}
                          <Link to={adminPath(`posts/${post.id}`)} className={iconButton} aria-label={`Edit “${post.title}”`} title="Edit">
                            <PencilIcon width={17} height={17} />
                          </Link>
                          <button type="button" onClick={() => setToDelete(post)} className={`${iconButton} hover:text-red-400`} aria-label={`Delete “${post.title}”`} title="Delete">
                            <TrashIcon width={17} height={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={hrefFor} />
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this post?"
        message={
          <>
            “{toDelete?.title}” will be removed from the website straight away. This can’t be undone.
          </>
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
