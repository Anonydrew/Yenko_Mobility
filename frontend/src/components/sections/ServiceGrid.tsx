import { Link } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import { serviceCards } from '@/content/services';

export default function ServiceGrid({ excludeKey }: { excludeKey?: string }) {
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {serviceCards
        .filter((card) => card.key !== excludeKey)
        .map((card) => (
          <li key={card.key}>
            <Link to={card.to} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-muted">
              <span className="relative block aspect-[16/10] overflow-hidden">
                <img src={card.image.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">{card.priceFrom}</span>
              </span>
              <span className="flex flex-1 items-end justify-between gap-6 p-6">
                <span>
                  <span className="block text-xl font-bold tracking-tight">{card.name}</span>
                  <span className="mt-2 block text-sm text-ink-muted">{card.summary}</span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-onbrand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowOutward />
                </span>
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}
