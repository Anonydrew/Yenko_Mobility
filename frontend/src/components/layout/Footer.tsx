import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import Logo from '@/components/ui/Logo';
import { site } from '@/config/site';
import { footerColumns } from '@/content/navigation';
import CookiePreferences from './CookiePreferences';

export default function Footer() {
  const [cookiesOpen, setCookiesOpen] = useState(false);

  return (
    <footer className="border-t border-line bg-chrome">
      <Container className="pb-10 pt-16 lg:pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-8">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">Sitemap</h2>
          <Link to="/sitemap" className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
            View the full sitemap →
          </Link>
        </div>

        <nav aria-label="Sitemap" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-ink">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.to}`}>
                    <Link to={link.to} className="text-sm text-ink-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-20 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Yenko Mobility home" className="rounded-lg">
              <Logo className="[&_img]:h-6" />
            </Link>
            <p className="text-sm text-ink-muted">
              {site.name} © {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link to="/sitemap" className="transition-colors hover:text-ink">
              Sitemap
            </Link>
            <button type="button" onClick={() => setCookiesOpen(true)} className="transition-colors hover:text-ink">
              Cookie preferences
            </button>
            <span>{site.location}</span>
          </div>
        </div>
      </Container>

      <CookiePreferences open={cookiesOpen} onClose={() => setCookiesOpen(false)} />
    </footer>
  );
}
