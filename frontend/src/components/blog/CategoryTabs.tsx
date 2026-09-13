import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';
import type { Category } from '@/lib/types';

type CategoryTabsProps = {
  categories: Category[];
  activeSlug: string | null;
};

export default function CategoryTabs({ categories, activeSlug }: CategoryTabsProps) {
  const tabs = [
    { label: 'All stories', to: '/blog', slug: null as string | null, count: undefined as number | undefined },
    ...categories
      .filter((category) => (category.postCount ?? 0) > 0 || category.slug === activeSlug)
      .map((category) => ({ label: category.name, to: `/blog/category/${category.slug}`, slug: category.slug, count: category.postCount })),
  ];

  return (
    <nav aria-label="Blog categories" className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 whitespace-nowrap">
        {tabs.map((tab) => {
          const active = tab.slug === activeSlug;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
                  active ? 'bg-white text-onbrand' : 'bg-surface-muted text-ink hover:bg-surface-sunken',
                )}
              >
                {tab.label}
                {tab.count !== undefined && <span className={cx('text-xs', active ? 'text-onbrand/60' : 'text-ink-muted')}>{tab.count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
