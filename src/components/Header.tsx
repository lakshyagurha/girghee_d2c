import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNav } from '../content/navigation';
import { useCart } from '../lib/cart';
import { useModal } from '../lib/hooks';
import { Logo, LogoLockup } from './Logo';
import { Icon } from './ui';

export function Header() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur-sm supports-[backdrop-filter]:bg-ivory/90">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="-ml-2 grid h-11 w-11 place-items-center text-navy lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <Logo />
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative inline-flex min-h-[44px] items-center px-3 text-[0.95rem] font-medium transition-colors hover:text-navy ${
                      isActive ? 'text-navy after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:bg-gold' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={open}
          className="-mr-2 inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-soft px-2 text-navy hover:bg-sand/50"
          aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
          <Icon name="bag" className="h-6 w-6" />
          <span className="hidden text-sm font-semibold sm:inline">Cart</span>
          <span aria-hidden="true" className={`tabular grid h-6 min-w-[1.5rem] place-items-center rounded-full px-1.5 text-xs font-bold ${count ? 'bg-navy text-ivory' : 'bg-sand text-navy'}`}>{count}</span>
        </button>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(open, ref, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-ivory pb-safe shadow-xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <LogoLockup withDescriptor={false} />
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center text-navy" aria-label="Close menu" data-autofocus>
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 px-4 py-4">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-line">
                <NavLink to={item.to} onClick={onClose} className={({ isActive }) => `flex min-h-[56px] items-center font-serif text-xl ${isActive ? 'text-navy' : 'text-ink'}`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="border-b border-line">
              <NavLink to="/contact" onClick={onClose} className="flex min-h-[56px] items-center font-serif text-xl text-ink">Contact</NavLink>
            </li>
          </ul>
          <div className="mt-8 bg-sand p-5">
            <p className="text-sm font-semibold text-navy">Gifting for a team?</p>
            <p className="mt-1 text-sm text-ink-soft">Share your quantity and budget per box to get started.</p>
            <Link to="/corporate-gifting#quote" onClick={onClose} className="btn-primary mt-4 w-full">Request a Quote</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
