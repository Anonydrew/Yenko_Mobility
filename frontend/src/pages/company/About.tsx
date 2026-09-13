import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PhoneMockup from '@/components/sections/PhoneMockup';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Container from '@/components/ui/Container';
import { ArrowLeftIcon, ArrowRightIcon, BikeIcon } from '@/components/ui/icons';
import StoreButtons from '@/components/ui/StoreButtons';
import { liveCampuses, totalBikes } from '@/content/locations';
import { media, type MediaImage } from '@/content/media';
import { serviceCards } from '@/content/services';
import { listPosts } from '@/lib/blogApi';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import { useCarousel } from '@/lib/useCarousel';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

// Layout modelled on bolt.eu/company, on a white page.

const muted = 'text-[#5C605F]';
const card = 'border border-black/[0.08] bg-[#F6F7F5]';
const darkButton = 'inline-flex h-12 items-center gap-2 rounded-full bg-onbrand px-6 font-medium text-white transition-colors hover:bg-[#2A2D2D]';
const lightButton = 'inline-flex h-12 items-center gap-2 rounded-full bg-[#EEF0EE] px-6 font-medium text-onbrand transition-colors hover:bg-[#E2E5E2]';
const track =
  'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 scroll-px-5 sm:px-8 sm:scroll-px-8 lg:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]';
const slide = 'w-[80vw] shrink-0 snap-start sm:w-[calc((100vw-5rem)/2.3)] lg:w-[calc((min(100vw,84rem)-5rem-2rem)/3.3)]';

