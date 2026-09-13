import { useParams } from 'react-router-dom';
import CampusGrid from '@/components/sections/CampusGrid';
import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MapPinIcon, SparkIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { campuses } from '@/content/locations';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import NotFound from '../NotFound';

export default function CampusDetail() {
  const { slug } = useParams();
  const campus = campuses.find((item) => item.slug === slug);
  useDocumentTitle(campus ? `Yenko at ${campus.shortName}` : 'Page not found', campus?.summary);

  if (!campus) return <NotFound />;

  const live = campus.status === 'live';
  const facts = [
    { label: 'Status', value: live ? 'Live now' : 'Coming soon' },
    ...(live
      ? [
          { label: 'E-bikes', value: String(campus.bikes) },
          { label: 'Parking zones', value: String(campus.zones) },
        ]
      : [{ label: 'Expected', value: campus.since.replace('Planned for ', '') }]),
    { label: 'Hours', value: campus.hours },
    ...(campus.hub ? [{ label: 'Campus hub', value: campus.hub }] : []),
  ];

  return (
    <>
      <PageHero
        eyebrow={`Campus locations · ${campus.city}, ${campus.region}`}
        title={campus.name}
        intro={
          <>
            <Badge tone={live ? 'brand' : 'muted'} className="mb-5 text-sm">
              {campus.since}
            </Badge>
            <p>{campus.summary}</p>
          </>
        }
        actions={
          live ? (
            <>
              <Button to="/download" size="lg">
                Download the app
              </Button>
              <Button to="/pricing" size="lg" variant="secondary">
                See pricing
              </Button>
            </>
          ) : (
            <>
              <Button to="/download#get-the-app" size="lg">
                Join the waitlist
              </Button>
              <Button to="/partnerships" size="lg" variant="secondary">
                Talk to partnerships
              </Button>
            </>
          )
        }
        aside={
          <div className="overflow-hidden rounded-4xl border border-line bg-surface-muted text-white">
            <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
              {facts.map((fact, index) => (
                <div key={fact.label} className={`bg-surface-muted p-7 ${facts.length % 2 === 1 && index === facts.length - 1 ? 'sm:col-span-2' : ''}`}>
                  <dt className="text-sm text-white/60">{fact.label}</dt>
                  <dd className="mt-2 text-xl font-bold tracking-tight">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title={live ? 'Where you’ll find bikes' : 'Where we’re planning zones'} />
            <ul className="mt-8 grid gap-3">
              {campus.highlights.map((place) => (
                <li key={place} className="flex items-center gap-4 rounded-2xl bg-surface-sunken p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-onbrand">
                    <MapPinIcon width={18} height={18} />
                  </span>
                  {place}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Good to know" />
            <ul className="mt-8 grid gap-3">
              {campus.tips.map((tip) => (
                <li key={tip} className="flex gap-4 rounded-2xl bg-surface-sunken p-5">
                  <SparkIcon className="mt-0.5 shrink-0" />
                  <span className="text-ink-soft">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Campus locations" title="Other Yenko campuses" />
        <div className="mt-12">
          <CampusGrid excludeSlug={campus.slug} />
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
