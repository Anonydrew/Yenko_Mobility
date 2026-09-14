import { Link } from 'react-router-dom';
import { SplitSection, TextCards } from '@/components/company/CompanyBlocks';
import { ExploreSection } from '@/components/company/CompanyCarousel';
import { CompanyHero, CompanyPage, CompanySection } from '@/components/company/CompanyLayout';
import { brandButton, darkButton, lightCard, muted } from '@/components/company/styles';
import { ArrowRightIcon } from '@/components/ui/icons';
import { openRoles, perks, values } from '@/content/careers';
import { media } from '@/content/media';
import { cx } from '@/lib/cx';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

function applyLink(role: string) {
  return `/contact?topic=careers&role=${encodeURIComponent(role)}`;
}

export default function Careers() {
  useDocumentTitle('Careers', 'Join Yenko Mobility: open roles in operations, support, engineering and on campus.');

  return (
    <CompanyPage
      hero={
        <CompanyHero
          eyebrow="Careers"
          title="Build the future of campus transport."
          intro="We’re a team of technicians, engineers, support agents and students making it easier for thousands of people to get where they’re going."
          actions={
            <Link to="#open-roles" className={brandButton}>
              See open roles
            </Link>
          }
        />
      }
    >
      <CompanySection eyebrow="How we work" title="What we value.">
        <TextCards items={values} numbered />
      </CompanySection>

      <CompanySection eyebrow="Benefits" title="Looking after our people.">
        <TextCards items={perks} />
      </CompanySection>

      <CompanySection id="open-roles" eyebrow="Open roles" title={`${openRoles.length} roles open right now.`}>
        <ul className="mt-12 space-y-3">
          {openRoles.map((role) => (
            <li key={role.title}>
              <Link
                to={applyLink(role.title)}
                className={cx(
                  'group flex flex-col gap-4 rounded-2xl p-6 transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-7',
                  lightCard,
                )}
              >
                <span>
                  <span className="block text-xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{role.title}</span>
                  <span className={cx('mt-1 block', muted)}>
                    {role.team} · {role.location} · {role.type}
                  </span>
                </span>
                <span className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-onbrand px-5 font-medium text-white sm:self-auto">
                  Apply <ArrowRightIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CompanySection>

      <SplitSection
        image={media.students}
        eyebrow="For students"
        title="Become a Campus Ambassador."
        bullets={['Free Semester Pass and a monthly stipend', 'Flexible hours around your lectures', 'Real experience in marketing and operations']}
        actions={
          <Link to={applyLink('Campus Ambassador')} className={darkButton}>
            Apply to be an ambassador
          </Link>
        }
      >
        <p>Ambassadors help new riders get started, run events in their halls and share feedback that shapes how Yenko works on their campus.</p>
      </SplitSection>

      <CompanySection>
        <div className="flex flex-col gap-6 rounded-3xl bg-[#F3F4F1] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="text-display-md font-bold">Don’t see the right role?</h2>
            <p className={cx('mt-3 text-lg', muted)}>Tell us what you’re great at. We keep every application on file for future roles.</p>
          </div>
          <Link to="/contact?topic=careers" className={cx(darkButton, 'shrink-0 self-start sm:self-auto')}>
            Send us your details
          </Link>
        </div>
      </CompanySection>

      <ExploreSection current="/careers" />
    </CompanyPage>
  );
}
