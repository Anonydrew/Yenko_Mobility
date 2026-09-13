import ContactForm from '@/components/sections/ContactForm';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import PhoneMockup from '@/components/sections/PhoneMockup';
import Steps from '@/components/sections/Steps';
import Button from '@/components/ui/Button';
import { GraduationIcon, LockIcon, MapPinIcon, RouteIcon, ShieldIcon, WalletIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const appFeatures = [
  { icon: MapPinIcon, title: 'Live map', text: 'See every available bike near you and how much battery it has.' },
  { icon: LockIcon, title: 'Scan to unlock', text: 'Point your camera at the QR code and you’re riding in seconds.' },
  { icon: WalletIcon, title: 'Pay with MoMo', text: 'MTN MoMo, Telecel Cash, AT Money or a debit card.' },
  { icon: GraduationIcon, title: 'Student pricing', text: 'Verify your university email once to unlock the Semester Pass.' },
  { icon: ShieldIcon, title: 'Safety tools', text: 'Share your ride live with a friend or reach help with one tap.' },
  { icon: RouteIcon, title: 'Ride history', text: 'Trips, receipts and the CO₂ you’ve saved, all in one place.' },
];

const steps = [
  { title: 'Get the app', text: 'Download Yenko for iPhone or Android.' },
  { title: 'Sign up', text: 'Create an account with your phone number.' },
  { title: 'Verify and pay', text: 'Add your student email for student pricing and choose how to pay.' },
  { title: 'Unlock a bike', text: 'Find the nearest bike on the map and scan to ride.' },
];

export default function Download() {
  useDocumentTitle('Download the app', 'Get the Yenko app to find, unlock and pay for campus e-bikes from your phone.');

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="The whole ride, in your pocket."
        intro="Find a bike, unlock it, pay and park, all from the Yenko app. App Store and Google Play links are coming to this page soon. Join the waitlist and we’ll send them straight to you."
        actions={
          <>
            <Button to="#get-the-app" size="lg">
              Get the download link
            </Button>
            <Button to="/how-it-works" size="lg" variant="secondary">
              How it works
            </Button>
          </>
        }
        aside={
          <div className="relative h-[28rem] overflow-hidden rounded-5xl bg-brand sm:h-[32rem]">
            <PhoneMockup className="absolute left-[8%] top-12 hidden -rotate-6 sm:block" screen="ride" />
            <PhoneMockup className="absolute right-[8%] top-20 rotate-3 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:rotate-0" />
          </div>
        }
      />

      <Section id="get-the-app" tone="muted">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Waitlist"
              title="Get the download link first."
              intro="Leave your details and we’ll email you the App Store and Google Play links as soon as they’re live, plus a free first ride."
            />
          </div>
          <div className="rounded-4xl bg-surface-sunken p-6 sm:p-10 lg:col-span-7">
            <ContactForm variant="waitlist" />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="In the app" title="Everything you need for a smooth ride." />
        <div className="mt-12">
          <FeatureGrid features={appFeatures} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Getting started" title="Riding in under two minutes." />
        <div className="mt-12">
          <Steps steps={steps} cardTone="white" />
        </div>
      </Section>
    </>
  );
}
