import ContactForm from '@/components/sections/ContactForm';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import Steps from '@/components/sections/Steps';
import Button from '@/components/ui/Button';
import { BuildingIcon, GraduationIcon, SparkIcon, UsersIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const partnerTypes = [
  { icon: GraduationIcon, title: 'Universities', text: 'A fully managed e-bike fleet, parking zones agreed with your estates team and data to plan campus transport.' },
  { icon: BuildingIcon, title: 'Hostels and landlords', text: 'Dedicated parking zones at your property, a selling point that helps fill rooms.' },
  { icon: UsersIcon, title: 'Businesses and employers', text: 'Group passes for staff and interns, and branded zones outside your shop or office.' },
  { icon: SparkIcon, title: 'SRCs and student groups', text: 'Discounted passes for members, event partnerships and a direct line to our team.' },
];

const process = [
  { title: 'Talk to us', text: 'Tell us about your community and the journeys people make every day.' },
  { title: 'Plan together', text: 'We survey the site and propose parking zones, fleet size and pricing.' },
  { title: 'Pilot', text: 'An eight-week pilot with a small fleet, with weekly reports on usage and safety.' },
  { title: 'Launch and grow', text: 'We scale the fleet to demand and keep improving with your feedback.' },
];

export default function Partnerships() {
  useDocumentTitle('Partnerships', 'Partner with Yenko to bring shared e-bikes to your university, hostel or business.');

  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Let’s bring Yenko to your community."
        intro="We work with universities, property owners and businesses to give people a better way to get around, at no upfront cost to our partners."
        image={media.campus}
        actions={
          <Button to="#enquire" size="lg" variant="dark">
            Start a conversation
          </Button>
        }
      />

      <Section>
        <SectionHeading eyebrow="Who we work with" title="Partnerships that work for everyone." />
        <div className="mt-12">
          <FeatureGrid features={partnerTypes} columns={4} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="How it works" title="From first call to launch." />
        <div className="mt-12">
          <Steps steps={process} cardTone="white" />
        </div>
      </Section>

      <Section>
        <SplitFeature
          image={media.fleet}
          eyebrow="What you get"
          title="A fully managed service."
          bullets={[
            'No upfront cost for the fleet, charging or maintenance',
            'Parking zones designed around your rules and accessibility needs',
            'A monthly dashboard of rides, safety and CO₂ avoided',
            'Group pricing and branded zones where it makes sense',
          ]}
        >
          <p>We own, charge, repair and insure the bikes. Our local team handles support around the clock, so your staff don’t have to.</p>
        </SplitFeature>
      </Section>

      <Section id="enquire" tone="muted">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Get in touch"
              title="Tell us about your community."
              intro="Our partnerships team will reply within two working days to arrange a call."
            />
          </div>
          <div className="rounded-4xl bg-surface-sunken p-6 sm:p-10 lg:col-span-7">
            <ContactForm defaultTopic="partnerships" />
          </div>
        </div>
      </Section>
    </>
  );
}
