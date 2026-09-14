import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DownloadSection, ImagePair, IntroColumns, LatestUpdates, StatCards } from '@/components/company/CompanyBlocks';
import { Carousel, ExploreSection, TimelineCarousel, type TimelineItem } from '@/components/company/CompanyCarousel';
import { CompanyHero, CompanyPage, CompanySection } from '@/components/company/CompanyLayout';
import { darkButton, muted, sliderButton, underlineLink } from '@/components/company/styles';
import ArrowOutward from '@/components/ui/ArrowOutward';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';
import { liveCampuses, totalBikes } from '@/content/locations';
import { media, type MediaImage } from '@/content/media';
import { cx } from '@/lib/cx';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

// Layout modelled on bolt.eu/company.

const stats = [
  { value: '100,000+', label: 'Rides taken', note: 'Since our full launch in 2025' },
  { value: '14,200', label: 'Riders', note: 'Students, staff and commuters' },
  { value: String(liveCampuses.length), label: 'Campuses live', note: 'With more on the way' },
  { value: String(totalBikes), label: 'E-bikes on the road', note: 'Checked by our field team every night' },
  { value: '16.7 t', label: 'Net CO₂ avoided', note: 'And counting' },
  { value: '60+', label: 'People on the team', note: 'In Accra, Kumasi and Cape Coast' },
];

const history: TimelineItem[] = [
  { kind: 'text', label: '2024', title: 'Yenko is founded in Accra', text: 'Started by students who were tired of long walks and longer taxi queues between lectures.' },
  { kind: 'image', image: media.students },
  { kind: 'text', label: 'March 2025', title: 'A 40-bike pilot at Legon', text: 'We tested off-the-shelf e-bikes on campus hills and learned what students really need.' },
  { kind: 'text', label: 'September 2025', title: 'Full launch at the University of Ghana', text: 'Our first full fleet and parking zones go live across Legon.' },
  { kind: 'image', image: media.solar },
  { kind: 'text', label: 'March 2026', title: 'Solar canopy at the Legon hub', text: '42 panels now cover around a third of our charging.' },
  { kind: 'text', label: 'July 2026', title: '100,000 rides', text: 'The 100,000th ride starts outside Volta Hall at 7:42 am.' },
  { kind: 'image', image: media.eBike },
  { kind: 'text', label: 'August 2026', title: 'KNUST launches', text: '150 e-bikes and 24 parking zones across Kumasi’s biggest campus.' },
  {
    kind: 'text',
    label: 'September 2026',
    title: 'UCC, the Yenko E1 and new services',
    text: 'Cape Coast goes live, our own e-bike rolls out, and shared rides, delivery and rent-to-own join the app.',
  },
];

type RideCard = { title: string; text: string; image: MediaImage; action: { label: string; to: string; style: 'button' | 'link' } };

const rideCards: RideCard[] = [
  {
    title: 'Campus e-bikes',
    text: 'While others wait for the shuttle, you’re already at your lecture. Unlock a bike from GH₵ 2.',
    image: media.eBike,
    action: { label: 'Find a bike', to: '/locations', style: 'button' },
  },
  {
    title: 'Why wait when you can ride?',
    text: 'More than 100,000 Yenko rides have been taken so far: hostel to lecture, lecture to library, home to work.',
    image: media.night,
    action: { label: 'See our impact', to: '/sustainability', style: 'link' },
  },
  {
    title: 'Shared rides',
    text: 'Heading across the city? Share the ride with people going your way and split the cost.',
    image: media.hero,
    action: { label: 'Book a shared ride', to: '/services/shared-rides', style: 'button' },
  },
  {
    title: 'Cleaner every kilometre',
    text: 'Electric by default. Yenko riders have avoided a net 16.7 tonnes of CO₂ so far.',
    image: media.solar,
    action: { label: 'How we measure it', to: '/sustainability', style: 'link' },
  },
  {
    title: 'Delivery',
    text: 'Parcels and food across campus and the city, delivered by e-bike on the same day.',
    image: media.fleet,
    action: { label: 'Send a parcel', to: '/services/delivery', style: 'button' },
  },
  {
    title: 'Rent to own',
    text: 'Stop paying for rides and start paying off your own e-bike, with servicing included.',
    image: media.workshop,
    action: { label: 'Own an e-bike', to: '/services/rent-to-own', style: 'button' },
  },
];

