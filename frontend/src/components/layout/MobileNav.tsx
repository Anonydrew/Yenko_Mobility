import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowOutward from '@/components/ui/ArrowOutward';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { CloseIcon, PlusIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/Logo';
import { navGroups, primaryLinks } from '@/content/navigation';
import { cx } from '@/lib/cx';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex animate-fade-in flex-col bg-black lg:hidden">
      <Container className="flex h-16 shrink-0 items-center justify-between border-b border-line">
        <Link to="/" aria-label="Yenko Mobility home" onClick={onClose}>
          <Logo />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-sunken"
        >
          <CloseIcon width={22} height={22} />
        </button>
      </Container>

      <nav aria-label="Main" className="flex-1 overflow-y-auto">
        <Container>
          <ul className="divide-y divide-line border-b border-line">
            {navGroups.map((group) => {
              const isExpanded = expandedId === group.id;
              return (
                <li key={group.id}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedId(isExpanded ? null : group.id)}
                    className="flex w-full items-center justify-between py-5 text-left text-xl font-medium tracking-tight"
                  >
                    {group.label}
                    <PlusIcon className={cx('transition-transform duration-200', isExpanded && 'rotate-45')} />
                  </button>
                  {isExpanded && (
                    <ul className="animate-slide-down pb-4">
                      {group.links.map((link) => (
                        <li key={link.to}>
                          <Link to={link.to} onClick={onClose} className="block py-2.5 text-base text-ink-muted hover:text-ink">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {primaryLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={onClose} className="block py-5 text-xl font-medium tracking-tight">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <Container className="flex shrink-0 gap-3 border-t border-line py-4">
        <Button to="/download" onClick={onClose} className="flex-1">
          Download app <ArrowOutward />
        </Button>
        <Button to="/contact" variant="secondary" onClick={onClose} className="flex-1">
          Contact us
        </Button>
      </Container>
    </div>
  );
}
