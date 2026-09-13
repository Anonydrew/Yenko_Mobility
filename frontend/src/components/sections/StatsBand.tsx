import type { ReactNode } from 'react';
import Section from '@/components/ui/Section';

type StatsBandProps = {
  eyebrow?: string;
  title: string;
  stats: { value: string; label: string }[];
  note?: ReactNode;
};

export default function StatsBand({ eyebrow, title, stats, note }: StatsBandProps) {
  return (
    <Section>
      <div className="rounded-5xl border border-line bg-surface-muted px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {eyebrow && <p className="text-sm font-medium text-white/60">{eyebrow}</p>}
            <h2 className="mt-3 text-display-lg font-bold">{title}</h2>
            {note && <div className="mt-5 text-white/60">{note}</div>}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-7">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-t border-white/15 pt-5">
                <dt className="mt-2 text-sm text-white/60">{stat.label}</dt>
                <dd className="text-display-lg font-bold text-brand">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
