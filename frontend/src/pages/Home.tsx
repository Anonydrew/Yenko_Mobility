import { Link } from 'react-router-dom';
import BlogTeaser from '@/components/sections/BlogTeaser';
import CampusGrid from '@/components/sections/CampusGrid';
import CtaBanner from '@/components/sections/CtaBanner';
import HomeServices from '@/components/sections/HomeServices';
import HowItWorksCarousel from '@/components/sections/HowItWorksCarousel';
import SplitFeature from '@/components/sections/SplitFeature';
import StatsBand from '@/components/sections/StatsBand';
import SuperAppHero from '@/components/sections/SuperAppHero';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { totalBikes, totalZones } from '@/content/locations';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function Home() {
  useDocumentTitle();

  return (
    <>
      <SuperAppHero />

      {/* Services and How it works share a white band */}
      <div className="bg-white py-8 text-onbrand sm:py-12">
        <HomeServices />
        <HowItWorksCarousel />
      </div>

      <StatsBand
        eyebrow="Yenko so far"
        title="Small trips, adding up."
        stats={[
          { value: '100,000+', label: 'rides taken' },
          { value: String(totalBikes), label: 'e-bikes on campus' },
          { value: String(totalZones), label: 'parking zones' },
          { value: '16.7 t', label: 'net CO₂ avoided' },
        ]}
        note={
          <Link to="/sustainability" className="text-white underline underline-offset-4">
            How we measure our impact
          </Link>
        }
      />

      {/* Campuses */}
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading
          eyebrow="Campus e-bikes"
          title="Find Yenko at your university."
          action={
            <Button to="/locations" variant="secondary">
              All campuses
            </Button>
          }
        />
        <div className="mt-12">
          <CampusGrid />
        </div>
      </Section>

      {/* Safety */}
      <Section>
        <SplitFeature
          image={media.riders}
          eyebrow="Safety"
          title="Every trip, looked after."
          bullets={[
            'Vehicles checked by our field team every night',
            'Verified drivers and riders on every service',
            'Emergency button and live trip sharing in the app',
            'A free helmet with every Semester Pass',
          ]}
          actions={
            <>
              <Button to="/safety" variant="dark">
                Safety tips
              </Button>
              <Button to="/safety-guidelines" variant="ghost">
                Read our guidelines
              </Button>
            </>
          }
        >
          <p>We design every part of Yenko around one question: would we be happy for our own families to use it?</p>
        </SplitFeature>
      </Section>

      {/* Grow with us */}
      <Section>
        <SectionHeading eyebrow="Work with Yenko" title="Grow with us." />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Link to="/services/business" className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface-muted">
            <span className="block aspect-[16/9] overflow-hidden">
              <img src={media.students.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </span>
            <span className="flex flex-1 flex-col p-8 sm:p-10">
              <span className="text-display-md font-bold">Franchise with Yenko for Business</span>
              <span className="mt-3 max-w-lg text-ink-muted">Run Yenko in your city or campus with our brand, app, fleet financing and training.</span>
              <span className="mt-8 inline-flex items-center gap-2 font-medium text-brand">
                Explore Yenko for Business <ArrowOutward />
              </span>
            </span>
          </Link>
          <Link to="/services/corporate" className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface-muted">
            <span className="block aspect-[16/9] overflow-hidden">
              <img src={media.workshop.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </span>
            <span className="flex flex-1 flex-col p-8 sm:p-10">
              <span className="text-display-md font-bold">Move your team with Yenko Corporate</span>
              <span className="mt-3 max-w-lg text-ink-muted">Staff rides, shuttles and deliveries on one company account with a single monthly invoice.</span>
              <span className="mt-8 inline-flex items-center gap-2 font-medium">
                Explore Yenko Corporate <ArrowOutward />
              </span>
            </span>
          </Link>
        </div>
      </Section>

      <BlogTeaser />

      <CtaBanner />
    </>
  );
}
