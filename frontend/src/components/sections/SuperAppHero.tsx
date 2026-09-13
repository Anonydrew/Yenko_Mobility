import { Link } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { BasketIcon, BikeIcon, BuildingIcon, type Icon, SearchIcon, SparkIcon, UsersIcon, WalletIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

const rows: { icon: Icon; name: string; meta: string; price: string; to: string }[] = [
  { icon: BikeIcon, name: 'Campus e-bike', meta: '2 min walk · 87% battery', price: 'GH₵ 2', to: '/products/e-bikes' },
  { icon: UsersIcon, name: 'Shared ride', meta: '4 min · 3 seats left', price: 'GH₵ 8', to: '/services/shared-rides' },
  { icon: BasketIcon, name: 'Yenko Delivery', meta: 'Same day · up to 15 kg', price: 'GH₵ 10', to: '/services/delivery' },
  { icon: WalletIcon, name: 'Rent to own', meta: 'Yenko E1 · 12 months', price: 'GH₵ 150/wk', to: '/services/rent-to-own' },
  { icon: BuildingIcon, name: 'Yenko Corporate', meta: 'Team account · monthly invoice', price: 'From GH₵ 2,500', to: '/services/corporate' },
  { icon: SparkIcon, name: 'Yenko for Business', meta: 'Franchise in your city', price: 'Let’s talk', to: '/services/business' },
];

/** Bolt-style hero: centred headline over a phone tilted back in perspective, listing every Yenko service. */
export default function SuperAppHero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Container className="relative z-10 pt-16 text-center sm:pt-24 lg:pt-28">
        <h1 className="mx-auto max-w-5xl text-display-2xl font-bold">Ride anytime. Anywhere.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">
          Need a ride? Rent a Yenko e-bike and get moving.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/mission" size="lg" variant="dark">
            Our mission
          </Button>
          <Button to="/download" size="lg">
            Download app <ArrowOutward />
          </Button>
        </div>
      </Container>

      {/* Soft lime glow behind the phone */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(217,224,38,0.18),transparent)]" />

      <div className="relative mx-auto mt-14 h-[22rem] max-w-6xl px-5 [perspective:1400px] sm:mt-16 sm:h-[30rem] lg:h-[34rem]">
        <div className="absolute inset-x-0 top-0 mx-auto w-[min(56rem,calc(100%-2.5rem))] origin-top [transform:rotateX(32deg)] [transform-style:preserve-3d]">
          <div className="rounded-t-[3.5rem] border-[14px] border-b-0 border-[#1B1F1F] bg-[#F4F5F2] px-4 pb-24 pt-4 text-onbrand shadow-[0_-40px_120px_-40px_rgba(217,224,38,0.35)] ring-1 ring-white/10 sm:px-8 sm:pt-6">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-neutral-500 shadow-sm sm:py-4">
              <SearchIcon width={20} height={20} />
              <span className="text-sm sm:text-lg">Where to?</span>
            </div>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-neutral-300" />
            <ul className="mt-3 divide-y divide-neutral-200">
              {rows.map((row, index) => (
                <li key={row.name}>
                  <Link
                    to={row.to}
                    className={cx(
                      'flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-white sm:gap-6 sm:px-5 sm:py-5',
                      index === 0 && 'bg-white ring-2 ring-brand',
                    )}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand sm:h-16 sm:w-16">
                      <row.icon width={24} height={24} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-base font-bold tracking-tight sm:text-3xl">{row.name}</span>
                      <span className="block truncate text-xs text-neutral-500 sm:text-lg">{row.meta}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold sm:text-2xl">{row.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