const companyLinks = [
  { to: '/about', label: 'About Yenko' },
  { to: '/mission', label: 'Mission' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/careers', label: 'Careers' },
  { to: '/partnerships', label: 'Partnerships' },
];

const stats = [
  { value: '100,000+', label: 'Rides taken', note: 'Since our full launch in 2025' },
  { value: '14,200', label: 'Riders', note: 'Students, staff and commuters' },
  { value: String(liveCampuses.length), label: 'Campuses live', note: 'With more on the way' },
  { value: String(totalBikes), label: 'E-bikes on the road', note: 'Checked by our field team every night' },
  { value: '16.7 t', label: 'Net CO₂ avoided', note: 'And counting' },
  { value: '60+', label: 'People on the team', note: 'In Accra, Kumasi and Cape Coast' },
];

type HistoryItem = { kind: 'milestone'; date: string; title: string; text: string } | { kind: 'image'; image: MediaImage };

const history: HistoryItem[] = [
  { kind: 'milestone', date: '2024', title: 'Yenko is founded in Accra', text: 'Started by students who were tired of long walks and longer taxi queues between lectures.' },
  { kind: 'image', image: media.students },
  { kind: 'milestone', date: 'March 2025', title: 'A 40-bike pilot at Legon', text: 'We tested off-the-shelf e-bikes on campus hills and learned what students really need.' },
  { kind: 'milestone', date: 'September 2025', title: 'Full launch at the University of Ghana', text: 'Our first full fleet and parking zones go live across Legon.' },
  { kind: 'image', image: media.solar },
  { kind: 'milestone', date: 'March 2026', title: 'Solar canopy at the Legon hub', text: '42 panels now cover around a third of our charging.' },
  { kind: 'milestone', date: 'July 2026', title: '100,000 rides', text: 'The 100,000th ride starts outside Volta Hall at 7:42 am.' },
  { kind: 'image', image: media.eBike },
  { kind: 'milestone', date: 'August 2026', title: 'KNUST launches', text: '150 e-bikes and 24 parking zones across Kumasi’s biggest campus.' },
  { kind: 'milestone', date: 'September 2026', title: 'UCC, the Yenko E1 and new services', text: 'Cape Coast goes live, our own e-bike rolls out, and shared rides, delivery and rent-to-own join the app.' },
];

const getToKnow = [
  { title: 'Careers', cta: 'Life at Yenko', to: '/careers', image: media.workshop },
  { title: 'Safety', cta: 'Safety at Yenko', to: '/safety', image: media.riders },
  { title: 'Sustainability', cta: 'Our impact', to: '/sustainability', image: media.solar },
  { title: 'Partnerships', cta: 'Partner with us', to: '/partnerships', image: media.students },
  { title: 'Campuses', cta: 'Find your campus', to: '/locations', image: media.campus },
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
    'Yenko Mobility is a Ghanaian mobility company with campus e-bikes, shared rides, delivery, rent-to-own e-bikes, corporate plans and franchising.',
  );

  return (
    <div className="bg-white text-onbrand">
      <CompanyNav />

      {/* Hero */}
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-24">
        <Container>
          <p className="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand ring-2 ring-onbrand/10" />
            About Yenko
          </p>
          <h1 className="mt-6 text-display-2xl font-bold">About Yenko</h1>
          <p className="mt-8 max-w-4xl text-xl font-medium leading-relaxed sm:text-2xl sm:leading-relaxed">
            Yenko is a Ghanaian mobility platform with campus e-bikes, shared rides, delivery, rent-to-own e-bikes and business services. “Yenko” means “let’s go”
            in Twi.
          </p>
        </Container>
      </section>

      {/* Intro and stats */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-6 border-t border-black/[0.08] pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
            <p className="text-lg font-semibold leading-relaxed">
              Yenko has more than 60 people, with teams based in Accra, Kumasi and Cape Coast, and a field crew on every campus we serve.
            </p>
            <p className={cx('text-lg leading-relaxed', muted)}>
              The Yenko app connects students, commuters and businesses to clean, affordable transport and delivery, while creating local jobs for technicians,
              riders, couriers and franchise partners.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <li key={stat.label} className={cx('rounded-2xl p-6 sm:p-7', card)}>
                <p className="text-display-lg font-bold">{stat.value}</p>
                <p className={cx('mt-3 text-lg font-medium', muted)}>{stat.label}</p>
                <p className={cx('mt-6 text-sm', muted)}>{stat.note}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section aria-labelledby="about-services" className="py-16 sm:py-24">
        <Container>
          <SectionIntro id="about-services" title="Yenko’s services">
            From campus e-bikes to shared rides and same-day delivery, every Yenko service is built to make short trips quicker, cheaper and cleaner than a taxi.
          </SectionIntro>
          <ServicesSlider />
        </Container>
      </section>

      {/* History */}
      <section aria-labelledby="about-history" className="overflow-hidden py-16 sm:py-24">
        <Container>
          <p className={cx('text-sm font-semibold tracking-wide', muted)}>2024–present</p>
          <SectionIntro id="about-history" title="History" className="mt-3">
            Yenko was founded in Accra in 2024 by students who were tired of long walks in the heat and packed shuttles between lectures. After a 40-bike pilot at
            Legon, we designed our own e-bike for campus hills and heavy bags, and grew from one campus to a multi-service mobility company.
          </SectionIntro>
        </Container>
        <HistoryCarousel />
      </section>

      {/* Mission */}
      <section aria-labelledby="about-mission" className="py-16 sm:py-24">
        <Container>
          <h2 id="about-mission" className="text-display-lg font-bold">
            Our mission
          </h2>
          <div className="mt-8 grid gap-8 text-lg leading-relaxed md:grid-cols-3 md:gap-10">
            <div>
              <p className="font-semibold">We’re making getting around quick, affordable and clean, starting with every campus in Ghana.</p>
              <Link to="/mission" className="mt-4 inline-flex items-center gap-1.5 font-semibold underline decoration-brand decoration-[3px] underline-offset-[6px]">
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
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[media.campus, media.riders].map((image) => (
              <div key={image.src} className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F7F5]">
                <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Get to know Yenko */}
      <section aria-labelledby="about-know" className="overflow-hidden py-16 sm:py-24">
        <Container>
          <h2 id="about-know" className="text-display-lg font-bold">
            Get to know Yenko
          </h2>
        </Container>
        <GetToKnowCarousel />
      </section>

      <LatestUpdates />

      {/* Riding beats waiting */}
      <section aria-labelledby="about-riding" className="overflow-hidden py-16 sm:py-24">
        <Container>
          <SectionIntro id="about-riding" title="Riding beats waiting">
            Taxis add up fast and shuttles don’t wait for you. With Yenko you only pay when you move, with no car, fuel or parking to worry about. That’s why
            thousands of students and commuters choose to ride.
          </SectionIntro>
          <p className={cx('mt-5 text-sm font-medium', muted)}>Services and prices vary by city and campus. Open the Yenko app to see what’s available near you.</p>
          <Link to="/how-it-works" className={cx(darkButton, 'mt-8')}>
            Learn how it works
          </Link>
        </Container>
        <RidingCarousel />
      </section>

      {/* Download */}
      <section aria-labelledby="about-download" className="pb-16 sm:pb-24">
        <Container>
          <div className="grid overflow-hidden rounded-3xl bg-[#F3F4F1] lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <h2 id="about-download" className="text-display-lg font-bold">
                Download the Yenko app
              </h2>
              <p className={cx('mt-4 text-lg', muted)}>Available for iOS and Android devices. Ride, send, own and manage your team in one app.</p>
              <StoreButtons tone="light" className="mt-8" />
            </div>
            <div className="relative h-80 sm:h-96 lg:h-auto lg:min-h-[28rem]">
              <PhoneMockup className="absolute left-1/2 top-10 -translate-x-1/2 rotate-6 scale-90 sm:top-12 lg:top-16" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function CompanyNav() {
  return (
    <nav aria-label="Company" className="sticky top-16 z-40 border-b border-black/[0.08] bg-white/90 backdrop-blur">
      <Container className="flex h-14 items-center gap-6">
        <span className="shrink-0 font-semibold">Company</span>
        <ul className="no-scrollbar -mr-5 ml-auto flex items-center gap-1 overflow-x-auto pr-5 sm:mr-0 sm:pr-0">
          {companyLinks.map((link) => (
            <li key={link.to} className="shrink-0">
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  cx(
                    'block rounded-full px-3 py-1.5 text-sm transition-colors',
                    isActive ? 'bg-onbrand font-medium text-white' : cx(muted, 'hover:bg-[#EEF0EE] hover:text-onbrand'),
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}

function SectionIntro({ id, title, className, children }: { id: string; title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h2 id={id} className="text-display-lg font-bold">
        {title}
      </h2>
      <p className={cx('mt-6 max-w-4xl text-lg leading-relaxed', muted)}>{children}</p>
    </div>
  );
}

const sliderButton =
  'flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0EE] text-onbrand transition-colors hover:bg-[#E2E5E2] disabled:pointer-events-none disabled:opacity-40';

function ArrowButtons({ label, atStart, atEnd, onMove, className }: { label: string; atStart: boolean; atEnd: boolean; onMove: (direction: 1 | -1) => void; className?: string }) {
  return (
    <div className={cx('flex gap-2', className)}>
      <button type="button" className={sliderButton} onClick={() => onMove(-1)} disabled={atStart} aria-label={`Previous ${label}`}>
        <ArrowLeftIcon width={18} height={18} />
      </button>
      <button type="button" className={sliderButton} onClick={() => onMove(1)} disabled={atEnd} aria-label={`Next ${label}`}>
        <ArrowRightIcon width={18} height={18} />
      </button>
    </div>
  );
}

function ServicesSlider() {
  const [index, setIndex] = useState(0);
  const current = serviceCards[index];
  const count = serviceCards.length;
  const move = (direction: 1 | -1) => setIndex((value) => (value + direction + count) % count);

  return (
    <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F7F5]">
          {serviceCards.map((service, i) => (
            <img
              key={service.key}
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
            {serviceCards.map((service, i) => (
              <button
                key={service.key}
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

      <div key={current.key} aria-live="polite" className="animate-fade-in">
        <p className={cx('text-sm font-medium', muted)}>
          {index + 1} / {count}
        </p>
        <h3 className="mt-3 text-display-md font-bold">{current.name}</h3>
        <p className={cx('mt-5 text-lg leading-relaxed', muted)}>{current.summary}</p>
        <p className="mt-3 font-medium">{current.priceFrom}</p>
        <Link to={current.to} className={cx(darkButton, 'mt-8')}>
          Explore {current.name} <ArrowOutward />
        </Link>
      </div>
    </div>
  );
}

function HistoryCarousel() {
  const { trackRef, atStart, atEnd, scrollByItem } = useCarousel();
  return (
    <>
      <ul ref={trackRef} aria-label="Milestones" className={cx(track, 'mt-12')}>
        {history.map((item, index) =>
          item.kind === 'image' ? (
            <li key={index} aria-hidden="true" className={cx(slide, 'h-[24rem] overflow-hidden rounded-2xl bg-[#F6F7F5] sm:h-[26rem]')}>
              <img src={item.image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </li>
          ) : (
            <li key={index} className={cx(slide, 'flex h-[24rem] flex-col rounded-2xl bg-[#111414] p-7 text-white sm:h-[26rem] sm:p-8')}>
              <p className="text-2xl font-bold text-brand">{item.date}</p>
              <h3 className="mt-5 text-xl font-semibold leading-snug">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-white/70">{item.text}</p>
              <BikeIcon width={28} height={28} className="mt-auto text-white/25" aria-hidden="true" />
            </li>
          ),
        )}
      </ul>
      <Container className="mt-6 flex justify-end">
        <ArrowButtons label="milestone" atStart={atStart} atEnd={atEnd} onMove={scrollByItem} />
      </Container>
    </>
  );
}

function GetToKnowCarousel() {
  const { trackRef, atStart, atEnd, scrollByItem } = useCarousel();
  return (
    <>
      <ul ref={trackRef} aria-label="Get to know Yenko" className={cx(track, 'mt-12')}>
        {getToKnow.map((item) => (
          <li key={item.title} className={cx(slide, 'relative aspect-[5/7] overflow-hidden rounded-2xl bg-[#F6F7F5] sm:aspect-[5/8]')}>
            <img src={item.image.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <Link to={item.to} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-onbrand transition-colors hover:bg-brand-300">
                {item.cta}
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Container className="mt-6 flex justify-end">
        <ArrowButtons label="card" atStart={atStart} atEnd={atEnd} onMove={scrollByItem} />
      </Container>
    </>
  );
}

function LatestUpdates() {
  const { status, data } = useAsync((signal) => listPosts({ perPage: 3 }, signal), []);
  const posts = data?.data ?? [];
  if (status === 'error' || (status === 'success' && posts.length === 0)) return null;

  return (
    <section aria-labelledby="about-updates" className="py-16 sm:py-24">
      <Container>
        <SectionIntro id="about-updates" title="Latest updates">
          Stay up to date with Yenko news, launches, campus updates and stories from our riders and team.
        </SectionIntro>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/blog" className={darkButton}>
            Blog
          </Link>
          <Link to="/contact?topic=press" className={lightButton}>
            Press enquiries
          </Link>
        </div>

        <ul className="mt-12 space-y-3">
          {status === 'loading' && posts.length === 0
            ? [0, 1, 2].map((key) => <li key={key} aria-hidden="true" className="h-56 animate-pulse rounded-2xl bg-[#F3F4F1]" />)
            : posts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group grid overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FAFBFA] transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[24rem_minmax(0,1fr)]"
                  >
                    <span className="block aspect-[16/9] overflow-hidden bg-brand sm:aspect-auto sm:min-h-[14rem] lg:min-h-[17rem]">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-onbrand">
                          <BikeIcon width={48} height={48} strokeWidth={1.5} />
                        </span>
                      )}
                    </span>
                    <span className="flex flex-col justify-center p-6 sm:p-8">
                      <span className="flex items-center justify-between gap-4 text-sm">
                        <span className="rounded-full border border-onbrand/25 px-2.5 py-0.5 text-xs font-semibold">{post.category.name}</span>
                        <time dateTime={post.publishedAt ?? undefined} className={muted}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </span>
                      <span className="mt-4 block text-xl font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">{post.title}</span>
                      <span className={cx('mt-3 line-clamp-2 block', muted)}>{post.excerpt}</span>
                    </span>
                  </Link>
                </li>
              ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link to="/blog" className={darkButton}>
            View more
          </Link>
        </div>
      </Container>
    </section>
  );
}

function RidingCarousel() {
  const { trackRef, atStart, atEnd, scrollByItem } = useCarousel();
  return (
    <>
      <ul ref={trackRef} aria-label="Ways to ride" className={cx(track, 'mt-12')}>
        {rideCards.map((item) => (
          <li key={item.title} className={cx(slide, 'flex flex-col')}>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#F6F7F5]">
              <img src={item.image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-6 text-2xl font-bold tracking-tight">{item.title}</h3>
            <p className={cx('mt-3 leading-relaxed', muted)}>{item.text}</p>
            {item.action.style === 'button' ? (
              <Link to={item.action.to} className={cx(darkButton, 'mt-5 self-start')}>
                {item.action.label}
              </Link>
            ) : (
              <Link to={item.action.to} className="mt-5 self-start font-semibold underline decoration-brand decoration-[3px] underline-offset-[6px]">
                {item.action.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <Container className="mt-8 flex justify-end">
        <ArrowButtons label="card" atStart={atStart} atEnd={atEnd} onMove={scrollByItem} />
      </Container>
    </>
  );
}
