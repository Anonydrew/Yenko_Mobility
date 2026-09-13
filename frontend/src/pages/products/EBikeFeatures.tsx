import CtaBanner from '@/components/sections/CtaBanner';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import PhoneMockup from '@/components/sections/PhoneMockup';
import SplitFeature from '@/components/sections/SplitFeature';
import Button from '@/components/ui/Button';
import { BasketIcon, BatteryIcon, BoltIcon, GaugeIcon, LockIcon, SunIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const features = [
  { icon: BoltIcon, title: 'Strong pedal assist', text: 'A 250 W rear hub motor tuned for climbs helps you up to 25 km/h. You still pedal, but hills stop being a workout.' },
  { icon: BatteryIcon, title: 'Swappable battery', text: 'Up to 60 km per charge. Our team swaps batteries before they drop below 25%, so your bike is always ready.' },
  { icon: LockIcon, title: 'Smart lock', text: 'Scan to unlock in a second. When mobile data is patchy, the lock connects over Bluetooth instead.' },
  { icon: SunIcon, title: 'Automatic lights', text: 'Front and rear LEDs switch on at dusk and stay on for your whole ride.' },
  { icon: BasketIcon, title: 'A basket that fits your bag', text: 'Carries up to 8 kg with a bungee strap, so laptops, groceries and lab coats stay put.' },
  { icon: GaugeIcon, title: 'Slow zones', text: 'Around lecture halls and libraries the assist limits itself to 12 km/h, keeping busy areas safe.' },
];

const specs = [
  ['Motor', '250 W rear hub'],
  ['Assisted speed', 'Up to 25 km/h'],
  ['Range', 'Up to 60 km per charge'],
  ['Battery', '36 V, swappable'],
  ['Brakes', 'Front and rear disc'],
  ['Lights', 'Automatic front and rear LEDs'],
  ['Basket', 'Front, up to 8 kg, with strap'],
  ['Tyres', 'Puncture-resistant'],
  ['Weight', '24 kg'],
  ['Rider height', '150 to 195 cm'],
  ['Weather rating', 'IP55 splash-proof'],
  ['Connectivity', 'GPS, 4G and Bluetooth'],
];

export default function EBikeFeatures() {
  useDocumentTitle('E-bike features', 'Meet the Yenko E1: strong pedal assist, a swappable 60 km battery, a smart lock and a basket that fits your bag.');

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Meet the Yenko E1."
        intro="Our own e-bike, designed and tested on the hills of Legon. Strong pedal assist, a battery that never runs flat on you and all the details students asked for."
        image={media.eBike}
        actions={
          <>
            <Button to="/download" size="lg">
              Download the app
            </Button>
            <Button to="/pricing" size="lg" variant="secondary">
              See pricing
            </Button>
          </>
        }
      />

      <Section tone="muted">
        <SectionHeading eyebrow="Features" title="Small details, big difference." />
        <div className="mt-12">
          <FeatureGrid features={features} cardTone="white" />
        </div>
      </Section>

      <Section>
        <SplitFeature
          image={media.fleet}
          eyebrow="Battery"
          title="A battery that’s always ready."
          bullets={[
            'Up to 60 km on a single charge',
            'Swapped in about 40 seconds, right where the bike is parked',
            'Solar power covers about 35% of charging at our Legon hub',
          ]}
          actions={
            <Button to="/sustainability" variant="dark">
              Our sustainability impact
            </Button>
          }
        >
          <p>
            Instead of collecting bikes in vans to charge them, our team brings fully charged batteries to the bikes. That means more bikes on campus and fewer
            vehicles on the road.
          </p>
        </SplitFeature>
      </Section>

      <Section>
        <SplitFeature
          reverse
          visual={
            <div className="relative aspect-[4/3] overflow-hidden rounded-4xl bg-brand text-onbrand">
              <PhoneMockup className="absolute left-1/2 top-10 -translate-x-1/2" />
            </div>
          }
          eyebrow="Smart lock"
          title="Unlock with a scan. Even without signal."
          bullets={[
            'Reserve a bike for free for up to 10 minutes',
            'Bluetooth backup for basements and patchy networks',
            'GPS shows you exactly where you parked',
          ]}
        >
          <p>Scan the QR code on the handlebars and the lock opens in about a second. At the end of your ride, push the lever down and the app confirms you’re done.</p>
        </SplitFeature>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Technical specs" title="Yenko E1 at a glance." />
        <dl className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map(([label, value]) => (
            <div key={label} className="border-t border-line py-5">
              <dt className="text-sm text-ink-muted">{label}</dt>
              <dd className="mt-1 text-lg font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SplitFeature
          image={media.workshop}
          eyebrow="Maintenance"
          title="Checked every single night."
          bullets={['Brakes, tyres, lights and bell checked on every bike', 'Handlebars and seats cleaned daily', 'Faulty bikes taken out of service within hours of a report']}
          actions={
            <Button to="/careers" variant="secondary">
              Join our field team
            </Button>
          }
        >
          <p>
            Our field technicians inspect every bike while you sleep. Anything that needs more than a five-minute fix goes back to the hub, so the bike you unlock
            in the morning is ready to ride.
          </p>
        </SplitFeature>
      </Section>

      <CtaBanner />
    </>
  );
}
