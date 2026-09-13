import Section from '@/components/ui/Section';
import StoreButtons from '@/components/ui/StoreButtons';
import PhoneMockup from './PhoneMockup';

type CtaBannerProps = {
  title?: string;
  text?: string;
  screen?: 'map' | 'ride' | 'pass';
};

export default function CtaBanner({
  title = 'Your next ride is a tap away.',
  text = 'Download the Yenko app, verify your student email and unlock your first e-bike in under two minutes.',
  screen = 'map',
}: CtaBannerProps) {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-5xl bg-brand px-6 text-onbrand py-12 sm:px-12 sm:py-16 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10">
            <h2 className="max-w-lg text-display-lg font-bold">{title}</h2>
            <p className="mt-5 max-w-md text-lg text-onbrand/75">{text}</p>
            <StoreButtons tone="light" className="mt-8" />
          </div>
          <div className="relative hidden h-80 lg:block">
            <PhoneMockup screen={screen} className="absolute -bottom-56 right-10 rotate-[-6deg]" />
          </div>
        </div>
      </div>
    </Section>
  );
}
