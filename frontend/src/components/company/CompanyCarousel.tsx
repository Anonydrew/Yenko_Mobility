import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { ArrowLeftIcon, ArrowRightIcon, BikeIcon } from '@/components/ui/icons';
import { media, type MediaImage } from '@/content/media';
import { cx } from '@/lib/cx';
import { useCarousel } from '@/lib/useCarousel';
import { CompanySection } from './CompanyLayout';
import { sliderButton, slide, track } from './styles';

export function ArrowButtons({ label, atStart, atEnd, onMove }: { label: string; atStart: boolean; atEnd: boolean; onMove: (direction: 1 | -1) => void }) {
  return (
    <div className="flex gap-2">
      <button type="button" className={sliderButton} onClick={() => onMove(-1)} disabled={atStart} aria-label={`Previous ${label}`}>
        <ArrowLeftIcon width={18} height={18} />
      </button>
      <button type="button" className={sliderButton} onClick={() => onMove(1)} disabled={atEnd} aria-label={`Next ${label}`}>
        <ArrowRightIcon width={18} height={18} />
      </button>
    </div>
  );
}

type CarouselProps<T> = {
  /** Accessible name of the list, e.g. "Milestones". */
  label: string;
  /** Used in the arrow buttons: "Next milestone". */
  itemLabel: string;
  items: T[];
  itemKey: (item: T, index: number) => string | number;
  itemClassName?: (item: T) => string;
  children: (item: T, index: number) => ReactNode;
};

/** A full-width row of cards with arrow buttons, lined up with the page container. */
export function Carousel<T>({ label, itemLabel, items, itemKey, itemClassName, children }: CarouselProps<T>) {
  const { trackRef, atStart, atEnd, scrollByItem } = useCarousel();
  return (
    <>
      <ul ref={trackRef} aria-label={label} className={cx(track, 'mt-12')}>
        {items.map((item, index) => (
          <li key={itemKey(item, index)} className={cx(slide, itemClassName?.(item))}>
            {children(item, index)}
          </li>
        ))}
      </ul>
      <Container className="mt-6 flex justify-end">
        <ArrowButtons label={itemLabel} atStart={atStart} atEnd={atEnd} onMove={scrollByItem} />
      </Container>
    </>
  );
}

export type TimelineItem = { kind: 'text'; label: string; title: string; text: string } | { kind: 'image'; image: MediaImage };

/** Dark text cards mixed with photos, e.g. company milestones or the steps of a method. */
export function TimelineCarousel({ label, itemLabel, items }: { label: string; itemLabel: string; items: TimelineItem[] }) {
  return (
    <Carousel
      label={label}
      itemLabel={itemLabel}
      items={items}
      itemKey={(_, index) => index}
      itemClassName={(item) =>
        cx('h-[24rem] rounded-2xl sm:h-[26rem]', item.kind === 'image' ? 'overflow-hidden bg-[#F6F7F5]' : 'flex flex-col bg-[#111414] p-7 text-white sm:p-8')
      }
    >
      {(item) =>
        item.kind === 'image' ? (
          <img src={item.image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <>
            <p className="text-2xl font-bold text-brand">{item.label}</p>
            <h3 className="mt-5 text-xl font-semibold leading-snug">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-white/70">{item.text}</p>
            <BikeIcon width={28} height={28} className="mt-auto text-white/25" aria-hidden="true" />
          </>
        )
      }
    </Carousel>
  );
}

const exploreCards = [
  { title: 'About Yenko', cta: 'Our story', to: '/about', image: media.students },
  { title: 'Mission', cta: 'Why we exist', to: '/mission', image: media.hero },
  { title: 'Careers', cta: 'Life at Yenko', to: '/careers', image: media.workshop },
  { title: 'Safety', cta: 'Safety at Yenko', to: '/safety', image: media.riders },
  { title: 'Sustainability', cta: 'Our impact', to: '/sustainability', image: media.solar },
  { title: 'Partnerships', cta: 'Partner with us', to: '/partnerships', image: media.fleet },
  { title: 'Campuses', cta: 'Find your campus', to: '/locations', image: media.campus },
];

/** "Get to know Yenko": photo cards linking to the other company pages. `current` leaves out the page you're on. */
export function ExploreSection({ current }: { current: string }) {
  return (
    <CompanySection title="Get to know Yenko" wide>
      <Carousel
        label="Get to know Yenko"
        itemLabel="card"
        items={exploreCards.filter((card) => card.to !== current)}
        itemKey={(card) => card.to}
        itemClassName={() => 'relative aspect-[5/7] overflow-hidden rounded-2xl bg-[#F6F7F5] sm:aspect-[5/8]'}
      >
        {(card) => (
          <>
            <img src={card.image.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-white">{card.title}</h3>
              <Link to={card.to} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-onbrand transition-colors hover:bg-brand-300">
                {card.cta}
              </Link>
            </div>
          </>
        )}
      </Carousel>
    </CompanySection>
  );
}
