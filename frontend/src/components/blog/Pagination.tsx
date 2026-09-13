import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

/** Page numbers with gaps: 1 … 4 5 6 … 12 */
function pageItems(page: number, totalPages: number): (number | 'gap')[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= totalPages));
  const sorted = [...wanted].sort((a, b) => a - b);
  const items: (number | 'gap')[] = [];
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) items.push('gap');
    items.push(n);
  });
  return items;
}

const itemClass = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors';

export default function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link to={hrefFor(page - 1)} className={cx(itemClass, 'gap-1 bg-surface-muted hover:bg-surface-sunken')} rel="prev">
          <ChevronLeftIcon width={18} height={18} /> Previous
        </Link>
      ) : (
        <span className={cx(itemClass, 'gap-1 text-ink-subtle')} aria-disabled="true">
          <ChevronLeftIcon width={18} height={18} /> Previous
        </span>
      )}

      {pageItems(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-ink-subtle" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            to={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cx(itemClass, item === page ? 'bg-white text-onbrand' : 'hover:bg-surface-muted')}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link to={hrefFor(page + 1)} className={cx(itemClass, 'gap-1 bg-surface-muted hover:bg-surface-sunken')} rel="next">
          Next <ChevronRightIcon width={18} height={18} />
        </Link>
      ) : (
        <span className={cx(itemClass, 'gap-1 text-ink-subtle')} aria-disabled="true">
          Next <ChevronRightIcon width={18} height={18} />
        </span>
      )}
    </nav>
  );
}
