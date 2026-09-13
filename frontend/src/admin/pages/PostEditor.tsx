import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { ArrowLeftIcon, ExternalIcon, TrashIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError, isAbortError } from '@/lib/api';
import { formatDateTime, fromLocalInput, isFuture, toLocalInput } from '@/lib/format';
import { slugify } from '@/lib/slugify';
import type { Post, PostStatus } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { adminApi, adminPath, type PostInput } from '../adminApi';
import { useAuth, useSessionGuard } from '../AuthContext';
import { EmptyState, Notice, Panel, StatusPill } from '../components/AdminUi';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';
import MarkdownEditor from '../components/MarkdownEditor';

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  categoryId: string;
  publishedAt: string;
};

const emptyForm: FormState = { title: '', slug: '', excerpt: '', body: '', coverImage: null, categoryId: '', publishedAt: '' };

function toForm(post: Post): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    coverImage: post.coverImage,
    categoryId: String(post.categoryId),
    publishedAt: toLocalInput(post.publishedAt),
  };
}

type NoticeState = { tone: 'success' | 'error'; text: string } | null;

export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();
  const location = useLocation();
  const { markSignedOut } = useAuth();

  const categories = useAsync((signal) => adminApi.listCategories(signal), []);
  useSessionGuard(categories.error);

  const [post, setPost] = useState<Post | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'missing' | 'error'>(isNew ? 'ready' : 'loading');
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saved, setSaved] = useState<FormState>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<NoticeState>(null);
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useDocumentTitle(`${isNew ? 'New post' : 'Edit post'} · Admin`);

  // Messages handed over from a previous screen (e.g. "Post published." after creating).
  useEffect(() => {
    const message = (location.state as { notice?: string } | null)?.notice;
    if (message) {
      setNotice({ tone: 'success', text: message });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isNew) return;
    const controller = new AbortController();
    setLoadState('loading');
    adminApi
      .getPost(Number(id), controller.signal)
      .then((loaded) => {
        const loadedForm = toForm(loaded);
        setPost(loaded);
        setForm(loadedForm);
        setSaved(loadedForm);
        setSlugEdited(true);
        setLoadState('ready');
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        if (err instanceof ApiError && err.status === 401) return markSignedOut();
        if (err instanceof ApiError && err.status === 404) return setLoadState('missing');
        setLoadError(err instanceof ApiError ? err.message : 'This post could not be loaded.');
        setLoadState('error');
      });
    return () => controller.abort();
  }, [id, isNew, markSignedOut]);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const onTitleChange = (title: string) => {
    setForm((current) => ({ ...current, title, slug: slugEdited ? current.slug : slugify(title) }));
    setErrors((current) => ({ ...current, title: '' }));
  };

  const save = async (status: PostStatus) => {
    if (saving) return;
    setSaving(status);
    setErrors({});
    setNotice(null);

    const input: PostInput = {
      title: form.title,
      // An untouched slug is left to the server, which adds a suffix if it's already taken.
      slug: slugEdited ? slugify(form.slug) : '',
      excerpt: form.excerpt,
      body: form.body,
      coverImage: form.coverImage || null,
      status,
      publishedAt: fromLocalInput(form.publishedAt),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };

    try {
      const result = isNew ? await adminApi.createPost(input) : await adminApi.updatePost(Number(id), input);
      const wasPublished = post?.status === 'published';
      const message =
        status === 'draft'
          ? wasPublished
            ? 'Post unpublished and saved as a draft.'
            : 'Draft saved.'
          : isFuture(result.publishedAt)
            ? `Post scheduled for ${formatDateTime(result.publishedAt)}.`
            : wasPublished
              ? 'Changes published.'
              : 'Post published.';

      const resultForm = toForm(result);
      setPost(result);
      setForm(resultForm);
      setSaved(resultForm);
      setSlugEdited(true);

      if (isNew) {
        navigate(adminPath(`posts/${result.id}`), { replace: true, state: { notice: message } });
      } else {
        setNotice({ tone: 'success', text: message });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) return markSignedOut();
        setErrors(err.fields);
        setNotice({ tone: 'error', text: Object.keys(err.fields).length > 0 ? 'Please fix the highlighted fields.' : err.message });
      } else {
        setNotice({ tone: 'error', text: 'Something went wrong while saving.' });
      }
    } finally {
      setSaving(null);
    }
  };

  // Ctrl/Cmd + S saves without changing the post's status.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save(post?.status ?? 'draft');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const uploadInlineImage = async (file: File) => {
    try {
      return (await adminApi.uploadImage(file)).url;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) markSignedOut();
      throw err;
    }
  };

  const deletePost = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      await adminApi.deletePost(post.id);
      setSaved(form);
      navigate(adminPath('posts'), { state: { notice: `“${post.title}” was deleted.` } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return markSignedOut();
      setNotice({ tone: 'error', text: err instanceof ApiError ? err.message : 'The post could not be deleted.' });
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  if (loadState === 'loading') {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (loadState === 'missing') {
    return (
      <Panel>
        <EmptyState
          title="Post not found"
          text="It may have been deleted."
          action={
            <Button to={adminPath('posts')} variant="dark">
              Back to posts
            </Button>
          }
        />
      </Panel>
    );
  }

  if (loadState === 'error') return <Notice tone="error">{loadError}</Notice>;

  const isPublished = post?.status === 'published';
  const liveUrl = post && isPublished && !isFuture(post.publishedAt) ? `/blog/${post.slug}` : null;
  const willSchedule = isFuture(fromLocalInput(form.publishedAt));
  const categoryOptions = categories.data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={adminPath('posts')}
          onClick={(event) => {
            if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) event.preventDefault();
          }}
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeftIcon width={16} height={16} /> All posts
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          {post && <StatusPill status={post.status} publishedAt={post.publishedAt} />}
          {dirty ? <span className="font-medium text-ink">Unsaved changes</span> : post && <span>Saved {formatDateTime(post.updatedAt)}</span>}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-ink hover:underline">
              View on site <ExternalIcon width={14} height={14} />
            </a>
          )}
        </div>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{isNew ? 'New post' : 'Edit post'}</h1>

      {notice && (
        <Notice tone={notice.tone} onDismiss={() => setNotice(null)} className="mt-6">
          {notice.text}
        </Notice>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <Panel>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => onTitleChange(event.target.value)}
              error={errors.title}
              placeholder="A clear, specific headline"
              maxLength={200}
            />
            <TextField
              className="mt-5"
              label="URL slug"
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);
                setField('slug', event.target.value);
              }}
              onBlur={() => setField('slug', slugify(form.slug))}
              error={errors.slug}
              hint={`Web address: /blog/${slugify(form.slug) || 'your-post-title'}`}
              placeholder="generated-from-the-title"
            />
          </Panel>

          <Panel title="Content">
            <MarkdownEditor value={form.body} onChange={(body) => setField('body', body)} onUploadImage={uploadInlineImage} error={errors.body} />
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Publish">
            <TextField
              type="datetime-local"
              label="Publish date"
              optional
              value={form.publishedAt}
              onChange={(event) => setField('publishedAt', event.target.value)}
              error={errors.publishedAt}
              hint="Leave empty to publish now. Pick a future date to schedule."
            />
            <div className="mt-5 grid gap-2">
              {isPublished ? (
                <>
                  <Button variant="dark" onClick={() => void save('published')} disabled={saving !== null}>
                    {saving === 'published' && <Spinner label="Saving" />}
                    {willSchedule ? 'Update schedule' : 'Update post'}
                  </Button>
                  <Button variant="secondary" onClick={() => void save('draft')} disabled={saving !== null}>
                    {saving === 'draft' && <Spinner label="Saving" />}
                    Unpublish
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="dark" onClick={() => void save('published')} disabled={saving !== null}>
                    {saving === 'published' && <Spinner label="Publishing" />}
                    {willSchedule ? 'Schedule' : 'Publish'}
                  </Button>
                  <Button variant="secondary" onClick={() => void save('draft')} disabled={saving !== null}>
                    {saving === 'draft' && <Spinner label="Saving" />}
                    Save draft
                  </Button>
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-ink-muted">Press Ctrl + S (⌘ + S on Mac) to save at any time.</p>
          </Panel>

          <Panel title="Category">
            {categories.status === 'success' && categoryOptions.length === 0 ? (
              <p className="text-sm text-ink-muted">
                There are no categories yet.{' '}
                <Link to={adminPath('categories')} className="font-medium text-ink underline">
                  Create one first
                </Link>
                .
              </p>
            ) : (
              <SelectField label="Category" value={form.categoryId} onChange={(event) => setField('categoryId', event.target.value)} error={errors.categoryId}>
                <option value="">Choose a category</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </SelectField>
            )}
            <Link to={adminPath('categories')} className="mt-3 inline-block text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
              Manage categories
            </Link>
          </Panel>

          <Panel title="Cover image">
            <ImageUpload value={form.coverImage} onChange={(url) => setField('coverImage', url)} error={errors.coverImage} />
          </Panel>

          <Panel title="Excerpt">
            <TextAreaField
              label="Summary shown on blog cards"
              rows={4}
              maxLength={500}
              value={form.excerpt}
              onChange={(event) => setField('excerpt', event.target.value)}
              error={errors.excerpt}
              hint={`${form.excerpt.length}/500. Leave empty to use the start of the post.`}
            />
          </Panel>

          {post && (
            <Panel title="Danger zone">
              <Button variant="secondary" onClick={() => setConfirmingDelete(true)} className="text-red-400">
                <TrashIcon width={16} height={16} /> Delete post
              </Button>
            </Panel>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this post?"
        message={<>“{post?.title}” will be removed from the website straight away. This can’t be undone.</>}
        busy={deleting}
        onConfirm={deletePost}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
