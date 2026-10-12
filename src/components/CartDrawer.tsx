import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useModal } from '../lib/hooks';
import { formatINR } from '../lib/format';
import { integrations } from '../content/brand';
import { Img } from './Img';
import { Icon, QtyStepper } from './ui';

export function CartDrawer() {
  const { isOpen, close, lines, subtotalPaise, setQty, remove, count } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useModal(isOpen, ref, close);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-xl"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 id="cart-title" className="text-2xl">Your cart {count > 0 && <span className="font-sans text-base font-medium text-ink-soft">({count})</span>}</h2>
          <button type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center text-navy" aria-label="Close cart" data-autofocus>
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 pb-16">
            <p className="font-serif text-2xl">Your cart is empty.</p>
            <p className="text-ink-soft">Choose a jar of ghee for your kitchen, or a gift box for someone else.</p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <Link to="/shop" onClick={close} className="btn-primary">Shop A2 Ghee</Link>
              <Link to="/gifts" onClick={close} className="btn-secondary">Explore Gift Boxes</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <Link to={l.href} onClick={close} className="w-20 shrink-0" tabIndex={-1} aria-hidden="true">
                    <Img id={l.image} ratio="4 / 5" compact />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={l.href} onClick={close} className="font-semibold leading-snug hover:text-navy">{l.title}</Link>
                        <p className="text-sm text-ink-soft">{l.detail} · {formatINR(l.unitPaise)} each</p>
                      </div>
                      <p className="tabular shrink-0 font-semibold">{formatINR(l.totalPaise)}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <QtyStepper size="sm" value={l.line.qty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.title} ${l.detail}`} />
                      <button type="button" onClick={() => remove(l.key)} className="min-h-[44px] px-1 text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-danger">
                        Remove<span className="sr-only"> {l.title} {l.detail}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="shrink-0 border-t border-line bg-paper px-5 pt-5 pb-safe">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="tabular text-xl font-semibold">{formatINR(subtotalPaise)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">Shipping and any applicable taxes are calculated at checkout.</p>
              <button type="button" className="btn-primary mt-4 w-full" onClick={() => { close(); navigate('/checkout'); }}>
                {integrations.checkout.connected ? 'Checkout' : 'Review order (demo)'}
              </button>
              {!integrations.checkout.connected && (
                <p className="mt-2 pb-2 text-center text-xs text-ink-soft">Prototype: no order or payment will be placed.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
