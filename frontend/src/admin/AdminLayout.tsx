import { Link, NavLink, Outlet } from 'react-router-dom';
import { ExternalIcon, FileTextIcon, InboxIcon, LogOutIcon, TagIcon, WalletIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/Logo';
import { cx } from '@/lib/cx';
import { adminPath } from './adminApi';
import { useAuth } from './AuthContext';

const navItems = [
  { to: 'posts', label: 'Posts', icon: FileTextIcon },
  { to: 'categories', label: 'Categories', icon: TagIcon },
  { to: 'pricing', label: 'Pricing', icon: WalletIcon },
  { to: 'submissions', label: 'Submissions', icon: InboxIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <aside className="border-b border-line bg-chrome lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between gap-3 px-5 lg:h-20">
          <Link to={adminPath('posts')} className="flex items-center gap-2 rounded-lg" aria-label="Admin home">
            <Logo />
            <span className="rounded-full bg-brand px-2 py-0.5 text-[0.6875rem] font-medium text-onbrand">Admin</span>
          </Link>
          <div className="flex items-center gap-1 lg:hidden">
            <a href="/" target="_blank" rel="noreferrer" aria-label="View website" className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted">
              <ExternalIcon width={18} height={18} />
            </a>
            <button type="button" onClick={() => void logout()} aria-label="Sign out" className="rounded-lg p-2 text-ink-muted hover:bg-surface-muted">
              <LogOutIcon width={18} height={18} />
            </button>
          </div>
        </div>

        <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 lg:flex-1 lg:pb-0">
          <ul className="flex gap-1 lg:flex-col">
            {navItems.map(({ to, label, icon: ItemIcon }) => (
              <li key={to}>
                <NavLink
                  to={adminPath(to)}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-white text-onbrand' : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
                    )
                  }
                >
                  <ItemIcon width={18} height={18} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden border-t border-line p-4 lg:block">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <ExternalIcon width={18} height={18} /> View website
          </a>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-surface-muted py-2 pl-3 pr-1.5">
            <span className="truncate text-sm" title={user?.email}>
              {user?.email}
            </span>
            <button type="button" onClick={() => void logout()} aria-label="Sign out" title="Sign out" className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-sunken hover:text-ink">
              <LogOutIcon width={18} height={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
