import PageHero from '@/components/sections/PageHero';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { blogCoverCredits, type Credit, siteCredits } from '@/content/credits';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function Credits() {
  useDocumentTitle('Photo credits', 'Credits and licences for the photos and icons used on this website.');

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Photo credits"
        intro="Some photos on this website are shared by their creators under Creative Commons licences. Thank you to everyone listed here. Photos have been resized and cropped to fit the layout."
      />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading title="Website photos" />
        <CreditTable credits={siteCredits} />
      </Section>

      <Section tone="muted">
        <SectionHeading title="Blog cover images" intro="Cover images for new blog posts are chosen by the Yenko team in the admin panel." />
        <CreditTable credits={blogCoverCredits} />
        <p className="mt-10 text-ink-muted">
          The bike icon in our favicon is from{' '}
          <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
            Lucide
          </a>{' '}
          (ISC licence).
        </p>
      </Section>
    </>
  );
}

function CreditTable({ credits }: { credits: Credit[] }) {
  return (
    <div className="mt-10 overflow-x-auto rounded-3xl border border-line bg-surface-sunken">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-surface-muted text-ink-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              Photo
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Creator
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Licence
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Used on
            </th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => (
            <tr key={credit.file} className="border-t border-line align-top">
              <td className="px-5 py-4">
                <a href={credit.source} target="_blank" rel="noopener noreferrer" className="font-medium underline-offset-4 hover:underline">
                  {credit.title}
                </a>
              </td>
              <td className="px-5 py-4 text-ink-soft">{credit.author}</td>
              <td className="px-5 py-4">
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-ink-soft underline underline-offset-4">
                  {credit.license}
                </a>
              </td>
              <td className="px-5 py-4 text-ink-muted">{credit.usedFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
