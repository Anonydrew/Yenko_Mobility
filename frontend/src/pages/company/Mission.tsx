import { Link } from 'react-router-dom';
import { DownloadSection, ImagePair, IntroColumns, SplitSection, StatCards, TextCards } from '@/components/company/CompanyBlocks';
import { ExploreSection } from '@/components/company/CompanyCarousel';
import { CompanyHero, CompanyPage, CompanySection } from '@/components/company/CompanyLayout';
import { darkButton, lightButton } from '@/components/company/styles';
import { LeafIcon, MapPinIcon, ShieldIcon, WalletIcon } from '@/components/ui/icons';
import { media } from '@/content/media';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const pillars = [
  { icon: WalletIcon, title: 'Affordable', text: 'A ride should cost less than the snack you buy on the way. Our prices are set with student budgets in mind.' },
  { icon: LeafIcon, title: 'Clean', text: 'Electric bikes, swappable batteries and solar charging, so every short trip cuts emissions instead of adding them.' },
  { icon: ShieldIcon, title: 'Safe', text: 'Well-maintained bikes, sensible speed limits and real people ready to help at any hour.' },
  { icon: MapPinIcon, title: 'Local', text: 'Designed for Ghanaian campuses, run by Ghanaian teams and repaired close to where you ride.' },
];

const goals = [
  { value: '10', label: 'Campuses across West Africa' },
  { value: '1 million', label: 'Rides every year' },
  { value: '100%', label: 'Charging from renewable sources' },
  { value: '500', label: 'Local jobs' },
];

export default function Mission() {
  useDocumentTitle('Our mission', 'Our mission is to give everyone a quick, affordable and clean way to get around, starting with every campus in Ghana.');

  return (
    <CompanyPage
      hero={
        <CompanyHero
          eyebrow="Our mission"
          title="Every student deserves an easy, affordable and clean way to get around."
          intro="Time spent walking in the heat or waiting for a shuttle is time taken from studying, sleeping and living. We’re here to give it back."
        />
      }
    >
      <CompanySection>
        <IntroColumns lead="We’re making getting around quick, affordable and clean, starting with every campus in Ghana.">
          <p>Every Yenko trip replaces a car or taxi journey, lowers emissions and keeps money in local hands, through local jobs and local franchise partners.</p>
        </IntroColumns>
        <ImagePair images={[media.campus, media.riders]} />
      </CompanySection>

      <CompanySection eyebrow="What guides us" title="Four promises to every rider.">
        <TextCards items={pillars} />
      </CompanySection>

      <SplitSection image={media.campus} eyebrow="Why campuses first?" title="Where short trips matter most.">
        <p>
          Universities are small cities with thousands of short, daily journeys: hostel to lecture, lecture to library, library to the market. They’re perfect for
          e-bikes.
        </p>
        <p>
          Working closely with each university means we can plan safe parking zones, respect campus rules and prove what shared electric transport can do, before
          expanding into the surrounding community.
        </p>
      </SplitSection>

      <CompanySection
        eyebrow="Where we’re heading"
        title="Our goals for 2030."
        actions={
          <>
            <Link to="/sustainability" className={darkButton}>
              Our sustainability impact
            </Link>
            <Link to="/about" className={lightButton}>
              About Yenko
            </Link>
          </>
        }
      >
        <StatCards stats={goals} columns={4} />
      </CompanySection>

      <ExploreSection current="/mission" />

      <DownloadSection />
    </CompanyPage>
  );
}
