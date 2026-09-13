import { Link } from 'react-router-dom';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { openRoles, perks, values } from '@/content/careers';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

function applyLink(role: string) {
  return `/contact?topic=careers&role=${encodeURIComponent(role)}`;
}

export default function Careers() {
  useDocumentTitle('Careers', 'Join Yenko Mobility: open roles in operations, support, engineering and on campus.');

  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Build the future of campus transport."
        intro="We’re a team of technicians, engineers, support agents and students making it easier for thousands of people to get where they’re going."
        image={media.workshop}
        actions={
          <Button to="#open-roles" size="lg" variant="dark">
            See open roles
          </Button>
        }
      />

      <Section>
        <SectionHeading eyebrow="How we work" title="What we value." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <li key={value.title} className="rounded-3xl bg-surface-muted p-7">
              <h3 className="text-xl font-medium tracking-tight">{value.title}</h3>
              <p className="mt-2 text-ink-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Benefits" title="Looking after our people." />
        <div className="mt-12">
          <FeatureGrid features={perks} columns={4} cardTone="white" />
        </div>
      </Section>

      <Section id="open-roles">
        <SectionHeading eyebrow="Open roles" title={`${openRoles.length} roles open right now.`} />
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {openRoles.map((role) => (
            <li key={role.title}>
              <Link to={applyLink(role.title)} className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-xl font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">{role.title}</span>
                  <span className="mt-1 block text-ink-muted">
                    {role.team} · {role.location} · {role.type}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  Apply <ArrowRightIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SplitFeature
          image={media.students}
          eyebrow="For students"
          title="Become a Campus Ambassador."
          bullets={['Free Semester Pass and a monthly stipend', 'Flexible hours around your lectures', 'Real experience in marketing and operations']}
          actions={
            <Button to={applyLink('Campus Ambassador')} variant="dark">
              Apply to be an ambassador
            </Button>
          }
        >
          <p>Ambassadors help new riders get started, run events in their halls and share feedback that shapes how Yenko works on their campus.</p>
        </SplitFeature>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 rounded-4xl bg-surface-muted p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Don’t see the right role?</h2>
            <p className="mt-2 text-ink-muted">Tell us what you’re great at. We keep every application on file for future roles.</p>
          </div>
          <Button to="/contact?topic=careers" variant="dark">
            Send us your details
          </Button>
        </div>
      </Section>
    </>
  );
}
