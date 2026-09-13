import { Link } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Container from '@/components/ui/Container';
import { services } from '@/content/services';

/** The services featured on the home page, in order. Names, taglines, prices and images come from content/services.ts. */
const featuredSlugs = ['shared-rides', 'delivery', 'business'];

const featured = featuredSlugs.flatMap((slug) => services.filter((service) => service.slug === slug));

/** Bolt-style service cards on a white background: eyebrow, name and price, with the image anchored to the bottom. */
export default function HomeServices() {
  return (
    <section aria-labelledby="services-title" className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#5C605F]">Our services</p>
            <h2 id="services-title" className="mt-3 max-w-3xl text-display-lg font-bold text-onbrand">
              Every way you move, in one app.
            </h2>
            <p className="mt-4 max-w-2xl text-[#5C605F]">Open the Yenko app to see every ride, delivery and business option available near you.</p>
          </div>
          <Link
            to="/pricing"
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-onbrand px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-[#2A2D2D] sm:self-auto"
          >
            See pricing <ArrowOutward />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <li key={service.slug}>
              <Link
                to={`/services/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F7F8F7] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onbrand"
              >
                <span className="block px-6 pt-6 sm:px-7 sm:pt-7">
                  <span className="block text-sm text-[#5C605F]">{service.tagline}</span>
                  <span className="mt-1 block text-2xl font-semibold tracking-tight text-onbrand">{service.name}</span>
                  <span className="mt-4 block text-[#5C605F]">{service.priceFrom}</span>
                </span>
                <span className="mt-8 block flex-1 px-6 sm:px-7">
                  <span className="block aspect-[4/3] h-full overflow-hidden rounded-t-2xl">
                    <img
                      src={service.image.src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
