import type { ReactNode } from 'react';
import Container from '@/components/ui/Container';
import type { MediaImage } from '@/content/media';
import { cx } from '@/lib/cx';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
  image?: MediaImage;
  aside?: ReactNode;
};

export default function PageHero({ eyebrow, title, intro, actions, image, aside }: PageHeroProps) {
  const hasVisual = Boolean(image || aside);

  return (
    <section>
      <Container className={cx('pb-12 pt-12 sm:pt-16 lg:pb-20 lg:pt-20', hasVisual && 'grid items-center gap-10 lg:grid-cols-12 lg:gap-14')}>
        <div className={cx(hasVisual && 'lg:col-span-6')}>
          {eyebrow && <p className="text-sm font-medium text-ink-muted">{eyebrow}</p>}
          <h1 className="mt-4 max-w-4xl text-display-xl font-bold text-ink">{title}</h1>
          {intro && <div className="mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">{intro}</div>}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {image && (
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-4xl bg-surface-muted">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </div>
          </div>
        )}
        {!image && aside && <div className="lg:col-span-6">{aside}</div>}
      </Container>
    </section>
  );
}
