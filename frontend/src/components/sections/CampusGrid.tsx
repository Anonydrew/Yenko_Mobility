import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import { ArrowRightIcon } from '@/components/ui/icons';
import { campuses } from '@/content/locations';
import { cx } from '@/lib/cx';

type CampusGridProps = {
  cardTone?: 'muted' | 'white';
  excludeSlug?: string;
};

export default function CampusGrid({ cardTone = 'muted', excludeSlug }: CampusGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campuses
        .filter((campus) => campus.slug !== excludeSlug)
        .map((campus) => {
          const live = campus.status === 'live';
          return (
            <li key={campus.slug}>
              <Link
                to={`/locations/${campus.slug}`}
                className={cx(
                  'group flex h-full min-h-56 flex-col justify-between gap-10 rounded-4xl p-7 transition-colors',
                  cardTone === 'muted' ? 'bg-surface-muted hover:bg-surface-sunken' : 'bg-surface-sunken hover:bg-surface-sunken',
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <Badge tone={live ? 'brand' : cardTone === 'muted' ? 'white' : 'muted'}>{live ? 'Live now' : 'Coming soon'}</Badge>
                  <span className="text-sm text-ink-muted">{campus.city}</span>
                </div>
                <div>
                  <p className="text-display-md font-bold">{campus.shortName}</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <p className="text-sm text-ink-muted">{live ? `${campus.bikes} e-bikes · ${campus.zones} parking zones` : campus.since}</p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-onbrand transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon width={18} height={18} />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
