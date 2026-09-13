import { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from '@/components/ui/Accordion';
import { SearchIcon } from '@/components/ui/icons';
import { faqGroups, type FaqGroup } from '@/content/faqs';

type FaqExplorerProps = {
  groups?: FaqGroup[];
  searchLabel?: string;
};

export default function FaqExplorer({ groups = faqGroups, searchLabel = 'Search questions' }: FaqExplorerProps) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();

  const results = groups
    .map((group) => ({
      ...group,
      faqs: needle ? group.faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(needle)) : group.faqs,
    }))
    .filter((group) => group.faqs.length > 0);

  return (
    <div>
      <label className="relative block max-w-xl">
        <span className="sr-only">{searchLabel}</span>
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search, e.g. “payment” or “parking”"
          className="h-14 w-full rounded-full border border-line bg-surface-sunken pl-14 pr-6 text-base placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink"
        />
      </label>

      {results.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-surface-muted p-8">
          <p className="text-lg font-medium">No questions match “{query}”.</p>
          <p className="mt-2 text-ink-muted">
            Try a different word, or{' '}
            <Link to="/contact?topic=support" className="text-ink underline underline-offset-4">
              ask our support team
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {results.map((group) => (
            <section key={group.id} id={group.id} className="grid gap-6 lg:grid-cols-12">
              <h2 className="text-display-md font-bold lg:col-span-4">{group.title}</h2>
              <div className="lg:col-span-8">
                <Accordion key={needle} items={group.faqs} defaultOpen={needle ? 0 : null} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
