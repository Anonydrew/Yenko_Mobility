import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import Steps from '@/components/sections/Steps';
import Button from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { media } from '@/content/media';
import { safetyTips, weatherTips } from '@/content/safety';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const incidentSteps = [
  { title: 'Get safe', text: 'Move yourself and the bike out of the road if you can do so safely.' },
  { title: 'Call for help', text: 'If anyone is hurt, call 112 or hold the emergency button in the app to alert campus security.' },
  { title: 'Report it', text: 'Report the incident in the app, even if no one was hurt. We’ll end your ride and follow up.' },
];

export default function SafetyTips() {
  useDocumentTitle('Safety tips', 'Simple habits that make every Yenko ride safer, day and night.');

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Safety tips for every ride."
        intro="The riders who stay safe aren’t always the most skilled. They just have good habits. Here are the ones that matter most."
        image={media.riders}
      />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <FeatureGrid features={safetyTips} />
      </Section>

      <Section tone="muted">
        <SplitFeature
          image={media.night}
          eyebrow="After dark"
          title="Riding at night."
          bullets={[
            'Wear something light or reflective',
            'Turn on the Well-lit routes layer in the app',
            'Ride slower: potholes are harder to see',
            'Use Share my ride so a friend knows you got home',
          ]}
        >
          <p>Almost a third of Yenko rides start after 6 pm. Lights switch on automatically, but being seen from the side matters just as much.</p>
        </SplitFeature>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Weather" title="Rain or shine." intro="Ghana’s weather changes fast. A few adjustments keep you safe in both." />
          </div>
          <ul className="grid gap-3 lg:col-span-7">
            {weatherTips.map((tip) => (
              <li key={tip} className="flex gap-4 rounded-2xl bg-surface-muted p-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-onbrand">
                  <CheckIcon width={14} height={14} strokeWidth={2.5} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="If something goes wrong" title="What to do after an accident." />
        <div className="mt-12">
          <Steps steps={incidentSteps} columns={3} cardTone="white" />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-8 rounded-5xl border border-line bg-surface-muted p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-display-md font-bold">Want the full rules?</h2>
            <p className="mt-3 max-w-xl text-white/70">Our Safety Guidelines set out exactly what’s expected of every rider, and how we enforce it.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/safety-guidelines">Read the guidelines</Button>
            <Button to="/blog" variant="secondary">
              Safety stories on the blog
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
