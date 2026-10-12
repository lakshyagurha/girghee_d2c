import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { integrations } from '../content/brand';
import { useCart } from '../lib/cart';
import { formatINR } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { emptyCustomer, validateCustomer, type Customer, type CustomerErrors } from '../lib/pricing';
import { payWithRazorpay } from '../lib/razorpay';
import { Img } from '../components/Img';
import { Icon, QtyStepper } from '../components/ui';

const fieldOrder: (keyof Customer)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];

type Status =
  | { kind: 'idle' }
  | { kind: 'paying' }
  | { kind: 'error'; message: string }
  | { kind: 'paid'; orderId: string; paymentId: string; amountPaise: number };

export default function Checkout() {
  const { connected, testMode } = integrations.checkout;
  usePageMeta(connected ? 'Checkout' : 'Order summary (demo)');
  const { lines, subtotalPaise, setQty, remove, clear } = useCart();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Customer, v: string) => {
    const next = { ...customer, [k]: v };
    setCustomer(next);
    if (submitted) setErrors(validateCustomer(next));
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateCustomer(customer);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus({ kind: 'paying' });
    const amountPaise = subtotalPaise;
    const res = await payWithRazorpay(lines.map((l) => l.line), customer);
    if (res.status === 'paid') {
      setStatus({ kind: 'paid', orderId: res.orderId, paymentId: res.paymentId, amountPaise });
      clear();
    } else if (res.status === 'dismissed') {
      setStatus({ kind: 'idle' });
    } else {
      setStatus({ kind: 'error', message: res.message });
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  if (status.kind === 'paid') {
    return (
      <section className="container-x py-12 lg:py-20">
        <div ref={resultRef} tabIndex={-1} role="status" className="max-w-2xl border border-line bg-paper p-6 focus:outline-none sm:p-8">
          <p className="flex items-center gap-2 font-serif text-3xl text-navy"><Icon name="check" className="h-7 w-7" /> Thank you, your order is placed.</p>
          <p className="mt-3 text-ink-soft">We have received your payment of <strong className="text-ink">{formatINR(status.amountPaise)}</strong>. A receipt from Razorpay will be sent to {customer.email}.</p>
          <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
            <dt className="text-ink-soft">Payment ID</dt><dd className="font-mono">{status.paymentId}</dd>
            <dt className="text-ink-soft">Order ID</dt><dd className="font-mono">{status.orderId}</dd>
          </dl>
          {testMode && <p className="mt-4 text-sm font-semibold text-brass">Test mode: no real money was charged.</p>}
          <Link to="/shop" className="btn-secondary mt-6">Continue shopping</Link>
        </div>
      </section>
    );
  }

  const errorList = fieldOrder.filter((k) => errors[k]);
  const err = (k: keyof Customer) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-error` } : {});
  const paying = status.kind === 'paying';

  return (
    <section className="container-x py-12 lg:py-20">
      {!connected && <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Demo checkout</p>}
      {connected && testMode && <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Test mode</p>}
      <h1 className="mt-4 text-h2 font-normal">{connected ? 'Checkout' : 'Order summary'}</h1>
      {!connected && (
        <div role="note" className="mt-6 max-w-3xl border-l-4 border-gold bg-gold-soft/60 p-5">
          <p className="font-semibold">No order or payment is being placed.</p>
          <p className="mt-1 text-sm text-ink-soft">This prototype is not connected to a store or payment provider. Payment details are never collected here. At launch, this step will hand over to a secure checkout.</p>
        </div>
      )}
      {connected && testMode && (
        <div role="note" className="mt-6 max-w-3xl border-l-4 border-gold bg-gold-soft/60 p-5">
          <p className="font-semibold">Payments are in Razorpay test mode. No real money is charged.</p>
          <p className="mt-1 text-sm text-ink-soft">Use UPI ID <span className="font-mono">success@razorpay</span>, or any test card listed in Razorpay's documentation.</p>
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
          <div>
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
                    <button type="button" disabled={paying} onClick={() => remove(l.key)} className="min-h-[44px] self-start text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-danger sm:self-center">Remove<span className="sr-only"> {l.title} {l.detail}</span></button>
                  </div>
                </li>
              ))}
            </ul>

            {connected && (
              <form id="checkout-form" onSubmit={onPay} noValidate aria-labelledby="delivery-title" className="mt-10">
                <h2 id="delivery-title" className="font-serif text-2xl">Delivery details</h2>
                {errorList.length > 0 && (
                  <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="checkout-errors-title" className="mt-6 border-l-4 border-danger bg-danger/5 p-4 focus:outline-none">
                    <h3 id="checkout-errors-title" className="font-sans text-base font-semibold text-danger">Please check {errorList.length === 1 ? '1 field' : `${errorList.length} fields`}</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      {errorList.map((k) => (
                        <li key={k}><a href={`#c-${k}`} className="text-danger underline underline-offset-2" onClick={(ev) => { ev.preventDefault(); document.getElementById(`c-${k}`)?.focus(); }}>{errors[k]}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                <fieldset disabled={paying} className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Full name" error={errors.name} className="sm:col-span-2">
                    <input id="c-name" autoComplete="name" className="field" value={customer.name} onChange={(e) => set('name', e.target.value)} {...err('name')} />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <input id="c-email" type="email" inputMode="email" autoComplete="email" className="field" value={customer.email} onChange={(e) => set('email', e.target.value)} {...err('email')} />
                  </Field>
                  <Field id="phone" label="Mobile number" error={errors.phone}>
                    <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel-national" className="field" value={customer.phone} onChange={(e) => set('phone', e.target.value)} {...err('phone')} />
                  </Field>
                  <Field id="address" label="Address" hint="House no., street, area" error={errors.address} className="sm:col-span-2">
                    <input id="c-address" autoComplete="street-address" className="field" value={customer.address} onChange={(e) => set('address', e.target.value)} {...err('address')} />
                  </Field>
                  <Field id="city" label="City" error={errors.city}>
                    <input id="c-city" autoComplete="address-level2" className="field" value={customer.city} onChange={(e) => set('city', e.target.value)} {...err('city')} />
                  </Field>
                  <Field id="state" label="State" error={errors.state}>
                    <input id="c-state" autoComplete="address-level1" className="field" value={customer.state} onChange={(e) => set('state', e.target.value)} {...err('state')} />
                  </Field>
                  <Field id="pincode" label="PIN code" error={errors.pincode}>
                    <input id="c-pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} className="field" value={customer.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} {...err('pincode')} />
                  </Field>
                </fieldset>
              </form>
            )}
          </div>

          <div className="self-start border border-line bg-paper p-6 lg:sticky lg:top-24">
            <dl className="space-y-3">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular font-semibold">{formatINR(subtotalPaise)}</dd></div>
              <div className="flex justify-between text-ink-soft"><dt>Shipping</dt><dd>{connected ? 'Free' : 'To be confirmed'}</dd></div>
              <div className="flex justify-between text-ink-soft"><dt>Taxes</dt><dd>{connected ? 'Included' : 'To be confirmed'}</dd></div>
              {connected && <div className="flex justify-between border-t border-line pt-3 text-lg"><dt className="font-semibold">Total</dt><dd className="tabular font-semibold">{formatINR(subtotalPaise)}</dd></div>}
            </dl>
            {status.kind === 'error' && (
              <div ref={resultRef} tabIndex={-1} role="alert" className="mt-5 border-l-4 border-danger bg-danger/5 p-3 focus:outline-none">
                <p className="font-semibold text-danger">Payment not completed.</p>
                <p className="mt-1 text-sm">{status.message}</p>
              </div>
            )}
            {connected ? (
              <button type="submit" form="checkout-form" disabled={paying} className="btn-primary mt-6 w-full">
                {paying ? 'Opening secure payment…' : `Pay ${formatINR(subtotalPaise)}`}
              </button>
            ) : (
              <button type="button" disabled className="btn-primary mt-6 w-full">Payment not connected</button>
            )}
            <p className="mt-3 text-sm text-ink-soft">
              {connected
                ? 'Payments are processed securely by Razorpay. We never see or store your card or bank details.'
                : 'Your cart is saved in this browser only. It holds product choices and quantities, nothing personal.'}
            </p>
            <Link to="/shop" className="link mt-4 inline-block">Continue shopping</Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ id, label, hint, error, className = '', children }: { id: string; label: string; hint?: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`c-${id}`} className="field-label">
        {label}
        {hint && <span className="ml-2 font-normal text-ink-soft">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}
