import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from '@/components/blog/Markdown';
import BlogTeaser from '@/components/sections/BlogTeaser';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import ErrorState from '@/components/ui/ErrorState';
import { ArrowLeftIcon, CheckIcon, CopyIcon } from '@/components/ui/icons';
import { getPost } from '@/lib/blogApi';
import { formatDate } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import NotFound from '../NotFound';

export default function BlogPost() {
  const { slug = '' } = useParams();
  const { status, data, error, reload } = useAsync((signal) => getPost(slug, signal), [slug]);
  const post = data?.slug === slug ? data : undefined;

  useDocumentTitle(post?.title ?? 'Blog', post?.excerpt);

  if (status === 'error' && error.status === 404) return <NotFound />;

  if (status === 'error') {
    return (
      <Container className="py-20">
        <ErrorState message={error.message} onRetry={reload} />
      </Container>
    );
  }

  if (!post) return <ArticleSkeleton />;

  return (
    <>
      <article>
        <Container className="pt-10 sm:pt-14 lg:pt-16">
          <div className="mx-auto max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
              <ArrowLeftIcon width={16} height={16} /> All stories
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              <Link to={`/blog/category/${post.category.slug}`}>
                <Badge>{post.category.name}</Badge>
              </Link>
              <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h1 className="mt-5 text-display-xl font-bold">{post.title}</h1>
            <p className="mt-6 text-xl text-ink-muted">{post.excerpt}</p>
          </div>

          {post.coverImage && (
            <div className="mx-auto mt-12 aspect-[16/9] max-w-5xl overflow-hidden rounded-4xl bg-surface-muted">
              <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mx-auto mt-12 max-w-3xl pb-20">
            <Markdown>{post.body}</Markdown>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <p className="text-sm text-ink-muted">
                Published {formatDate(post.publishedAt)} in{' '}
                <Link to={`/blog/category/${post.category.slug}`} className="text-ink underline underline-offset-4">
                  {post.category.name}
                </Link>
              </p>
              <CopyLinkButton />
            </div>
          </div>
        </Container>
      </article>

      <BlogTeaser eyebrow="Keep reading" title={`More in ${post.category.name}`} category={post.category.slug} excludeSlug={post.slug} tone="muted" />
    </>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; nothing else to do.
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={copy}>
      {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
      {copied ? 'Link copied' : 'Copy link'}
    </Button>
  );
}

function ArticleSkeleton() {
  return (
    <Container className="animate-pulse py-16" aria-hidden="true">
      <div className="mx-auto max-w-3xl">
        <div className="h-4 w-24 rounded-full bg-surface-muted" />
        <div className="mt-10 h-12 w-full rounded-2xl bg-surface-muted" />
        <div className="mt-3 h-12 w-2/3 rounded-2xl bg-surface-muted" />
        <div className="mt-8 h-5 w-full rounded-full bg-surface-muted" />
      </div>
      <div className="mx-auto mt-12 aspect-[16/9] max-w-5xl rounded-4xl bg-surface-muted" />
    </Container>
  );
}
