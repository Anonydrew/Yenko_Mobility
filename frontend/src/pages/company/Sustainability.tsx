import { DownloadSection, LatestUpdates, SplitSection, StatCards, TextCards } from '@/components/company/CompanyBlocks';
import { ExploreSection, TimelineCarousel, type TimelineItem } from '@/components/company/CompanyCarousel';
import { CompanyHero, CompanyPage, CompanySection } from '@/components/company/CompanyLayout';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const impact = [
  { value: '16.7 t', label: 'Net CO₂ avoided', note: 'In our first 100,000 rides' },
  { value: '45%', label: 'Rides that replace a motor vehicle trip', note: 'From our latest rider survey' },
  { value: '35%', label: 'Legon hub charging from solar', note: 'On a sunny day' },
  { value: '800', label: 'Charge cycles before a battery retires', note: 'Then reused for solar storage' },
];

const method: TimelineItem[] = [
  { kind: 'text', label: 'Step 1', title: 'Count the distance', text: 'Our first 100,000 rides covered 231,000 km.' },
  { kind: 'image', image: media.riders },
  {
    kind: 'text',
    label: 'Step 2',
    title: 'Ask what it replaced',
    text: '45% of riders told us they would otherwise have used a taxi, ride-hailing app or shuttle. That’s 103,950 km.',
  },
  { kind: 'text', label: 'Step 3', title: 'Calculate emissions avoided', text: 'At 0.17 kg of CO₂ per km for a typical petrol car, that’s about 17.7 tonnes.' },
  { kind: 'image', image: media.parking },
  {
    kind: 'text',
    label: 'Step 4',
    title: 'Subtract our own footprint',
    text: 'Charging used about 2,300 kWh, roughly 1 tonne of CO₂. Net: about 16.7 tonnes avoided.',
  },
];

const targets = [
  { title: 'Solar charging on every campus', text: 'Extending solar canopies from Legon to KNUST and UCC by early 2027.' },
  { title: 'A full life-cycle assessment', text: 'An independent study including how our bikes are made and moved, published in 2027.' },
  { title: 'Zero batteries to landfill', text: 'Every retired battery reused for solar storage or responsibly recycled.' },
  { title: 'A public impact dashboard', text: 'Monthly rides, distance and emissions data published on this website.' },
];

export default function Sustainability() {
  useDocumentTitle('Sustainability impact', 'How Yenko e-bikes cut emissions, and exactly how we measure it.');

  return (
    <CompanyPage
      hero={
        <CompanyHero
          eyebrow="Sustainability"
          title="Cleaner campuses, one ride at a time."
          intro="Every trip taken on a Yenko instead of a taxi keeps exhaust out of the air we breathe. Here’s our impact so far, and how we measure it honestly."
        />
      }
    >
      <CompanySection
        eyebrow="Our impact"
        title="The numbers behind the rides."
        intro="Figures from our first 100,000 rides and our latest rider survey (1,850 responses)."
      >
        <StatCards stats={impact} columns={4} />
      </CompanySection>

      <CompanySection
        wide
        eyebrow="Our method"
        title="How we calculate CO₂ avoided."
        intro="Many of our rides replace walking, which has no emissions. So we only count trips that would otherwise have been made by motor vehicle."
      >
        <TimelineCarousel label="How we calculate CO₂ avoided" itemLabel="step" items={method} />
      </CompanySection>

      <SplitSection
        image={media.fleet}
        eyebrow="Operations"
        title="Swapping batteries, not bikes."
        bullets={['Charged batteries delivered by electric cargo trikes', 'No vans collecting bikes to charge them', 'Bikes stay in their parking zones, ready to ride']}
      >
        <p>Each night our team swaps flat batteries for fully charged ones, right where the bikes are parked. The whole operation runs without a drop of fuel.</p>
      </SplitSection>

      <SplitSection
        reverse
        image={media.solar}
        eyebrow="Energy"
        title="Powered by the sun."
        bullets={['42-panel solar canopy at our Legon hub', 'Battery storage planned for overnight charging', 'Retired batteries reused to store solar power for street lights']}
      >
        <p>On a sunny day, our rooftop solar covers around 35% of our charging needs. We’re working to push that higher on every campus.</p>
      </SplitSection>

      <CompanySection eyebrow="What’s next" title="Our sustainability targets.">
        <TextCards items={targets} numbered />
      </CompanySection>

      <LatestUpdates
        category="campus-sustainability"
        title="Stories about our impact"
        intro="News and stories about cleaner transport, solar charging and our work on campus."
      />

      <ExploreSection current="/sustainability" />

      <DownloadSection />
    </CompanyPage>
  );
}
