import CampusGrid from '@/components/sections/CampusGrid';
import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import SplitFeature from '@/components/sections/SplitFeature';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import { liveCampuses, totalBikes, totalZones } from '@/content/locations';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function Locations() {
  const intro = `Yenko is live on ${liveCampuses.length} campuses, with ${totalBikes} e-bikes and ${totalZones} parking zones. More are on the way.`;
  useDocumentTitle('Campus locations', intro);

  return (
    <>
      <PageHero eyebrow="Products" title="Campus locations" intro={intro} image={media.campus} />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <CampusGrid />
      </Section>

      <Section tone="muted">
        <SplitFeature
          image={media.students}
          eyebrow="Your campus next?"
          title="Want Yenko at your university?"
          actions={
            <>
              <Button to="/partnerships" variant="dark">
                Bring Yenko to your campus
              </Button>
              <Button to="/download#get-the-app" variant="ghost">
                Join the waitlist
              </Button>
            </>
          }
        >
          <p>
            We choose new campuses based on demand from students and support from the university. If you work at a university or lead your SRC, talk to our
            partnerships team. If you’re a student, join the waitlist and tell your friends to do the same.
          </p>
        </SplitFeature>
      </Section>

      <CtaBanner />
    </>
  );
}
