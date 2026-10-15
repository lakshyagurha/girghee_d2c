import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { budgetRanges, occasions, otherOccasion, quantityRanges } from '../content/corporate';
import { integrations } from '../content/brand';
import { EMAIL_RE, PHONE_RE, submitQuote, type QuoteRequest } from '../lib/quote';
import { boxOptions } from './briefOptions';
import { Icon } from './ui';

export const emptyQuote: QuoteRequest = {
  fullName: '', company: '', email: '', phone: '', quantity: '', budget: '', preferredBox: '',
  occasion: '', deliveryDate: '', cities: '', branding: '', notes: '', consent: false,
};

type Errors = Partial<Record<keyof QuoteRequest, string>>;

export function validateQuote(v: QuoteRequest): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = 'Enter your full name.';
  if (!v.company.trim()) e.company = 'Enter your company or organisation name.';
  if (!v.email.trim()) e.email = 'Enter your work email address.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email address in the format name@company.com.';
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = 'Enter a phone number with 10 to 13 digits, or leave this blank.';
  if (!v.quantity) e.quantity = 'Choose an approximate quantity, or “Not sure yet”.';
  if (!v.budget) e.budget = 'Choose a budget per box, or “Not sure yet”.';
  if (v.deliveryDate && v.deliveryDate < todayISO()) e.deliveryDate = 'Choose a date that is today or later.';
  if (!v.consent) e.consent = 'Please confirm we may use these details to respond to your enquiry.';
  return e;
}

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

const fieldOrder: (keyof QuoteRequest)[] = ['fullName', 'company', 'email', 'phone', 'quantity', 'budget', 'preferredBox', 'occasion', 'deliveryDate', 'cities', 'branding', 'notes', 'consent'];

type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'demo'; snapshot: QuoteRequest } | { kind: 'sent' } | { kind: 'error'; message: string };

export interface QuoteFormHandle { focusFirstIncomplete: () => void }

interface Props { value: QuoteRequest; onChange: (v: QuoteRequest) => void }

