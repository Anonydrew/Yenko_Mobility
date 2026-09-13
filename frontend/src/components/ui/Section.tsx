import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import Container from './Container';

type Tone = 'white' | 'muted' | 'dark' | 'brand';

const tones: Record<Tone, string> = {
  white: 'bg-black text-ink',
  muted: 'bg-black text-ink',
  dark: 'bg-surface-sunken text-white',
  brand: 'bg-brand text-onbrand',
};

type SectionProps = {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

export default function Section({ id, tone = 'white', className, containerClassName, children }: SectionProps) {
  return (
    <section id={id} className={cx('py-14 sm:py-20 lg:py-24', tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
