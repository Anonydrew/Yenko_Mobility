import { useId, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { cx } from '@/lib/cx';
import { muted } from './styles';

export const companyLinks = [
  { to: '/about', label: 'About Yenko' },
  { to: '/mission', label: 'Mission' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/careers', label: 'Careers' },
  { to: '/partnerships', label: 'Partnerships' },
];

/** A company page: black hero, sticky Company menu, then white sections. */
export function CompanyPage({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white text-onbrand">
      {hero}
      <CompanyNav />
      {children}
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
                  cx('block rounded-full px-3 py-1.5 text-sm transition-colors', isActive ? 'bg-onbrand font-medium text-white' : cx(muted, 'hover:bg-[#EEF0EE] hover:text-onbrand'))
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

export function CompanyHero({ eyebrow, title, intro, actions }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="bg-black text-white">
      <Container className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        {eyebrow && (
          <p className="flex items-center gap-2 text-sm font-medium text-brand">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
            {eyebrow}
          </p>
        )}
        <h1 className={cx('max-w-5xl text-display-2xl font-bold', eyebrow && 'mt-6')}>{title}</h1>
        {intro && <p className="mt-8 max-w-4xl text-xl font-medium leading-relaxed text-white/80 sm:text-2xl sm:leading-relaxed">{intro}</p>}
        {actions && <div className="mt-10 flex flex-wrap gap-3">{actions}</div>}
      </Container>
    </section>
  );
}

type CompanySectionProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  note?: string;
  actions?: ReactNode;
  /** Render children full width (for carousels) instead of inside the page container. */
  wide?: boolean;
  className?: string;
  children?: ReactNode;
};

/** A white page section with an optional heading block. Children add their own top margin. */
export function CompanySection({ id, eyebrow, title, intro, note, actions, wide, className, children }: CompanySectionProps) {
  const headingId = useId();
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cx('scroll-mt-32 py-16 sm:py-24', wide && 'overflow-hidden', className)}>
      <Container>
        {eyebrow && <p className={cx('text-sm font-semibold tracking-wide', muted)}>{eyebrow}</p>}
        {title && (
          <h2 id={headingId} className={cx('text-display-lg font-bold', eyebrow && 'mt-3')}>
            {title}
          </h2>
        )}
        {intro && <p className={cx('mt-6 max-w-4xl text-lg leading-relaxed', muted)}>{intro}</p>}
        {note && <p className={cx('mt-5 text-sm font-medium', muted)}>{note}</p>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        {!wide && children}
      </Container>
      {wide && children}
    </section>
  );
}
