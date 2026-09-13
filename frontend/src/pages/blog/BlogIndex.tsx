import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CategoryTabs from '@/components/blog/CategoryTabs';
import Pagination from '@/components/blog/Pagination';
import PostCard, { PostCardSkeleton } from '@/components/blog/PostCard';
import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import Container from '@/components/ui/Container';
import ErrorState from '@/components/ui/ErrorState';
import { listCategories, listPosts } from '@/lib/blogApi';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import NotFound from '../NotFound';

/** One featured story plus a grid of six keeps every page visually balanced. */
const PER_PAGE = 7;

export default function BlogIndex() {
  const { slug: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const categories = useAsync((signal) => listCategories(signal), []);
  const posts = useAsync((signal) => listPosts({ page, perPage: PER_PAGE, category: categorySlug }, signal), [page, categorySlug]);

  const category = categories.data?.find((item) => item.slug === categorySlug) ?? null;
  const basePath = categorySlug ? `/blog/category/${categorySlug}` : '/blog';
  const title = category?.name ?? 'Stories from Yenko';
  const intro = category?.description ?? 'Product news, rider safety advice and stories from the campuses we serve.';

  useDocumentTitle(categorySlug ? category?.name ?? 'Blog' : 'Blog', intro);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (posts.status === 'error' && posts.error.status === 404) return <NotFound />;

  const items = posts.data?.data ?? [];
  const meta = posts.data?.meta;
  const [featured, ...rest] = items;
  const showSkeleton = posts.status === 'loading';

  return (
    <>
      <PageHero eyebrow={categorySlug ? 'Blog category' : 'Blog'} title={title} intro={intro} />

      <Container className="pb-20">
        <CategoryTabs categories={categories.data ?? []} activeSlug={categorySlug ?? null} />

        <div className="mt-10">
          {posts.status === 'error' && <ErrorState message={posts.error.message} onRetry={posts.reload} />}

          {showSkeleton && (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <PostCardSkeleton key={key} />
              ))}
            </div>
          )}

          {posts.status === 'success' && items.length === 0 && (
            <div className="rounded-4xl bg-surface-muted p-10">
              <h2 className="text-2xl font-bold tracking-tight">{page > 1 ? 'This page is empty.' : 'No stories here yet.'}</h2>
              <p className="mt-2 text-ink-muted">
                {page > 1 ? (
                  <Link to={basePath} className="text-ink underline underline-offset-4">
                    Go back to the first page
                  </Link>
                ) : (
                  <>
                    Check back soon, or{' '}
                    <Link to="/blog" className="text-ink underline underline-offset-4">
                      browse all stories
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          )}

          {posts.status === 'success' && featured && (
            <>
              <PostCard post={featured} variant="feature" />
              {rest.length > 0 && (
                <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {meta && (
          <div className="mt-16">
            <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={(n) => (n === 1 ? basePath : `${basePath}?page=${n}`)} />
          </div>
        )}
      </Container>

      <CtaBanner />
    </>
  );
}
