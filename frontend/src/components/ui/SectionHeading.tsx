import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
};

export default function SectionHeading({ eyebrow, title, intro, action, align = 'left', tone = 'light', className }: SectionHeadingProps) {
  const muted = tone === 'dark' ? 'text-white/65' : 'text-ink-muted';
  const centered = align === 'center';

  return (
    <div className={cx('flex flex-col gap-6', centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className={cx(centered && 'max-w-3xl')}>
        {eyebrow && <p className={cx('text-sm font-medium', muted)}>{eyebrow}</p>}
        <h2 className={cx('max-w-3xl text-display-lg font-bold', eyebrow && 'mt-3')}>{title}</h2>
        {intro && <div className={cx('mt-5 max-w-2xl text-lg', muted, centered && 'mx-auto')}>{intro}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
