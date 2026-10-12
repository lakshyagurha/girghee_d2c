import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { budgetRanges, customisationOptions, occasions, otherOccasion, packagingDetails, process, quantityRanges, seasonal } from '../content/corporate';
import { customBox, giftBoxes, itemCount } from '../content/gifts';
import { corporateFaqs } from '../content/faqs';
import { formatINR, formatPack } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import type { QuoteRequest } from '../lib/quote';
import { Img } from '../components/Img';
import { QuoteForm, emptyQuote, type QuoteFormHandle } from '../components/QuoteForm';
import { boxOptions } from '../components/briefOptions';
import { Disclosure, DraftNote, Eyebrow, SectionHeading } from '../components/ui';

const validBox = (id: string | null) => (id && boxOptions.some((b) => b.id === id) ? id : '');
const validOccasion = (id: string | null) => (id && [...occasions, otherOccasion].some((o) => o.id === id) ? id : '');

export default function Corporate() {
  usePageMeta('Corporate Gifting', 'Plan Gheeji gift boxes for employees, clients, onboarding and festive occasions. Share your budget and requirements to request a quote.');
  const [params] = useSearchParams();
  const formRef = useRef<QuoteFormHandle>(null);

  const [quote, setQuote] = useState<QuoteRequest>(() => ({
    ...emptyQuote,
    preferredBox: validBox(params.get('box')),
    occasion: validOccasion(params.get('occasion')),
  }));

  // A box chosen elsewhere on the site (e.g. "Request a Bulk Quote") prefills the form.
  useEffect(() => {
    const box = validBox(params.get('box'));
    if (box) setQuote((q) => ({ ...q, preferredBox: box }));
  }, [params]);

  const chooseBox = (id: string) => {
    setQuote((q) => ({ ...q, preferredBox: id }));
    document.getElementById('brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="overflow-hidden border-b border-line">
        <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
          <div>
            <Eyebrow>Corporate gifting</Eyebrow>
            <h1 className="mt-5 text-display font-light">A thoughtful thank-you, <span className="italic text-oxblood">beautifully boxed.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">Plan Gheeji gift boxes for your team, clients, and special occasions. Share your budget and requirements, and start with a clear gifting brief.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#brief" className="btn-primary">Request a Quote</a>
              <Link to="/gifts" className="btn-secondary">Explore Gift Boxes</Link>
            </div>
          </div>
          <Img id="corporateHero" ratio="4 / 3" priority sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>

      {/* Questions this page answers */}
      <nav aria-label="On this page" className="border-b border-line bg-paper">
        <ul className="container-x flex gap-x-8 gap-y-1 overflow-x-auto py-3 text-sm font-semibold">
          {[['#occasions', 'What can I give?'], ['#range', 'What is inside?'], ['#branding', 'Can it carry our branding?'], ['#brief', 'What do you need for a quote?']].map(([h, l]) => (
            <li key={h} className="shrink-0"><a href={h} className="inline-flex min-h-[44px] items-center text-navy hover:underline">{l}</a></li>
          ))}
        </ul>
      </nav>

      <section id="occasions" aria-labelledby="occ-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="occ-title" eyebrow="Occasions" title="What can I give, and when?" />
          <ul className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((o, i) => (
              <li key={o.id} className={`border-b border-line py-8 sm:px-6 ${i % 2 === 0 ? 'sm:pl-0' : ''} lg:border-b-0 lg:border-r lg:last:border-r-0 ${i === 0 ? 'lg:pl-0' : ''}`}>
                <span className="font-serif text-xl text-gold" aria-hidden="true">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl">{o.label}</h3>
                <p className="mt-2 text-ink-soft">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {seasonal.enabled && (
        <section aria-labelledby="season-title" className="bg-gold-soft">
          <div className="container-x flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <Eyebrow>{seasonal.eyebrow}</Eyebrow>
              <h2 id="season-title" className="mt-3 text-h3 font-normal">{seasonal.title}</h2>
              <p className="mt-2 text-ink-soft">{seasonal.body}</p>
            </div>
            <a href="#brief" onClick={() => setQuote((q) => ({ ...q, occasion: seasonal.cta.occasion }))} className="btn-primary shrink-0">{seasonal.cta.label}</a>
          </div>
        </section>
      )}

      <section id="range" aria-labelledby="range-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="range-title" eyebrow="The range" title="What is inside each box?" intro="Start from a ready-made box. Prices are for single boxes. Bulk and custom orders are priced by quotation." />
          <div className="mt-12 space-y-6">
            {giftBoxes.map((b) => (
              <article key={b.id} className="grid gap-6 border border-line bg-paper p-4 sm:p-6 md:grid-cols-[14rem_1fr_auto] md:items-center lg:grid-cols-[16rem_1fr_auto] lg:gap-10">
                <Img id={b.images.open} ratio="1 / 1" />
                <div>
                  <h3 className="text-h3 font-normal">{b.name}</h3>
                  <p className="mt-1 text-ink-soft">{b.description.text}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-navy">{itemCount(b)} items</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {b.contents.map((i, k) => (
                      <li key={k} className="rounded-soft border border-line px-2.5 py-1 text-sm">{i.quantity} × {i.name}{i.pack ? `, ${formatPack(i.pack)}` : ''}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-row items-center justify-between gap-4 border-t border-line pt-4 md:flex-col md:items-end md:border-0 md:pt-0">
                  <p className="text-right"><span className="tabular block text-xl font-semibold">{formatINR(b.pricePaise!)}</span><span className="text-sm text-ink-soft">single box</span></p>
                  <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                    <button type="button" onClick={() => chooseBox(b.id)} className="btn-primary px-5" aria-label={`Start a brief with the ${b.name}`}>Start with this box</button>
                    <Link to={`/gifts/${b.slug}`} className="btn-secondary px-5">Details<span className="sr-only"> of {b.name}</span></Link>
                  </div>
                </div>
              </article>
            ))}
            <article className="grid gap-6 border border-dashed border-navy/40 p-4 sm:p-6 md:grid-cols-[14rem_1fr_auto] md:items-center lg:grid-cols-[16rem_1fr_auto] lg:gap-10">
              <Img id={customBox.image} ratio="1 / 1" />
              <div>
                <h3 className="text-h3 font-normal">{customBox.name}</h3>
                <p className="mt-1 text-ink-soft">{customBox.description.text}</p>
              </div>
              <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                <p className="text-lg font-semibold">On quotation</p>
                <button type="button" onClick={() => chooseBox(customBox.id)} className="btn-primary px-5">Start a custom brief</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="branding" aria-labelledby="brand-title" className="border-y border-line bg-paper">
        <div className="container-x section-y">
          <SectionHeading id="brand-title" eyebrow="Packaging and branding" title="Can it carry our branding?" intro="These are the options we propose to offer. Each one is confirmed, with its cost, in your quotation." />
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {packagingDetails.map((p) => (
              <li key={p.title}>
                <Img id={p.image} ratio="1 / 1" />
                <h3 className="mt-4 font-sans text-base font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-14 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {customisationOptions.map((c) => (
              <div key={c.title} className="border-b border-line py-5 lg:border-b-0">
                <dt className="font-semibold">{c.title}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{c.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6"><DraftNote>Proposed options, subject to confirmation. Capabilities, quantities, delivery coverage and turnaround are not guaranteed until they are set out in a written quotation.</DraftNote></div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="process-title" eyebrow="How it works" title="From brief to delivery, in four steps." />
          <ol className="mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            {process.map((s, i) => (
              <li key={s.title} className="relative border-t-2 border-navy pt-5">
                <span className="text-sm font-semibold text-brass">Step {i + 1}</span>
                <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="brief" aria-labelledby="brief-title" className="border-t border-line bg-sand">
        <div className="container-x section-y">
          <SectionHeading id="brief-title" eyebrow="Build your gifting brief" title="Tell us what you have in mind." intro="Pick a few options to see which boxes fit, then carry your choices into the quote form. This is not a binding quotation." />
          <BriefBuilder quote={quote} setQuote={setQuote} onContinue={() => formRef.current?.focusFirstIncomplete()} />
        </div>
      </section>

      <section id="quote" aria-labelledby="quote-title" className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Request a quote</Eyebrow>
            <h2 id="quote-title" className="mt-4 text-h2 font-normal">Share your requirements.</h2>
            <p className="mt-4 text-ink-soft">The more you tell us, the more useful our first proposal will be. If you are unsure of a number, choose “Not sure yet”.</p>
          </div>
          <QuoteForm ref={formRef} value={quote} onChange={setQuote} />
        </div>
      </section>

      <section aria-labelledby="cfaq-title" className="border-t border-line bg-paper">
        <div className="container-x section-y grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeading id="cfaq-title" eyebrow="Questions" title="Before you ask for a quote." />
          <div className="border-t border-line">
            {corporateFaqs.map((f) => <Disclosure key={f.q} title={f.q}><p>{f.a}</p></Disclosure>)}
          </div>
        </div>
      </section>
    </>
  );
}

function ChoiceGroup({ legend, name, options, value, onChange }: { legend: string; name: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-soft border px-3.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${checked ? 'border-navy bg-navy font-semibold text-ivory' : 'border-navy/30 bg-paper text-ink hover:border-navy'}`}>
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {checked && <span aria-hidden="true" className="mr-1.5">✓</span>}{o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function BriefBuilder({ quote, setQuote, onContinue }: { quote: QuoteRequest; setQuote: React.Dispatch<React.SetStateAction<QuoteRequest>>; onContinue: () => void }) {
  const update = (k: keyof QuoteRequest) => (v: string) => setQuote((q) => ({ ...q, [k]: v }));
  const budget = budgetRanges.find((b) => b.label === quote.budget);
  const fits = budget && budget.label !== 'Not sure yet'
    ? giftBoxes.filter((b) => budget.maxPaise == null || (b.pricePaise ?? Infinity) <= budget.maxPaise)
    : null;
  const chosen = boxOptions.find((b) => b.id === quote.preferredBox);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-8 border border-navy/15 bg-ivory p-5 sm:p-8">
        <ChoiceGroup legend="Occasion" name="b-occasion" value={quote.occasion} onChange={update('occasion')}
          options={[...occasions, otherOccasion].map((o) => ({ value: o.id, label: o.label }))} />
        <ChoiceGroup legend="Approximate quantity" name="b-qty" value={quote.quantity} onChange={update('quantity')}
          options={quantityRanges.map((q) => ({ value: q, label: q }))} />
        <ChoiceGroup legend="Budget per box" name="b-budget" value={quote.budget} onChange={update('budget')}
          options={budgetRanges.map((b) => ({ value: b.label, label: b.label }))} />
        <ChoiceGroup legend="Preferred box" name="b-box" value={quote.preferredBox} onChange={update('preferredBox')}
          options={boxOptions.map((b) => ({ value: b.id, label: b.label.replace(/ \(.*\)$/, '') }))} />
      </div>
      <aside aria-labelledby="brief-summary-title" className="flex flex-col border border-navy/15 bg-paper p-5 sm:p-8 lg:sticky lg:top-24 lg:self-start">
        <h3 id="brief-summary-title" className="font-serif text-2xl">Your brief so far</h3>
        <dl className="mt-5 space-y-3 text-[0.95rem]">
          {[
            ['Occasion', [...occasions, otherOccasion].find((o) => o.id === quote.occasion)?.label],
            ['Quantity', quote.quantity],
            ['Budget per box', quote.budget],
            ['Preferred box', chosen?.label],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-ink-soft">{k}</dt>
              <dd className={`text-right ${v ? 'font-semibold' : 'text-ink-soft'}`}>{v || 'Not chosen'}</dd>
            </div>
          ))}
        </dl>
        <div aria-live="polite" className="mt-5 text-sm text-ink-soft">
          {fits && (fits.length > 0
            ? <p>Ready-made boxes within this budget: <strong className="text-ink">{fits.map((b) => b.name.replace('Gheeji ', '')).join(', ')}</strong>. A custom box can also be built to this budget.</p>
            : <p>None of the ready-made boxes fall within this budget, but a custom box could be built to it.</p>)}
        </div>
        <button type="button" onClick={onContinue} className="btn-primary mt-6 w-full">Continue to quote form</button>
        <p className="mt-3 text-xs text-ink-soft">Your choices are copied into the form below. Nothing is sent until you submit it.</p>
      </aside>
    </div>
  );
}