export const QuoteForm = forwardRef<QuoteFormHandle, Props>(function QuoteForm({ value, onChange }, ref) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focusFirstIncomplete() {
      const required: (keyof QuoteRequest)[] = ['fullName', 'company', 'email'];
      const target = required.find((k) => !String(value[k]).trim()) ?? 'fullName';
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${target}"]`);
      el?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  }));

  const set = <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => {
    const next = { ...value, [k]: v };
    onChange(next);
    if (submitted) setErrors(validateQuote(next));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateQuote(value);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus({ kind: 'loading' });
    const res = await submitQuote(value);
    if (res.mode === 'demo') setStatus({ kind: 'demo', snapshot: { ...value } });
    else if (res.mode === 'sent') setStatus({ kind: 'sent' });
    else setStatus({ kind: 'error', message: res.message });
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const reset = () => {
    onChange(emptyQuote);
    setErrors({});
    setSubmitted(false);
    setStatus({ kind: 'idle' });
  };

  if (status.kind === 'demo' || status.kind === 'sent') {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-line bg-paper p-6 focus:outline-none sm:p-8">
        {status.kind === 'demo' ? <DemoResult brief={status.snapshot} /> : (
          <>
            <p className="flex items-center gap-2 font-serif text-2xl text-navy"><Icon name="check" className="h-6 w-6" /> Thank you, your enquiry has been sent.</p>
            <p className="mt-3 text-ink-soft">We will reply to the email address you gave us.</p>
          </>
        )}
        <button type="button" onClick={reset} className="btn-secondary mt-6">Start a new brief</button>
      </div>
    );
  }

  const errorList = fieldOrder.filter((k) => errors[k]);
  const err = (k: keyof QuoteRequest) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-error` } : {});
  const box = boxOptions;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="quote-title" className="border border-line bg-paper p-5 sm:p-8">
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="mb-8 border-l-4 border-danger bg-danger/5 p-4 focus:outline-none">
          <h3 id="error-summary-title" className="font-sans text-base font-semibold text-danger">Please check {errorList.length === 1 ? '1 field' : `${errorList.length} fields`}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {errorList.map((k) => (
              <li key={k}><a href={`#q-${k}`} className="text-danger underline underline-offset-2" onClick={(ev) => { ev.preventDefault(); document.getElementById(`q-${k}`)?.focus(); }}>{errors[k]}</a></li>
            ))}
          </ul>
        </div>
      )}
      {status.kind === 'error' && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="mb-8 border-l-4 border-danger bg-danger/5 p-4 focus:outline-none">
          <p className="font-semibold text-danger">Your enquiry was not sent.</p>
          <p className="mt-1 text-sm">{status.message}</p>
        </div>
      )}

      <p className="text-sm text-ink-soft">Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>

      <fieldset className="mt-6">
        <legend className="font-serif text-xl">About you</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full name" required error={errors.fullName}>
            <input id="q-fullName" name="fullName" autoComplete="name" className="field" value={value.fullName} onChange={(e) => set('fullName', e.target.value)} {...err('fullName')} />
          </Field>
          <Field id="company" label="Company" required error={errors.company}>
            <input id="q-company" name="company" autoComplete="organization" className="field" value={value.company} onChange={(e) => set('company', e.target.value)} {...err('company')} />
          </Field>
          <Field id="email" label="Work email" required error={errors.email}>
            <input id="q-email" name="email" type="email" inputMode="email" autoComplete="email" className="field" value={value.email} onChange={(e) => set('email', e.target.value)} {...err('email')} />
          </Field>
          <Field id="phone" label="Phone" hint="Optional" error={errors.phone}>
            <input id="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" value={value.phone} onChange={(e) => set('phone', e.target.value)} {...err('phone')} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-serif text-xl">Your gifting</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="quantity" label="Approximate quantity" required error={errors.quantity}>
            <select id="q-quantity" name="quantity" className="field" value={value.quantity} onChange={(e) => set('quantity', e.target.value)} {...err('quantity')}>
              <option value="">Choose a range</option>
              {quantityRanges.map((q) => <option key={q}>{q}</option>)}
            </select>
          </Field>
          <Field id="budget" label="Budget per box" required error={errors.budget}>
            <select id="q-budget" name="budget" className="field" value={value.budget} onChange={(e) => set('budget', e.target.value)} {...err('budget')}>
              <option value="">Choose a range</option>
              {budgetRanges.map((b) => <option key={b.label}>{b.label}</option>)}
            </select>
          </Field>
          <Field id="preferredBox" label="Preferred box" hint="Optional">
            <select id="q-preferredBox" name="preferredBox" className="field" value={value.preferredBox} onChange={(e) => set('preferredBox', e.target.value)}>
              <option value="">No preference</option>
              {box.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </Field>
          <Field id="occasion" label="Occasion" hint="Optional">
            <select id="q-occasion" name="occasion" className="field" value={value.occasion} onChange={(e) => set('occasion', e.target.value)}>
              <option value="">Choose an occasion</option>
              {[...occasions, otherOccasion].map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </Field>
          <Field id="deliveryDate" label="Desired delivery date" hint="Optional" error={errors.deliveryDate}>
            <input id="q-deliveryDate" name="deliveryDate" type="date" min={todayISO()} className="field" value={value.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} {...err('deliveryDate')} />
          </Field>
          <Field id="cities" label="Delivery city or cities" hint="Optional">
            <input id="q-cities" name="cities" className="field" placeholder="e.g. Bengaluru, Pune" value={value.cities} onChange={(e) => set('cities', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="branding" label="Branding needs" hint="Optional: logo, sleeve, card message">
              <input id="q-branding" name="branding" className="field" value={value.branding} onChange={(e) => set('branding', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id="notes" label="Anything else" hint="Optional">
              <textarea id="q-notes" name="notes" rows={4} className="field" value={value.notes} onChange={(e) => set('notes', e.target.value)} />
            </Field>
          </div>
        </div>
      </fieldset>

      <div className="mt-8">
        <label htmlFor="q-consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="q-consent" name="consent" type="checkbox" checked={value.consent}
            onChange={(e) => set('consent', e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 accent-navy"
            {...err('consent')}
          />
          <span className="text-[0.95rem]">
            Ghee Culture may use these details to respond to this enquiry. <span aria-hidden="true">*</span>
            <span className="block text-sm text-ink-soft">They will not be used for marketing. See the <Link to="/policies/privacy" className="link">privacy notice (draft)</Link>.</span>
          </span>
        </label>
        {errors.consent && <p id="consent-error" className="mt-2 text-sm font-medium text-danger">{errors.consent}</p>}
      </div>

      <p className="mt-8 border-t border-line pt-5 text-sm text-ink-soft">
        Final contents, taxes, shipping, customisation costs, lead time and any minimum order are confirmed in your quotation. Sending this form does not commit you to an order.
      </p>
      {!integrations.quoteForm.connected && (
        <p className="mt-3 text-sm font-semibold text-brass">Demo mode: this form is not connected. Nothing will be sent or stored.</p>
      )}
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto" disabled={status.kind === 'loading'} aria-busy={status.kind === 'loading'}>
        {status.kind === 'loading' ? 'Sending…' : 'Request a Quote'}
      </button>
    </form>
  );
});

function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`q-${id}`} className="field-label">
        {label}{required && <span aria-hidden="true"> *</span>}
        {hint && <span className="ml-2 font-normal text-ink-soft">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}

function DemoResult({ brief }: { brief: QuoteRequest }) {
  const occ = [...occasions, otherOccasion].find((o) => o.id === brief.occasion)?.label;
  const boxLabel = boxOptions.find((b) => b.id === brief.preferredBox)?.label;
  const rows: [string, string | undefined][] = [
    ['Name', brief.fullName], ['Company', brief.company], ['Email', brief.email], ['Phone', brief.phone],
    ['Quantity', brief.quantity], ['Budget per box', brief.budget], ['Preferred box', boxLabel], ['Occasion', occ],
    ['Delivery date', brief.deliveryDate], ['Cities', brief.cities], ['Branding', brief.branding], ['Notes', brief.notes],
  ];
  return (
    <>
      <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Demo only</p>
      <p className="mt-3 font-serif text-2xl">Demo only: your request has not been sent.</p>
      <p className="mt-2 text-ink-soft">This prototype is not connected to an enquiry service. Here is the brief you prepared. It is shown only on this screen and has not been saved or sent anywhere.</p>
      <dl className="mt-6 grid gap-x-6 sm:grid-cols-2">
        {rows.filter(([, v]) => v && v.trim()).map(([k, v]) => (
          <div key={k} className="border-t border-line py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">{k}</dt>
            <dd className="mt-0.5 break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
