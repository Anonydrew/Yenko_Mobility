import { cx } from '@/lib/cx';

export type Step = { title: string; text: string };

type StepsProps = {
  steps: Step[];
  columns?: 2 | 3 | 4;
  cardTone?: 'muted' | 'white';
};

const columnClasses = { 2: '', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' };

export default function Steps({ steps, columns = 4, cardTone = 'muted' }: StepsProps) {
  return (
    <ol className={cx('grid gap-4 sm:grid-cols-2', columnClasses[columns])}>
      {steps.map((step, index) => (
        <li key={step.title} className={cx('flex flex-col rounded-3xl p-7', cardTone === 'muted' ? 'bg-surface-muted' : 'bg-surface-sunken')}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-onbrand" aria-hidden="true">
            {index + 1}
          </span>
          <h3 className="mt-8 text-xl font-medium tracking-tight">
            <span className="sr-only">Step {index + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 text-ink-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
