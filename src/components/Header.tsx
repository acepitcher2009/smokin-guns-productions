import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { Button } from './Button';
import { nav } from '../data/nav';
import logoUrl from '../assets/sgplogo.webp';

// min-h-[44px]/min-w-[44px] is the documented PRD §5 accessibility tap-target
// floor (CONVENTIONS.md §E) — a size guarantee, not a color/spacing/type design
// value. Every other class maps to a design-system token.
const linkBase =
  'inline-flex min-h-[44px] items-center px-4 py-3 font-display text-base uppercase ' +
  'tracking-wide focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-brand-red-dark focus-visible:ring-offset-2';

const iconButton =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-ink ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark ' +
  'focus-visible:ring-offset-2';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `${linkBase} ${isActive ? 'text-brand-red underline' : 'text-ink'}`;
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes (closes on navigation, AC #7).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer (keyboard-dismissible, AC #9).
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-deep bg-cream">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
        >
          {/* Logo: the crossed-pistols emblem with the wordmark baked in; the alt
              gives the home link its single accessible name. */}
          <img src={logoUrl} alt="Smokin' Guns Productions" className="h-16 w-auto md:h-20" />
        </Link>

        {/* Desktop nav — hidden below md */}
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
          <Button as="link" to="/register">
            Register
          </Button>
        </nav>

        {/* Mobile hamburger — shown below md */}
        <button
          type="button"
          className={`${iconButton} md:hidden`}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink/50 motion-safe:transition-opacity motion-reduce:transition-none"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <nav
            aria-label="Primary"
            className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col gap-2 bg-cream p-6 shadow-card"
          >
            <button
              type="button"
              className={`${iconButton} mb-2 self-end`}
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <X aria-hidden="true" />
            </button>
            {nav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            <Button as="link" to="/register">
              Register
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
