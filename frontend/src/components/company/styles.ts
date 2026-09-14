// Shared class names for the white, Bolt-style company pages (About, Mission, Sustainability, Careers, Partnerships).

export const muted = 'text-[#5C605F]';
export const lightCard = 'border border-black/[0.08] bg-[#F6F7F5]';

export const darkButton = 'inline-flex h-12 items-center gap-2 rounded-full bg-onbrand px-6 font-medium text-white transition-colors hover:bg-[#2A2D2D]';
export const lightButton = 'inline-flex h-12 items-center gap-2 rounded-full bg-[#EEF0EE] px-6 font-medium text-onbrand transition-colors hover:bg-[#E2E5E2]';
export const brandButton = 'inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-onbrand transition-colors hover:bg-brand-300';
export const underlineLink = 'inline-flex items-center gap-1.5 font-semibold underline decoration-brand decoration-[3px] underline-offset-[6px]';
export const sliderButton =
  'flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0EE] text-onbrand transition-colors hover:bg-[#E2E5E2] disabled:pointer-events-none disabled:opacity-40';

/** A full-width scrolling track whose first item lines up with the page container. */
export const track =
  'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 scroll-px-5 sm:px-8 sm:scroll-px-8 lg:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]';
/** About 3.3 items in view on desktop, 2.3 on tablets and one on phones. */
export const slide = 'w-[80vw] shrink-0 snap-start sm:w-[calc((100vw-5rem)/2.3)] lg:w-[calc((min(100vw,84rem)-5rem-2rem)/3.3)]';
