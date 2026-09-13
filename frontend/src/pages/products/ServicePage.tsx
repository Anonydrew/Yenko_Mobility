import { useParams } from 'react-router-dom';
import CtaBanner from '@/components/sections/CtaBanner';
import FeatureGrid from '@/components/sections/FeatureGrid';
import PageHero from '@/components/sections/PageHero';
import ServiceGrid from '@/components/sections/ServiceGrid';
import SplitFeature from '@/components/sections/SplitFeature';
import Steps from '@/components/sections/Steps';
import Accordion from '@/components/ui/Accordion';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { services } from '@/content/services';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import NotFound from '../NotFound';

/** One template for every Yenko service page (/services/:slug). Content lives in content/services.ts. */
export default function ServicePage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  useDocumentTitle(service?.name ?? 'Page not found', service?.summary);

  if (!service) return <NotFound />;

  return (
    <>
      <PageHero
        eyebrow={`Products · ${service.name}`}
        title={service.heroTitle}
        intro={
          <>
            <p>{service.heroIntro}</p>
            <p className="mt-6 inline-flex rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink">{service.priceFrom}</p>
          </>
        }
        image={service.image}
        actions={
          <>
            <Button to={service.primaryCta.to} size="lg">
              {service.primaryCta.label} <ArrowOutward />
            </Button>
            <Button to={`/pricing?tab=${service.pricingTab}`} size="lg" variant="secondary">
              See pricing
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading eyebrow={service.tagline} title={`What you get with ${service.name}.`} />
        <div className="mt-12">
          <FeatureGrid features={service.features} columns={4} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="Simple from start to finish." />
        <div className="mt-12">
          <Steps steps={service.steps} />
        </div>
      </Section>

      {service.checklist && (
        <Section>
          <SplitFeature image={service.checklist.image} eyebrow={service.checklist.eyebrow} title={service.checklist.title} bullets={service.checklist.items}>
            <p>{service.checklist.text}</p>
          </SplitFeature>
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQs" title="Good to know." />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={service.faqs} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="More from Yenko" title="Explore our other services." />
        <ServiceGrid excludeKey={service.slug} />
      </Section>

      <CtaBanner />
    </>
  );
}
