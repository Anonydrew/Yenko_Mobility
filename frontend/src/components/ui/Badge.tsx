import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type Tone = 'brand' | 'muted' | 'dark' | 'white';

const tones: Record<Tone, string> = {
  brand: 'bg-brand text-onbrand',
  muted: 'bg-surface-muted text-ink-muted',
  dark: 'bg-onbrand text-white',
  white: 'bg-surface-sunken text-ink',
};

export default function Badge({ tone = 'brand', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', tones[tone], className)}>{children}</span>;
}
