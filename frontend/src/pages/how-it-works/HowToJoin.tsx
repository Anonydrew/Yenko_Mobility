import CtaBanner from '@/components/sections/CtaBanner';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import Steps from '@/components/sections/Steps';
import Button from '@/components/ui/Button';
import { CheckIcon, GraduationIcon, PhoneIcon, UsersIcon, WalletIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const steps = [
  { title: 'Download the app', text: 'Get Yenko for iPhone or Android from the Download page.' },
  { title: 'Sign up with your number', text: 'Enter your Ghanaian phone number and the code we text you.' },
  { title: 'Verify your student email', text: 'Optional, but it unlocks student pricing and the Semester Pass.' },
  { title: 'Add a way to pay', text: 'Link MoMo or a debit card, then unlock your first bike.' },
];

const requirements = [
  { icon: UsersIcon, title: 'Aged 16 or over', text: 'Riders aged 16 or 17 need a parent or guardian to accept our terms.' },
  { icon: PhoneIcon, title: 'A smartphone', text: 'iPhone with iOS 15 or later, or Android 9 or later, with Bluetooth and location on.' },
  { icon: WalletIcon, title: 'A way to pay', text: 'MTN MoMo, Telecel Cash, AT Money or a Visa or Mastercard debit card.' },
  { icon: GraduationIcon, title: 'A university email', text: 'Only needed for student pricing. Staff and visitors can ride without one.' },
];

const audiences = [
  {
    title: 'Students',
    text: 'Verify your university email once.',
    points: ['Pay as you go, Day Pass or Semester Pass', 'Split the Semester Pass into two payments', 'Free helmet with a Semester Pass'],
    dark: true,
  },
  {
    title: 'Staff, visitors and neighbours',
    text: 'No university email needed.',
    points: ['Pay as you go or Day Pass', 'Ride on every Yenko campus', 'Group pricing through Partnerships'],
    dark: false,
  },
];

export default function HowToJoin() {
  useDocumentTitle('How to join', 'Sign up for Yenko in minutes: download the app, verify your student email and add a way to pay.');

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Join Yenko in five minutes."
        intro="All you need is your phone. Students get extra perks after a quick email check."
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

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Steps steps={steps} />
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="What you need" title="Before you sign up." />
        <div className="mt-12">
          <FeatureGrid features={requirements} columns={4} cardTone="white" />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Who can ride" title="Yenko is for everyone on campus." />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {audiences.map((audience) => (
            <div key={audience.title} className={audience.dark ? 'rounded-4xl bg-surface-sunken p-8 text-white ring-1 ring-inset ring-brand sm:p-10' : 'rounded-4xl bg-surface-muted p-8 sm:p-10'}>
              <h3 className="text-display-md font-bold">{audience.title}</h3>
              <p className={audience.dark ? 'mt-2 text-white/70' : 'mt-2 text-ink-muted'}>{audience.text}</p>
              <ul className="mt-8 space-y-3">
                {audience.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <CheckIcon className={audience.dark ? 'shrink-0 text-brand' : 'shrink-0'} strokeWidth={2.25} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SplitFeature
          image={media.students}
          eyebrow="Not on a Yenko campus yet?"
          title="Help us choose where to go next."
          actions={
            <>
              <Button to="/download#get-the-app" variant="dark">
                Join the waitlist
              </Button>
              <Button to="/careers" variant="ghost">
                Become a campus ambassador
              </Button>
            </>
          }
        >
          <p>Every waitlist sign-up tells us where students want Yenko. The more people from your campus join, the sooner we can make the case to your university.</p>
        </SplitFeature>
      </Section>

      <CtaBanner />
    </>
  );
}
