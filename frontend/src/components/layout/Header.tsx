import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { ArrowRightIcon, MenuIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/Logo';
import { navGroups, primaryLinks } from '@/content/navigation';
import { cx } from '@/lib/cx';
import MobileNav from './MobileNav';

const CLOSE_DELAY_MS = 120;

export default function Header() {
  const { pathname } = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number>();

  const openGroup = navGroups.find((group) => group.id === openId) ?? null;

  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openId]);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-black" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
        <Container className="flex h-16 items-center gap-6 lg:gap-10">
          <Link to="/" aria-label="Yenko Mobility home" className="shrink-0 rounded-lg">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {navGroups.map((group) => {
                const isOpen = openId === group.id;
                const isActive = group.links.some((link) => link.to === pathname);
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="site-nav-panel"
                      onMouseEnter={() => setOpenId(group.id)}
                      onClick={() => setOpenId(isOpen ? null : group.id)}
                      className={cx(
                        'rounded-full px-3 py-2 text-sm transition-colors',
                        isOpen || isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {group.label}
                    </button>
                  </li>
                );
              })}
              {primaryLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onMouseEnter={() => setOpenId(null)}
                    className={({ isActive }) =>
                      cx('rounded-full px-3 py-2 text-sm transition-colors', isActive ? 'text-ink' : 'text-ink-muted hover:text-ink')
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to="/contact"
              onMouseEnter={() => setOpenId(null)}
              className="hidden rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Contact
            </Link>
            <Button to="/download" size="sm" onMouseEnter={() => setOpenId(null)} className="gap-1.5">
              Download app <ArrowOutward />
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="-mr-2 ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface-sunken lg:hidden"
            >
              <MenuIcon width={22} height={22} />
            </button>
          </div>
        </Container>

        {openGroup && (
          <div id="site-nav-panel" className="absolute inset-x-0 top-full hidden animate-slide-down border-b border-line bg-black lg:block">
            <Container className="grid grid-cols-12 gap-10 pb-12 pt-8">
              <div className="col-span-4">
                <p className="text-sm text-ink-muted">{openGroup.label}</p>
                <p className="mt-3 max-w-xs text-2xl font-medium leading-snug tracking-tight text-ink">{openGroup.summary}</p>
              </div>
              <ul className={cx('col-span-8 grid gap-x-6 gap-y-1', openGroup.links.length > 6 ? 'grid-cols-3' : 'grid-cols-2')}>
                {openGroup.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={cx(
                        'group block rounded-2xl px-4 py-3 transition-colors hover:bg-surface-sunken',
                        link.to === pathname && 'bg-surface-sunken',
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink">
                        {link.label}
                        <ArrowRightIcon
                          width={16}
                          height={16}
                          className="-translate-x-1 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">{link.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </div>
        )}
      </header>

      {openGroup && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 hidden animate-fade-in bg-black/60 backdrop-blur-md lg:block"
          onClick={() => setOpenId(null)}
        />
      )}

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
