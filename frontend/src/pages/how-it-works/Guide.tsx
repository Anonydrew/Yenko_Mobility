import { Link } from 'react-router-dom';
import CtaBanner from '@/components/sections/CtaBanner';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import PhoneMockup from '@/components/sections/PhoneMockup';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import { BikeIcon, GraduationIcon, ShieldIcon, WalletIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { faqGroups } from '@/content/faqs';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const steps = [
  {
    title: 'Find a bike',
    text: 'Open the Yenko app to see available bikes on the map. Each lime pin shows the battery level and how far away the bike is.',
    tips: ['Tap a bike to reserve it for free for up to 10 minutes.', 'Grey areas on the map are closed to riding.'],
  },
  {
    title: 'Scan to unlock',
    text: 'Scan the QR code on the handlebars, or type the bike number. The lock on the rear wheel opens in about a second.',
    tips: ['Do the 30-second check: brakes, tyres, lights and bell.', 'Set the seat to your height using the markings on the post.'],
  },
  {
    title: 'Ride',
    text: 'Start pedalling and the motor joins in. Follow campus traffic rules, keep to the right and give pedestrians plenty of space.',
    tips: ['Assistance drops to 12 km/h in yellow slow zones.', 'Need to stop at a shop? Tap Pause and close the lock.'],
  },
  {
    title: 'Park and end your ride',
    text: 'Ride into a blue parking zone, park upright on the kickstand, close the lock and take a quick photo. Your receipt appears straight away.',
    tips: ['If the lock won’t close, move a few metres further into the zone.', 'Never block ramps, doors or walkways.'],
  },
];

const checklist = [
  { icon: GraduationIcon, title: 'Verify your student email', text: 'Unlocks student pricing and the Semester Pass. It takes less than a minute.' },
  { icon: WalletIcon, title: 'Add a payment method', text: 'MTN MoMo, Telecel Cash, AT Money or a Visa or Mastercard debit card.' },
  { icon: BikeIcon, title: 'Know your seat height', text: 'Find your number once and you’ll be ready to go in seconds every time.' },
  { icon: ShieldIcon, title: 'Bring a helmet', text: 'Semester Pass holders get one free from any campus hub.' },
];

export default function Guide() {
  useDocumentTitle('Step-by-step guide', 'How to find, unlock, ride and park a Yenko e-bike in four simple steps.');
  const ridingFaqs = faqGroups.find((group) => group.id === 'riding-and-parking')?.faqs ?? [];

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Ride in four simple steps."
        intro="No docks, no paperwork and no waiting. Here’s everything you need to know for your first Yenko ride."
        actions={
          <>
            <Button to="/download" size="lg">
              Download the app
            </Button>
            <Button to="/join" size="lg" variant="secondary">
              How to join
            </Button>
          </>
        }
        aside={
          <div className="relative h-[28rem] overflow-hidden rounded-5xl bg-brand sm:h-[32rem]">
            <PhoneMockup screen="ride" className="absolute left-1/2 top-12 -translate-x-1/2" />
          </div>
        }
      />

      <Section className="pt-6 sm:pt-8 lg:pt-8">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="grid gap-6 rounded-4xl bg-surface-muted p-7 sm:p-10 lg:grid-cols-12 lg:gap-10">
              <div className="flex items-start gap-5 lg:col-span-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-onbrand" aria-hidden="true">
                  {index + 1}
                </span>
                <h2 className="pt-2 text-display-md font-bold">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-lg text-ink-soft">{step.text}</p>
                <ul className="mt-5 space-y-2 text-ink-muted">
                  {step.tips.map((tip) => (
                    <li key={tip} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Before your first ride" title="A quick checklist." />
        <div className="mt-12">
          <FeatureGrid features={checklist} columns={4} cardTone="white" />
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Riding and parking questions." />
            <p className="mt-6 text-ink-muted">
              Want more?{' '}
              <Link to="/faq" className="text-ink underline underline-offset-4">
                See all FAQs
              </Link>{' '}
              or read our{' '}
              <Link to="/safety" className="text-ink underline underline-offset-4">
                safety tips
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={ridingFaqs} />
          </div>
        </div>
      </Section>

      <CtaBanner screen="ride" />
    </>
  );
}
