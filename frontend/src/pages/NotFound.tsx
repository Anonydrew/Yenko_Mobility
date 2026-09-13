import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { ArrowRightIcon } from '@/components/ui/icons';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const popular = [
  { label: 'Pricing', to: '/pricing' },
  { label: 'Campus locations', to: '/locations' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Support center', to: '/support' },
];

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <Container className="pb-24 pt-14 sm:pt-20 lg:pt-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="inline-flex rounded-full bg-brand px-3 py-1 text-sm font-medium text-onbrand">Error 404</p>
          <h1 className="mt-6 text-display-xl font-bold">This ride took a wrong turn.</h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted sm:text-xl">
            The page you're looking for has moved or doesn't exist. Let's get you back on track.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/" size="lg" variant="dark">
              Back to home
            </Button>
            <Button to="/contact" size="lg" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>

        <div className="rounded-4xl bg-surface-muted p-6 sm:p-8 lg:col-span-5">
          <h2 className="text-sm font-medium text-ink-muted">Popular pages</h2>
          <ul className="mt-4 divide-y divide-line">
            {popular.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="group flex items-center justify-between py-4 text-lg font-medium tracking-tight">
                  {link.label}
                  <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
