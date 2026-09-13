import type { Icon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

export type Feature = { icon: Icon; title: string; text: string };

type FeatureGridProps = {
  features: Feature[];
  columns?: 2 | 3 | 4;
  cardTone?: 'muted' | 'white';
};

const columnClasses = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' };

export default function FeatureGrid({ features, columns = 3, cardTone = 'muted' }: FeatureGridProps) {
  return (
    <ul className={cx('grid gap-4 sm:grid-cols-2', columnClasses[columns])}>
      {features.map(({ icon: Icon, title, text }) => (
        <li key={title} className={cx('rounded-3xl p-7', cardTone === 'muted' ? 'bg-surface-muted' : 'bg-surface-sunken')}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-onbrand">
            <Icon width={22} height={22} />
          </span>
          <h3 className="mt-6 text-xl font-medium tracking-tight">{title}</h3>
          <p className="mt-2 text-ink-muted">{text}</p>
        </li>
      ))}
    </ul>
  );
}
