import PageHero from '@/components/sections/PageHero';
import StatsBand from '@/components/sections/StatsBand';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { values } from '@/content/careers';
import { liveCampuses, totalBikes } from '@/content/locations';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const milestones = [
  { date: '2024', title: 'Yenko is founded in Accra', text: 'Started by students who were tired of long walks and longer taxi queues between lectures.' },
  { date: 'March 2025', title: 'A 40-bike pilot at Legon', text: 'We tested off-the-shelf e-bikes on campus hills and learned what students really need.' },
  { date: 'September 2025', title: 'Full launch at the University of Ghana', text: 'Our first full fleet and parking zones go live across Legon.' },
  { date: 'March 2026', title: 'Solar canopy at the Legon hub', text: '42 panels now cover around a third of our charging.' },
  { date: 'July 2026', title: '100,000 rides', text: 'The 100,000th ride starts outside Volta Hall at 7:42 am.' },
  { date: 'August 2026', title: 'KNUST launches', text: '150 e-bikes and 24 parking zones across Kumasi’s biggest campus.' },
  { date: 'September 2026', title: 'UCC and the Yenko E1', text: 'Cape Coast goes live, and our own e-bike design rolls out across the fleet.' },
];

const teams = [
  { name: 'Operations', text: 'Field technicians and battery swappers who keep every bike ready by sunrise.' },
  { name: 'Rider support', text: 'A 24/7 team answering chats in English and Twi.' },
  { name: 'Product and engineering', text: 'The people behind the app, the smart lock and our fleet software.' },
  { name: 'Partnerships', text: 'Working with universities, SRCs, hostels and local businesses.' },
];

export default function About() {
  useDocumentTitle('About Yenko', 'Yenko Mobility builds clean, affordable e-bike transport for university campuses in Ghana.');

  return (
    <>
      <PageHero
        eyebrow="Company"
        title="We’re Yenko. Let’s go."
        intro="“Yenko” means “let’s go” in Twi. We started with a simple idea: getting around campus should be quick, affordable and clean for every student."
        image={media.students}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our story" title="Built by students, for students." />
          </div>
          <div className="space-y-5 text-lg text-ink-soft lg:col-span-7">
            <p>
              On big Ghanaian campuses, the walk between a hostel and a lecture hall can take half an hour in the heat. Shuttles are packed at peak times and taxis
              add up fast on a student budget.
            </p>
            <p>
              Yenko was founded in 2024 to fix that. We ran a small pilot at Legon, listened to hundreds of riders and designed our own e-bike for campus hills,
              heavy bags and patchy mobile networks.
            </p>
            <p>
              Today, {totalBikes} Yenko e-bikes run across {liveCampuses.length} campuses, maintained by a local team who care about every detail, from a clean
              saddle to a clear wheelchair ramp.
            </p>
          </div>
        </div>
      </Section>

      <StatsBand
        eyebrow="Yenko in numbers"
        title="Growing, one campus at a time."
        stats={[
          { value: '100,000+', label: 'rides taken' },
          { value: '14,200', label: 'riders' },
          { value: String(liveCampuses.length), label: 'campuses live' },
          { value: '60+', label: 'people on the team' },
        ]}
      />

      <Section tone="muted">
        <SectionHeading eyebrow="Milestones" title="How we got here." />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <li key={milestone.title} className="rounded-3xl bg-surface-sunken p-7">
              <p className="text-sm font-medium text-ink-muted">{milestone.date}</p>
              <h3 className="mt-3 text-xl font-medium tracking-tight">{milestone.title}</h3>
              <p className="mt-2 text-ink-muted">{milestone.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="What we believe" title="Our values." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <li key={value.title} className="rounded-3xl bg-surface-muted p-7">
              <span className="text-display-md font-bold text-ink-subtle">0{index + 1}</span>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{value.title}</h3>
              <p className="mt-2 text-ink-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="The team" title="More than 60 people across three campuses." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team) => (
            <li key={team.name} className="rounded-3xl bg-surface-sunken p-7">
              <h3 className="text-xl font-medium tracking-tight">{team.name}</h3>
              <p className="mt-2 text-ink-muted">{team.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/careers" variant="dark">
            Join the team
          </Button>
          <Button to="/mission" variant="secondary">
            Read our mission
          </Button>
        </div>
      </Section>
    </>
  );
}
