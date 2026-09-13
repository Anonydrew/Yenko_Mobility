import BlogTeaser from '@/components/sections/BlogTeaser';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import StatsBand from '@/components/sections/StatsBand';
import Steps from '@/components/sections/Steps';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const method = [
  { title: 'Count the distance', text: 'Our first 100,000 rides covered 231,000 km.' },
  { title: 'Ask what it replaced', text: '45% of riders told us they would otherwise have used a taxi, ride-hailing app or shuttle. That’s 103,950 km.' },
  { title: 'Calculate emissions avoided', text: 'At 0.17 kg of CO₂ per km for a typical petrol car, that’s about 17.7 tonnes.' },
  { title: 'Subtract our own footprint', text: 'Charging used about 2,300 kWh, roughly 1 tonne of CO₂. Net: about 16.7 tonnes avoided.' },
];

const targets = [
  { title: 'Solar charging on every campus', text: 'Extending solar canopies from Legon to KNUST and UCC by early 2027.' },
  { title: 'A full life-cycle assessment', text: 'An independent study including how our bikes are made and moved, published in 2027.' },
  { title: 'Zero batteries to landfill', text: 'Every retired battery reused for solar storage or responsibly recycled.' },
  { title: 'A public impact dashboard', text: 'Monthly rides, distance and emissions data published on this website.' },
];

export default function Sustainability() {
  useDocumentTitle('Sustainability impact', 'How Yenko e-bikes cut emissions on campus, and exactly how we measure it.');

  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Cleaner campuses, one ride at a time."
        intro="Every trip taken on a Yenko instead of a taxi keeps exhaust out of the air students breathe. Here’s our impact so far, and how we measure it honestly."
        image={media.solar}
      />

      <StatsBand
        eyebrow="Our impact"
        title="The numbers behind the rides."
        stats={[
          { value: '16.7 t', label: 'net CO₂ avoided in our first 100,000 rides' },
          { value: '45%', label: 'of rides replace a motor vehicle trip' },
          { value: '35%', label: 'of Legon hub charging comes from solar' },
          { value: '800', label: 'charge cycles before a battery retires' },
        ]}
        note="Figures from our first 100,000 rides and our latest rider survey (1,850 responses)."
      />

      <Section tone="muted">
        <SectionHeading
          eyebrow="Our method"
          title="How we calculate CO₂ avoided."
          intro="Many of our rides replace walking, which has no emissions. So we only count trips that would otherwise have been made by motor vehicle."
        />
        <div className="mt-12">
          <Steps steps={method} cardTone="white" />
        </div>
      </Section>

      <Section>
        <SplitFeature
          image={media.fleet}
          eyebrow="Operations"
          title="Swapping batteries, not bikes."
          bullets={['Charged batteries delivered by electric cargo trikes', 'No vans collecting bikes to charge them', 'Bikes stay in their parking zones, ready to ride']}
        >
          <p>Each night our team swaps flat batteries for fully charged ones, right where the bikes are parked. The whole operation runs without a drop of fuel.</p>
        </SplitFeature>
      </Section>

      <Section>
        <SplitFeature
          reverse
          image={media.solar}
          eyebrow="Energy"
          title="Powered by the sun."
          bullets={['42-panel solar canopy at our Legon hub', 'Battery storage planned for overnight charging', 'Retired batteries reused to store solar power for street lights']}
        >
          <p>On a sunny day, our rooftop solar covers around 35% of our charging needs. We’re working to push that higher on every campus.</p>
        </SplitFeature>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="What’s next" title="Our sustainability targets." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {targets.map((target) => (
            <li key={target.title} className="rounded-3xl bg-surface-sunken p-7">
              <h3 className="text-xl font-medium tracking-tight">{target.title}</h3>
              <p className="mt-2 text-ink-muted">{target.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <BlogTeaser eyebrow="From the blog" title="Stories about our impact" category="campus-sustainability" />
    </>
  );
}
