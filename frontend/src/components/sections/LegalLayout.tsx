import Container from '@/components/ui/Container';
import type { LegalSection } from '@/content/legal';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import PageHero from './PageHero';

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export default function LegalLayout({ eyebrow, title, intro, updated, sections }: LegalLayoutProps) {
  useDocumentTitle(title, intro);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={
          <>
            <p>{intro}</p>
            <p className="mt-4 text-sm">Last updated {updated}</p>
          </>
        }
      />
      <Container className="pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-4">
            <div className="rounded-3xl bg-surface-muted p-6 lg:sticky lg:top-24">
              <p className="text-sm font-medium">On this page</p>
              <ol className="mt-4 space-y-2.5 text-sm">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-ink-muted transition-colors hover:text-ink">
                      {index + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="prose prose-lg max-w-none lg:col-span-8">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <h2>
                  {index + 1}. {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </Container>
    </>
  );
}
