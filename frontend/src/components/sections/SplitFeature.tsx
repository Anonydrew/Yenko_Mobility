import type { ReactNode } from 'react';
import { CheckIcon } from '@/components/ui/icons';
import type { MediaImage } from '@/content/media';
import { cx } from '@/lib/cx';

type SplitFeatureProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  bullets?: string[];
  image?: MediaImage;
  visual?: ReactNode;
  reverse?: boolean;
  actions?: ReactNode;
  overlay?: ReactNode;
};

/** Bolt-style alternating image and text block. */
export default function SplitFeature({ eyebrow, title, children, bullets, image, visual, reverse = false, actions, overlay }: SplitFeatureProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className={cx('relative', reverse && 'lg:order-last')}>
        {image ? (
          <div className="aspect-[4/3] overflow-hidden rounded-4xl bg-surface-sunken">
            <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
          </div>
        ) : (
          visual
        )}
        {overlay}
      </div>

      <div>
        {eyebrow && <p className="text-sm font-medium text-ink-muted">{eyebrow}</p>}
        <h2 className={cx('text-display-lg font-bold', eyebrow && 'mt-3')}>{title}</h2>
        {children && <div className="mt-5 space-y-4 text-lg text-ink-muted">{children}</div>}
        {bullets && (
          <ul className="mt-8 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-onbrand">
                  <CheckIcon width={14} height={14} strokeWidth={2.5} />
                </span>
                <span className="text-[1.0625rem]">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