export default function About() {
  useDocumentTitle(
    'About Yenko',
    'Yenko Mobility is a shared Ghanaian mobility company with campus e-bikes, shared rides, delivery, rent-to-own e-bikes, corporate plans and franchising.',
  );

  return (
    <CompanyPage
      hero={
        <CompanyHero
          title="About Yenko"
          intro="We are a shared transportation company in Ghana, making everyday travel more accessible while providing a sustainable transportation option for everyone. Launched in 2023."
        />
      }
    >
      <CompanySection>
        <IntroColumns lead="Yenko has more than 60 people, with teams based in Accra, Kumasi and Cape Coast, and a field crew on every campus we serve.">
          <p>
            The Yenko app connects students, commuters and businesses to clean, affordable transport and delivery, while creating local jobs for technicians,
            riders, couriers and franchise partners.
          </p>
        </IntroColumns>
        <StatCards stats={stats} />
      </CompanySection>

      <CompanySection
        title="Core service"
        intro="From campus e-bikes to shared rides and same-day delivery, every Yenko service is built to make short trips quicker, cheaper and cleaner than a taxi."
      >
        <ServicesSlider />
      </CompanySection>

      <CompanySection
        wide
        eyebrow="2023–present"
        title="Our story"
        intro="Yenko was founded in Accra in 2024 by students who were tired of long walks in the heat and packed shuttles between lectures. After a 40-bike pilot at Legon, we designed our own e-bike for campus hills and heavy bags, and grew from one campus to a multi-service mobility company."
      >
        <TimelineCarousel label="Milestones" itemLabel="milestone" items={history} />
      </CompanySection>

      <CompanySection title="Our mission">
        <div className="mt-8 grid gap-8 text-lg leading-relaxed md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-semibold">We’re making getting around quick, affordable and clean, starting with every campus in Ghana.</p>
            <Link to="/mission" className={cx(underlineLink, 'mt-4')}>
              Our mission
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
          <p className={muted}>
            Time spent walking in the heat or waiting for a shuttle is time taken from studying, working and living. Yenko gives it back with electric vehicles
            that are there when you need them.
          </p>
          <p className={muted}>
            Every Yenko trip replaces a car or taxi journey, lowers emissions and keeps money in local hands, through local jobs and local franchise partners.
          </p>
        </div>
        <ImagePair images={[media.campus, media.riders]} />
      </CompanySection>

      <ExploreSection current="/about" />

      <LatestUpdates />

      <CompanySection
        wide
        title="Riding beats waiting"
        intro="Taxis add up fast and shuttles don’t wait for you. With Yenko you only pay when you move, with no car, fuel or parking to worry about. That’s why thousands of students and commuters choose to ride."
        note="Services and prices vary by city and campus. Open the Yenko app to see what’s available near you."
        actions={
          <Link to="/how-it-works" className={darkButton}>
            Learn how it works
          </Link>
        }
      >
        <Carousel label="Ways to ride" itemLabel="card" items={rideCards} itemKey={(card) => card.title} itemClassName={() => 'flex flex-col'}>
          {(card) => (
            <>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#F6F7F5]">
                <img src={card.image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight">{card.title}</h3>
              <p className={cx('mt-3 leading-relaxed', muted)}>{card.text}</p>
              <Link to={card.action.to} className={cx(card.action.style === 'button' ? darkButton : underlineLink, 'mt-5 self-start')}>
                {card.action.label}
              </Link>
            </>
          )}
        </Carousel>
      </CompanySection>

      <DownloadSection />
    </CompanyPage>
  );
}

const coreServices: { name: string; text: string; image: MediaImage; to: string }[] = [
  {
    name: 'Shared E-Bicycle Rentals',
    text: 'Provides shared electric e-bicycles for universities and communities, making everyday travel easier and more accessible.',
    image: media.eBike,
    to: '/products/e-bikes',
  },
  {
    name: 'Last-Mile Delivery',
    text: 'Operates a last-mile delivery service using e-bicycles for businesses, individuals, and delivery riders.',
    image: media.fleet,
    to: '/services/delivery',
  },
  {
    name: 'Eco-Friendly Jobs',
    text: 'Creates sustainable income opportunities through e-bicycle rentals and delivery services.',
    image: media.workshop,
    to: '/careers',
  },
  {
    name: 'E-Mobility Infrastructure',
    text: 'Provides charging and parking solutions to support shared electric transportation in communities and institutions.',
    image: media.parking,
    to: '/partnerships',
  },
  {
    name: 'Corporate Mobility',
    text: 'Offers flexible e-bicycle transportation solutions for businesses, employees, and organizations.',
    image: media.riders,
    to: '/services/corporate',
  },
  {
    name: 'Sustainable Urban Mobility',
    text: 'Promotes cleaner, more affordable transportation options that help reduce reliance on fuel-powered vehicles.',
    image: media.solar,
    to: '/sustainability',
  },
];

function ServicesSlider() {
  const [index, setIndex] = useState(0);
  const current = coreServices[index];
  const count = coreServices.length;
  const move = (direction: 1 | -1) => setIndex((value) => (value + direction + count) % count);

  return (
    <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F7F5]">
          {coreServices.map((service, i) => (
            <img
              key={service.name}
              src={service.image.src}
              alt={i === index ? service.image.alt : ''}
              aria-hidden={i !== index}
              loading="lazy"
              className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-500', i === index ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <button type="button" className={sliderButton} onClick={() => move(-1)} aria-label="Previous service">
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose a service">
            {coreServices.map((service, i) => (
              <button
                key={service.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${service.name}`}
                aria-current={i === index}
                className={cx('h-2 rounded-full transition-all', i === index ? 'w-6 bg-onbrand' : 'w-2 bg-black/15 hover:bg-black/30')}
              />
            ))}
          </div>
          <button type="button" className={sliderButton} onClick={() => move(1)} aria-label="Next service">
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </div>

      <div key={current.name} aria-live="polite" className="animate-fade-in">
        <p className={cx('text-sm font-medium', muted)}>
          {index + 1} / {count}
        </p>
        <h3 className="mt-3 text-display-md font-bold">{current.name}</h3>
        <p className={cx('mt-5 text-lg leading-relaxed', muted)}>{current.text}</p>
        <Link to={current.to} className={cx(darkButton, 'mt-8')}>
          Learn more <ArrowOutward />
        </Link>
      </div>
    </div>
  );
}
