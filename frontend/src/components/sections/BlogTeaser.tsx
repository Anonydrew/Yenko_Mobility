import PostCard, { PostCardSkeleton } from '@/components/blog/PostCard';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { listPosts } from '@/lib/blogApi';
import { useAsync } from '@/lib/useAsync';

type BlogTeaserProps = {
  eyebrow?: string;
  title?: string;
  category?: string;
  excludeSlug?: string;
  tone?: 'white' | 'muted';
};

/** The latest stories. Renders nothing if the API is unavailable or there is nothing to show. */
export default function BlogTeaser({ eyebrow = 'Blog', title = 'Latest from Yenko', category, excludeSlug, tone = 'white' }: BlogTeaserProps) {
  const { status, data } = useAsync((signal) => listPosts({ perPage: excludeSlug ? 4 : 3, category }, signal), [category, excludeSlug]);
  const posts = (data?.data ?? []).filter((post) => post.slug !== excludeSlug).slice(0, 3);

  if (status === 'error' || (status === 'success' && posts.length === 0)) return null;

  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <Button to="/blog" variant={tone === 'muted' ? 'dark' : 'secondary'}>
            All stories
          </Button>
        }
      />
      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'loading' && posts.length === 0
          ? [0, 1, 2].map((key) => <PostCardSkeleton key={key} />)
          : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </Section>
  );
}
