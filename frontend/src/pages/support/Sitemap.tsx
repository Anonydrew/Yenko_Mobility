import { Link } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import Section from '@/components/ui/Section';
import { campuses } from '@/content/locations';
import { footerColumns, navGroups } from '@/content/navigation';
import { listCategories, listPosts } from '@/lib/blogApi';
import { useAsync } from '@/lib/useAsync';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

type SitemapLink = { label: string; to: string };

export default function Sitemap() {
  useDocumentTitle('Sitemap', 'Every page on the Yenko Mobility website.');

  const categories = useAsync((signal) => listCategories(signal), []);
  const posts = useAsync((signal) => listPosts({ perPage: 24 }, signal), []);

  const resources = footerColumns.find((column) => column.title === 'Resources')?.links ?? [];

  const groups: { title: string; links: SitemapLink[] }[] = [
    { title: 'Home', links: [{ label: 'Home', to: '/' }] },
    ...navGroups.map((group) => ({ title: group.label, links: group.links })),
    { title: 'Campuses', links: campuses.map((campus) => ({ label: campus.name, to: `/locations/${campus.slug}` })) },
    {
      title: 'Blog',
      links: [
        { label: 'All stories', to: '/blog' },
        ...(categories.data ?? []).map((category) => ({ label: `Category: ${category.name}`, to: `/blog/category/${category.slug}` })),
      ],
    },
    { title: 'Stories', links: (posts.data?.data ?? []).map((post) => ({ label: post.title, to: `/blog/${post.slug}` })) },
    { title: 'Resources', links: [...resources.filter((link) => link.to !== '/blog')] },
  ];

  return (
    <>
      <PageHero eyebrow="Resources" title="Sitemap" intro="Every page on the Yenko Mobility website, in one place." />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups
            .filter((group) => group.links.length > 0)
            .map((group) => (
              <section key={group.title} className="rounded-3xl border border-line bg-surface-muted p-7">
                <h2 className="text-lg font-medium tracking-tight">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </Section>
    </>
  );
}
