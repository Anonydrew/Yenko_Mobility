import CtaBanner from '@/components/sections/CtaBanner';
import FeatureGrid from '@/components/sections/FeatureGrid';
import SplitFeature from '@/components/sections/SplitFeature';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { LeafIcon, MapPinIcon, ShieldIcon, WalletIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const pillars = [
  { icon: WalletIcon, title: 'Affordable', text: 'A ride should cost less than the snack you buy on the way. Our prices are set with student budgets in mind.' },
  { icon: LeafIcon, title: 'Clean', text: 'Electric bikes, swappable batteries and solar charging, so every short trip cuts emissions instead of adding them.' },
  { icon: ShieldIcon, title: 'Safe', text: 'Well-maintained bikes, sensible speed limits and real people ready to help at any hour.' },
  { icon: MapPinIcon, title: 'Local', text: 'Designed for Ghanaian campuses, run by Ghanaian teams and repaired close to where you ride.' },
];

const goals = [
  { value: '10', label: 'campuses across West Africa' },
  { value: '1 million', label: 'rides every year' },
  { value: '100%', label: 'of charging from renewable sources' },
  { value: '500', label: 'local jobs' },
];

export default function Mission() {
  useDocumentTitle('Our mission', 'Our mission is to give every student a quick, affordable and clean way to get around campus.');

  return (
    <>
      <section>
        <Container className="pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
          <p className="text-sm font-medium text-ink-muted">Company · Our mission</p>
          <h1 className="mt-6 max-w-5xl text-display-2xl font-bold">
            Every student deserves an easy, affordable and clean way to <span className="rounded-2xl bg-brand px-3 text-onbrand [box-decoration-break:clone]">get around.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted sm:text-xl">
            Time spent walking in the heat or waiting for a shuttle is time taken from studying, sleeping and living. We’re here to give it back.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        <SectionHeading eyebrow="What guides us" title="Four promises to every rider." />
        <div className="mt-12">
          <FeatureGrid features={pillars} columns={4} cardTone="white" />
        </div>
      </Section>

      <Section>
        <SplitFeature image={media.campus} eyebrow="Why campuses first?" title="Where short trips matter most.">
          <p>
            Universities are small cities with thousands of short, daily journeys: hostel to lecture, lecture to library, library to the market. They’re perfect for
            e-bikes.
          </p>
          <p>
            Working closely with each university means we can plan safe parking zones, respect campus rules and prove what shared electric transport can do, before
            expanding into the surrounding community.
          </p>
        </SplitFeature>
      </Section>

      <Section>
        <div className="rounded-5xl border border-line bg-surface-muted px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <p className="text-sm font-medium text-white/60">Where we’re heading</p>
          <h2 className="mt-3 max-w-2xl text-display-lg font-bold">Our goals for 2030.</h2>
          <dl className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {goals.map((goal) => (
              <div key={goal.label} className="flex flex-col-reverse border-t border-white/15 pt-5">
                <dt className="mt-2 text-sm text-white/60">{goal.label}</dt>
                <dd className="text-display-lg font-bold text-brand">{goal.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button to="/sustainability">Our sustainability impact</Button>
            <Button to="/about" variant="secondary">
              About Yenko
            </Button>
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
