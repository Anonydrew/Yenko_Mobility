import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/blog/Pagination';
import { InboxIcon, MailIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { cx } from '@/lib/cx';
import { formatDateTime } from '@/lib/format';
import type { ContactSubmission, ContactTopic } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { adminApi, adminPath } from '../adminApi';
import { useSessionGuard } from '../AuthContext';
import { AdminPageHeader, EmptyState, Notice, Panel } from '../components/AdminUi';

const topicLabels: Record<ContactTopic, string> = {
  general: 'General',
  support: 'Support',
  partnerships: 'Partnerships',
  careers: 'Careers',
  press: 'Press',
  waitlist: 'Waitlist',
};

export default function Submissions() {
  useDocumentTitle('Submissions · Admin');
  const [params] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const topic = params.get('topic') ?? '';

  const result = useAsync((signal) => adminApi.listSubmissions({ page, topic }, signal), [page, topic]);
  useSessionGuard(result.error);

  const items = result.data?.data ?? [];
  const meta = result.data?.meta;

  const hrefFor = (next: { page?: number; topic?: string }) => {
    const search = new URLSearchParams();
    const nextTopic = next.topic ?? topic;
    if (nextTopic) search.set('topic', nextTopic);
    if (next.page && next.page > 1) search.set('page', String(next.page));
    const text = search.toString();
    return adminPath(`submissions${text ? `?${text}` : ''}`);
  };

  return (
    <div>
      <AdminPageHeader
        title="Contact submissions"
        description={meta ? `${meta.total} ${meta.total === 1 ? 'message' : 'messages'}${topic ? ` in ${topicLabels[topic as ContactTopic] ?? topic}` : ''}` : 'Messages sent through the website.'}
      />

      <nav aria-label="Filter by topic" className="mt-6 overflow-x-auto pb-1">
        <ul className="flex gap-2 whitespace-nowrap">
          {[['', 'All'], ...Object.entries(topicLabels)].map(([value, label]) => (
            <li key={value || 'all'}>
              <Link
                to={value ? hrefFor({ topic: value, page: 1 }) : adminPath('submissions')}
                aria-current={topic === value ? 'page' : undefined}
                className={cx(
                  'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors',
                  topic === value ? 'bg-white text-onbrand' : 'bg-surface-sunken text-ink-muted hover:text-ink',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4">
        {result.status === 'loading' && items.length === 0 ? (
          <Panel>
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          </Panel>
        ) : result.status === 'error' ? (
          <Notice tone="error">{result.error.message}</Notice>
        ) : items.length === 0 ? (
          <Panel>
            <EmptyState icon={InboxIcon} title="No messages here" text={topic ? 'Nothing has been sent with this topic yet.' : 'Messages from the contact and waitlist forms will appear here.'} />
          </Panel>
        ) : (
          <ul className={cx('space-y-3', result.status === 'loading' && 'opacity-60')}>
            {items.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </ul>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={(n) => hrefFor({ page: n })} />
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission }: { submission: ContactSubmission }) {
  const [expanded, setExpanded] = useState(false);
  const long = submission.message.length > 320;
  const subject = encodeURIComponent('Re: your message to Yenko Mobility');

  return (
    <li className="rounded-2xl border border-line bg-surface-sunken p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium">{submission.name}</p>
          <a href={`mailto:${submission.email}`} className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            {submission.email}
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span className={cx('rounded-full px-2.5 py-1 font-medium', submission.topic === 'waitlist' ? 'bg-brand text-onbrand' : 'bg-surface-muted text-ink')}>
            {topicLabels[submission.topic] ?? submission.topic}
          </span>
          {submission.campus && <span className="rounded-full bg-surface-muted px-2.5 py-1">{submission.campus}</span>}
          <time dateTime={submission.createdAt}>{formatDateTime(submission.createdAt)}</time>
        </div>
      </div>

      {submission.message ? (
        <p className={cx('mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft', long && !expanded && 'line-clamp-4')}>{submission.message}</p>
      ) : (
        <p className="mt-4 text-sm text-ink-subtle">No message (waitlist sign-up).</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        {long && (
          <button type="button" onClick={() => setExpanded((value) => !value)} className="font-medium underline-offset-4 hover:underline">
            {expanded ? 'Show less' : 'Show full message'}
          </button>
        )}
        <a href={`mailto:${submission.email}?subject=${subject}`} className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline">
          <MailIcon width={16} height={16} /> Reply by email
        </a>
      </div>
    </li>
  );
}
