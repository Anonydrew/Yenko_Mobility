import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Container from '@/components/ui/Container';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';
import StoreButtons from '@/components/ui/StoreButtons';
import { media } from '@/content/media';
import PhoneMockup from './PhoneMockup';

type Card = {
  title: string;
  meta: string;
  image?: string;
  visual?: ReactNode;
};

const cards: Card[] = [
  {
    title: 'Download the app',
    meta: 'Takes under a minute',
    visual: (
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,rgba(217,224,38,0.45),#111414_70%)]">
        <PhoneMockup className="absolute left-1/2 top-10 -translate-x-1/2 scale-[0.8] sm:top-12" />
      </div>
    ),
  },
  { title: 'Create your account', meta: 'You need Ghana Card to ride', image: media.students.src },
  { title: 'Find your ride', meta: 'Reserve a bike free for 10 minutes', image: media.eBike.src },
  { title: 'Scan and ride', meta: 'Pedal assist up to 25 km/h', image: media.riders.src },
  { title: 'Park and end your ride', meta: 'More than 120 parking zones', image: media.parking.src },
];

/** Webflow-style carousel on a light background: three cards in view, the fourth peeking in, arrows to move through all five. */
export default function HowItWorksCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEnds = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    updateEnds();
    track?.addEventListener('scroll', updateEnds, { passive: true });
    window.addEventListener('resize', updateEnds);
    return () => {
      track?.removeEventListener('scroll', updateEnds);
      window.removeEventListener('resize', updateEnds);
    };
  }, [updateEnds]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector('li');
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: 'smooth' });
  };

  const arrowButton =
    'flex h-11 w-11 items-center justify-center rounded-full bg-onbrand text-white transition-[opacity,background-color] hover:bg-[#2A2D2D] disabled:opacity-25';

  return (
    <section aria-labelledby="how-it-works-title" className="overflow-hidden py-12 sm:py-16">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#5C605F]">How it works</p>
          <h2 id="how-it-works-title" className="mt-3 max-w-3xl text-display-lg font-bold text-onbrand">
            From download to drop-off in five simple steps.
          </h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollByCard(-1)} disabled={atStart} aria-label="Previous step" className={arrowButton}>
            <ArrowLeftIcon width={18} height={18} />
          </button>
          <button type="button" onClick={() => scrollByCard(1)} disabled={atEnd} aria-label="Next step" className={arrowButton}>
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </Container>

      <ul
        ref={trackRef}
        aria-label="Steps"
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 scroll-px-5 sm:mt-12 sm:px-8 sm:scroll-px-8 lg:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]"
      >
        {cards.map((card, index) => (
          <li
            key={card.title}
            aria-label={`Step ${index + 1} of ${cards.length}: ${card.title}`}
            className="relative aspect-[3/4] w-[82vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#111414] sm:aspect-[2/3] sm:w-[calc((100vw-5rem)/2.3)] lg:w-[calc((min(100vw,84rem)-5rem-2rem)/3.3)]"
          >
            {card.visual ?? <img src={card.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

            <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur sm:left-6 sm:top-6">
              Step {index + 1} of {cards.length}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-display-lg font-bold leading-none text-brand">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-[1.5rem] font-semibold leading-tight tracking-tight text-white">{card.title}</h3>
              <div className="mt-5 flex items-center justify-between gap-4">
                {index === 0 ? <StoreButtons className="[&_img]:h-9" /> : <span className="text-xs text-white/60">{card.meta}</span>}
                <Link
                  to="/how-it-works"
                  aria-label={`Read more about step ${index + 1}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-onbrand"
                >
                  <ArrowOutward />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 px-5 text-center text-sm text-[#5C605F]">
        Want the details?{' '}
        <Link to="/how-it-works" className="font-medium text-onbrand underline underline-offset-4">
          Read the step-by-step guide →
        </Link>
      </p>
    </section>
  );
}
