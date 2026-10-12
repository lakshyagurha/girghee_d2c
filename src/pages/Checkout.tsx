import { Link } from 'react-router-dom';
import { integrations } from '../content/brand';
import { useCart } from '../lib/cart';
import { formatINR } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { Img } from '../components/Img';
import { QtyStepper } from '../components/ui';

export default function Checkout() {
  usePageMeta('Order summary (demo)');
  const { lines, subtotalPaise, setQty, remove } = useCart();
  return (
    <section className="container-x py-12 lg:py-20">
      <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Demo checkout</p>
      <h1 className="mt-4 text-h2 font-normal">Order summary</h1>
      {!integrations.checkout.connected && (
        <div role="note" className="mt-6 max-w-3xl border-l-4 border-gold bg-gold-soft/60 p-5">
          <p className="font-semibold">No order or payment is being placed.</p>
          <p className="mt-1 text-sm text-ink-soft">This prototype is not connected to a store or payment provider. Payment details are never collected here. At launch, this step will hand over to a secure checkout.</p>
        </div>
      )}
      {lines.length === 0 ? (
        <div className="mt-10">
          <p className="text-lg">Your cart is empty.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn-primary">Shop A2 Ghee</Link>
            <Link to="/gifts" className="btn-secondary">Explore Gift Boxes</Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <div className="w-20 shrink-0 sm:w-24"><Img id={l.image} ratio="4 / 5" compact /></div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link to={l.href} className="font-semibold hover:text-navy">{l.title}</Link>
                    <p className="text-sm text-ink-soft">{l.detail} · {formatINR(l.unitPaise)} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <QtyStepper size="sm" value={l.line.qty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.title} ${l.detail}`} />
                    <p className="tabular w-24 text-right font-semibold">{formatINR(l.totalPaise)}</p>
                  </div>
                  <button type="button" onClick={() => remove(l.key)} className="min-h-[44px] self-start text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-danger sm:self-center">Remove<span className="sr-only"> {l.title} {l.detail}</span></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="self-start border border-line bg-paper p-6">
            <dl className="space-y-3">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular font-semibold">{formatINR(subtotalPaise)}</dd></div>
              <div className="flex justify-between text-ink-soft"><dt>Shipping</dt><dd>To be confirmed</dd></div>
              <div className="flex justify-between text-ink-soft"><dt>Taxes</dt><dd>To be confirmed</dd></div>
            </dl>
            <button type="button" disabled className="btn-primary mt-6 w-full">Payment not connected</button>
            <p className="mt-3 text-sm text-ink-soft">Your cart is saved in this browser only. It holds product choices and quantities, nothing personal.</p>
            <Link to="/shop" className="link mt-4 inline-block">Continue shopping</Link>
          </div>
        </div>
      )}
    </section>
  );
}
