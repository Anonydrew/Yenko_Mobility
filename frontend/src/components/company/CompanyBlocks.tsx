import { useId, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PhoneMockup from '@/components/sections/PhoneMockup';
import Container from '@/components/ui/Container';
import { BikeIcon, CheckIcon, type Icon } from '@/components/ui/icons';
import StoreButtons from '@/components/ui/StoreButtons';
import type { MediaImage } from '@/content/media';
import { listPosts } from '@/lib/blogApi';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import { CompanySection } from './CompanyLayout';
import { darkButton, lightButton, lightCard, muted } from './styles';

/** A bold lead sentence beside supporting paragraphs. */
export function IntroColumns({ lead, children }: { lead: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
      <p className="text-lg font-semibold leading-relaxed">{lead}</p>
      <div className={cx('space-y-4 text-lg leading-relaxed', muted)}>{children}</div>
    </div>
  );
}

export function StatCards({ stats, columns = 3 }: { stats: { value: string; label: string; note?: string }[]; columns?: 3 | 4 }) {
  return (
    <ul className={cx('mt-12 grid gap-4 sm:grid-cols-2', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {stats.map((stat) => (
        <li key={stat.label} className={cx('rounded-2xl p-6 sm:p-7', lightCard)}>
          <p className="text-display-lg font-bold">{stat.value}</p>
          <p className={cx('mt-3 text-lg font-medium', muted)}>{stat.label}</p>
          {stat.note && <p className={cx('mt-6 text-sm', muted)}>{stat.note}</p>}
        </li>
      ))}
    </ul>
  );
}

type TextCard = { title: string; text: string; icon?: Icon };

/** Light cards with an optional icon or step number. */
export function TextCards({ items, columns = 4, numbered = false }: { items: TextCard[]; columns?: 3 | 4; numbered?: boolean }) {
  return (
    <ul className={cx('mt-12 grid gap-4 sm:grid-cols-2', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {items.map(({ title, text, icon: CardIcon }, index) => (
        <li key={title} className={cx('flex flex-col rounded-2xl p-6 sm:p-7', lightCard)}>
          {CardIcon && (
            <span className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-onbrand">
              <CardIcon width={20} height={20} />
            </span>
          )}
          {numbered && <span className="mb-8 text-display-md font-bold text-black/20">{String(index + 1).padStart(2, '0')}</span>}
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className={cx('mt-2 leading-relaxed', muted)}>{text}</p>
        </li>
      ))}
    </ul>
  );
}

export function ImagePair({ images }: { images: [MediaImage, MediaImage] }) {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      {images.map((image) => (
        <div key={image.src} className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F7F5]">
          <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

type SplitSectionProps = {
  eyebrow?: string;
  title: string;
  image: MediaImage;
  reverse?: boolean;
  bullets?: string[];
  actions?: ReactNode;
  children?: ReactNode;
};

/** Image on one side, heading, text and ticked bullets on the other. */
export function SplitSection({ eyebrow, title, image, reverse, bullets, actions, children }: SplitSectionProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cx('aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F7F5]', reverse && 'lg:order-2')}>
          <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          {eyebrow && <p className={cx('text-sm font-semibold tracking-wide', muted)}>{eyebrow}</p>}
          <h2 id={headingId} className={cx('text-display-lg font-bold', eyebrow && 'mt-3')}>
            {title}
          </h2>
          {children && <div className={cx('mt-6 space-y-4 text-lg leading-relaxed', muted)}>{children}</div>}
          {bullets && (
            <ul className="mt-8 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-onbrand">
                    <CheckIcon width={14} height={14} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}

export function DownloadSection() {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="pb-16 sm:pb-24">
      <Container>
        <div className="grid overflow-hidden rounded-3xl bg-[#F3F4F1] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <h2 id={headingId} className="text-display-lg font-bold">
              Download the Yenko app
            </h2>
            <p className={cx('mt-4 text-lg', muted)}>Available for iOS and Android devices. Ride, send, own and manage your team in one app.</p>
            <StoreButtons tone="light" className="mt-8" />
          </div>
          <div className="relative h-80 sm:h-96 lg:h-auto lg:min-h-[28rem]">
            <PhoneMockup className="absolute left-1/2 top-10 -translate-x-1/2 rotate-6 scale-90 sm:top-12 lg:top-16" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The newest blog posts as wide cards. Renders nothing if the API is unavailable or there are no posts. */
export function LatestUpdates({
  category,
  title = 'Latest updates',
  intro = 'Stay up to date with Yenko news, launches, campus updates and stories from our riders and team.',
}: {
  category?: string;
  title?: string;
  intro?: string;
}) {
  const { status, data } = useAsync((signal) => listPosts({ perPage: 3, category }, signal), [category]);
  const posts = data?.data ?? [];
  if (status === 'error' || (status === 'success' && posts.length === 0)) return null;

  return (
    <CompanySection
      title={title}
      intro={intro}
      actions={
        <>
          <Link to="/blog" className={darkButton}>
            Blog
          </Link>
          <Link to="/contact?topic=press" className={lightButton}>
            Press enquiries
          </Link>
        </>
      }
    >
      <ul className="mt-12 space-y-3">
        {status === 'loading' && posts.length === 0
          ? [0, 1, 2].map((key) => <li key={key} aria-hidden="true" className="h-56 animate-pulse rounded-2xl bg-[#F3F4F1]" />)
          : posts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group grid overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FAFBFA] transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[24rem_minmax(0,1fr)]"
                >
                  <span className="block aspect-[16/9] overflow-hidden bg-brand sm:aspect-auto sm:min-h-[14rem] lg:min-h-[17rem]">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-onbrand">
                        <BikeIcon width={48} height={48} strokeWidth={1.5} />
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col justify-center p-6 sm:p-8">
                    <span className="flex items-center justify-between gap-4 text-sm">
                      <span className="rounded-full border border-onbrand/25 px-2.5 py-0.5 text-xs font-semibold">{post.category.name}</span>
                      <time dateTime={post.publishedAt ?? undefined} className={muted}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </span>
                    <span className="mt-4 block text-xl font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">{post.title}</span>
                    <span className={cx('mt-3 line-clamp-2 block', muted)}>{post.excerpt}</span>
                  </span>
                </Link>
              </li>
            ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <Link to="/blog" className={darkButton}>
          View more
        </Link>
      </div>
    </CompanySection>
  );
}
