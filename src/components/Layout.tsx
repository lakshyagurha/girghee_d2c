import { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { brand } from '../content/brand';
import { useCart } from '../lib/cart';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Header } from './Header';

function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === 'POP') return; // let the browser restore position on back/forward
    if (hash) {
      // wait for the route to render, then scroll to the anchor
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, search, navType]);
  return null;
}

export function Layout() {
  const { announcement } = useCart();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-navy focus:px-4 focus:py-3 focus:text-ivory">Skip to content</a>
      <ScrollManager />
      {brand.prototype && (
        <div className="bg-sand text-center text-[0.8rem] leading-snug text-navy">
          <p className="container-x py-2"><strong className="font-semibold">Prototype preview.</strong> Products, prices and copy are samples. No orders, payments or enquiries are sent.</p>
        </div>
      )}
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <div aria-live="polite" className="sr-only">{announcement}</div>
    </>
  );
}
