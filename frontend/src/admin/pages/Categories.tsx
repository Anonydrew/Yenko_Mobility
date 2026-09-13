import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { PencilIcon, PlusIcon, TagIcon, TrashIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { slugify } from '@/lib/slugify';
import type { Category } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { adminApi, adminPath, type CategoryInput } from '../adminApi';
import { useAuth, useSessionGuard } from '../AuthContext';
import { AdminPageHeader, EmptyState, iconButton, Notice, Panel } from '../components/AdminUi';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyInput: CategoryInput = { name: '', slug: '', description: '' };
const inlineInput = 'h-9 w-full rounded-lg border border-line bg-surface-sunken px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink';

export default function Categories() {
  useDocumentTitle('Categories · Admin');
  const { markSignedOut } = useAuth();
  const list = useAsync((signal) => adminApi.listCategories(signal), []);
  useSessionGuard(list.error);

  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const [newCategory, setNewCategory] = useState<CategoryInput>(emptyInput);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CategoryInput>(emptyInput);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleError = (err: unknown, setFields?: (fields: Record<string, string>) => void) => {
    if (err instanceof ApiError) {
      if (err.status === 401) return markSignedOut();
      if (setFields && Object.keys(err.fields).length > 0) return setFields(err.fields);
      setNotice({ tone: 'error', text: err.message });
    } else {
      setNotice({ tone: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setCreateErrors({});
    setNotice(null);
    try {
      const category = await adminApi.createCategory(newCategory);
      setNewCategory(emptyInput);
      setNotice({ tone: 'success', text: `Category “${category.name}” added.` });
      list.reload();
    } catch (err) {
      handleError(err, setCreateErrors);
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setDraft({ name: category.name, slug: category.slug, description: category.description ?? '' });
    setEditErrors({});
  };

  const saveEdit = async (category: Category) => {
    setSavingEdit(true);
    setEditErrors({});
    setNotice(null);
    try {
      const updated = await adminApi.updateCategory(category.id, { ...draft, slug: slugify(draft.slug) });
      setEditingId(null);
      setNotice({ tone: 'success', text: `Category “${updated.name}” updated.` });
      list.reload();
    } catch (err) {
      handleError(err, setEditErrors);
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setNotice(null);
    try {
      await adminApi.deleteCategory(toDelete.id);
      setNotice({ tone: 'success', text: `Category “${toDelete.name}” deleted.` });
      list.reload();
    } catch (err) {
      handleError(err);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const categories = list.data ?? [];

  return (
    <div>
      <AdminPageHeader title="Categories" description="Group posts so readers can browse by topic on the blog." />

      {notice && (
        <Notice tone={notice.tone} onDismiss={() => setNotice(null)} className="mt-6">
          {notice.text}
        </Notice>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Panel title="Add a category" className="self-start">
          <form noValidate onSubmit={create} className="space-y-4">
            <TextField
              label="Name"
              value={newCategory.name}
              onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })}
              error={createErrors.name}
              placeholder="e.g. Company News"
              maxLength={80}
            />
            <TextField
              label="Slug"
              optional
              value={newCategory.slug}
              onChange={(event) => setNewCategory({ ...newCategory, slug: event.target.value })}
              onBlur={() => setNewCategory((current) => ({ ...current, slug: slugify(current.slug) }))}
              error={createErrors.slug}
              placeholder={slugify(newCategory.name) || 'generated-from-the-name'}
              hint="Used in the web address: /blog/category/slug"
            />
            <TextField
              label="Description"
              optional
              value={newCategory.description}
              onChange={(event) => setNewCategory({ ...newCategory, description: event.target.value })}
              error={createErrors.description}
              placeholder="Shown at the top of the category page"
              maxLength={500}
            />
            <Button type="submit" variant="dark" className="w-full" disabled={creating}>
              {creating ? <Spinner label="Adding" /> : <PlusIcon width={18} height={18} />}
              Add category
            </Button>
          </form>
        </Panel>

        <Panel className="overflow-hidden [&>div]:p-0">
          {list.status === 'loading' && categories.length === 0 ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-6 w-6" />
            </div>
          ) : list.status === 'error' ? (
            <div className="p-5">
              <Notice tone="error">{list.error.message}</Notice>
            </div>
          ) : categories.length === 0 ? (
            <EmptyState icon={TagIcon} title="No categories yet" text="Add your first category using the form." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Description
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Posts
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) =>
                    editingId === category.id ? (
                      <tr key={category.id} className="border-t border-line bg-brand/10 align-top">
                        <td className="px-5 py-3">
                          <input aria-label="Name" className={inlineInput} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
                          {editErrors.name && <p className="mt-1 text-xs text-red-400">{editErrors.name}</p>}
                          <input aria-label="Slug" className={`${inlineInput} mt-2 font-mono text-xs`} value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
                          {editErrors.slug && <p className="mt-1 text-xs text-red-400">{editErrors.slug}</p>}
                        </td>
                        <td className="px-5 py-3">
                          <input
                            aria-label="Description"
                            className={inlineInput}
                            value={draft.description}
                            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                          />
                          {editErrors.description && <p className="mt-1 text-xs text-red-400">{editErrors.description}</p>}
                        </td>
                        <td className="px-5 py-3 text-ink-muted">{category.postCount ?? 0}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setEditingId(null)} disabled={savingEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" variant="dark" onClick={() => void saveEdit(category)} disabled={savingEdit}>
                              {savingEdit && <Spinner label="Saving" />}
                              Save
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={category.id} className="border-t border-line align-middle hover:bg-surface-muted/50">
                        <td className="px-5 py-4">
                          <p className="font-medium">{category.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-ink-muted">{category.slug}</p>
                        </td>
                        <td className="max-w-sm px-5 py-4 text-ink-soft">{category.description || <span className="text-ink-subtle">—</span>}</td>
                        <td className="px-5 py-4">
                          <Link to={`${adminPath('posts')}?category=${category.slug}`} className="text-ink underline-offset-4 hover:underline">
                            {category.postCount ?? 0}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => startEditing(category)} className={iconButton} aria-label={`Edit ${category.name}`} title="Edit">
                              <PencilIcon width={17} height={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setToDelete(category)}
                              className={`${iconButton} hover:text-red-400`}
                              aria-label={`Delete ${category.name}`}
                              title="Delete"
                            >
                              <TrashIcon width={17} height={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this category?"
        message={
          (toDelete?.postCount ?? 0) > 0 ? (
            <>
              “{toDelete?.name}” still has {toDelete?.postCount} {toDelete?.postCount === 1 ? 'post' : 'posts'}. Move them to another category first, or the
              deletion will be refused.
            </>
          ) : (
            <>“{toDelete?.name}” will be removed. This can’t be undone.</>
          )
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
