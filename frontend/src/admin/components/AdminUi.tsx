import type { ReactNode } from 'react';
import { AlertIcon, CheckIcon, CloseIcon, type Icon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { cx } from '@/lib/cx';
import { isFuture } from '@/lib/format';
import type { PostStatus } from '@/lib/types';

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, actions, className, children }: { title?: string; actions?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cx('rounded-2xl border border-line bg-surface-muted', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          {title && <h2 className="text-sm font-medium">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Notice({
  tone = 'success',
  children,
  onDismiss,
  className,
}: {
  tone?: 'success' | 'error';
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const success = tone === 'success';
  return (
    <div
      role={success ? 'status' : 'alert'}
      className={cx('flex items-start gap-3 rounded-2xl p-4 text-sm', success ? 'bg-brand/15 text-ink' : 'bg-red-500/10 text-red-300', className)}
    >
      {success ? <CheckIcon width={18} height={18} className="mt-0.5 shrink-0" /> : <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />}
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="rounded-md p-0.5 opacity-70 hover:opacity-100">
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export function EmptyState({ icon: StateIcon, title, text, action }: { icon?: Icon; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {StateIcon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted">
          <StateIcon width={22} height={22} />
        </span>
      )}
      <p className="mt-4 text-lg font-medium">{title}</p>
      {text && <p className="mt-1 max-w-sm text-ink-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatusPill({ status, publishedAt }: { status: PostStatus; publishedAt: string | null }) {
  const scheduled = status === 'published' && isFuture(publishedAt);
  const label = status === 'draft' ? 'Draft' : scheduled ? 'Scheduled' : 'Published';
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'draft' && 'bg-surface-sunken text-ink-muted',
        scheduled && 'bg-white text-onbrand',
        status === 'published' && !scheduled && 'bg-brand text-onbrand',
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', status === 'draft' ? 'bg-ink-subtle' : scheduled ? 'bg-onbrand' : 'bg-onbrand')} />
      {label}
    </span>
  );
}

export const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-40';
