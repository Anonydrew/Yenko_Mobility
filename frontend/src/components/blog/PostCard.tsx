import { Link } from 'react-router-dom';
import { ArrowRightIcon, BikeIcon } from '@/components/ui/icons';
import { formatDate } from '@/lib/format';
import type { PostSummary } from '@/lib/types';
import { cx } from '@/lib/cx';

type PostCardProps = {
  post: PostSummary;
  variant?: 'default' | 'feature';
};

function Cover({ post, className }: { post: PostSummary; className?: string }) {
  if (post.coverImage) {
    return (
      <img
        src={post.coverImage}
        alt=""
        loading="lazy"
        className={cx('h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]', className)}
      />
    );
  }
  return (
    <span className={cx('flex h-full w-full items-center justify-center bg-brand text-onbrand', className)}>
      <BikeIcon width={48} height={48} strokeWidth={1.5} />
    </span>
  );
}

function Meta({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <p className={cx('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted', className)}>
      <Link to={`/blog/category/${post.category.slug}`} className="font-medium text-ink hover:underline hover:underline-offset-4">
        {post.category.name}
      </Link>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min read</span>
    </p>
  );
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const href = `/blog/${post.slug}`;

  if (variant === 'feature') {
    return (
      <article className="group grid overflow-hidden rounded-4xl bg-surface-muted lg:grid-cols-2">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
          <Cover post={post} />
        </Link>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Meta post={post} />
          <h2 className="mt-4 text-display-md font-bold">
            <Link to={href} className="decoration-2 underline-offset-4 hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 text-lg text-ink-muted">{post.excerpt}</p>
          <Link to={href} className="mt-8 inline-flex items-center gap-2 self-start font-medium">
            Read the story
            <ArrowRightIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <Link to={href} tabIndex={-1} aria-hidden="true" className="block aspect-[16/10] overflow-hidden rounded-3xl bg-surface-muted">
        <Cover post={post} />
      </Link>
      <Meta post={post} className="mt-5" />
      <h3 className="mt-3 text-xl font-medium tracking-tight">
        <Link to={href} className="underline-offset-4 hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-ink-muted">{post.excerpt}</p>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[16/10] rounded-3xl bg-surface-muted" />
      <div className="mt-5 h-4 w-2/5 rounded-full bg-surface-muted" />
      <div className="mt-4 h-6 w-4/5 rounded-full bg-surface-muted" />
      <div className="mt-3 h-4 w-full rounded-full bg-surface-muted" />
    </div>
  );
}
