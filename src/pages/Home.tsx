import { Link } from 'react-router-dom';
import { ghee } from '../content/products';
import { giftBoxes } from '../content/gifts';
import { occasions } from '../content/corporate';
import { homeFaqs } from '../content/faqs';
import { culinaryUses } from '../content/learn';
import { formatINR } from '../lib/format';
import { useCart } from '../lib/cart';
import { usePageMeta } from '../lib/hooks';
import { Img } from '../components/Img';
import { GiftCard } from '../components/GiftCard';
import { ArrowLink, Disclosure, Eyebrow, SectionHeading } from '../components/ui';

export default function Home() {
  usePageMeta('', 'Gheeji A2 ghee in three jar sizes, ready-made gift boxes, and corporate gifting quotes for teams and clients.');
  return (
    <>
      <Hero />
      <ChooseJar />
      <KnowWhatYouBuy />
      <EverydayMeals />
      <Gifts />
      <Corporate />
      <Faqs />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <Eyebrow>A2 Ghee &amp; Thoughtful Gifting</Eyebrow>
          <h1 id="hero-title" className="mt-5 text-display font-light">
            A2 ghee for your home.
            <span className="block italic text-oxblood">Thoughtful gifts for your&nbsp;people.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-ink-soft sm:text-xl">
            Explore Gheeji ghee and gift boxes for everyday meals, celebrations, and thank-yous.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn-primary">Shop A2 Ghee</Link>
            <Link to="/corporate-gifting" className="btn-secondary">Explore Corporate Gifting</Link>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            Looking for a single gift? <Link to="/gifts" className="link">See the gift boxes</Link>
          </p>
        </div>
        <div className="relative">
          <div className="relative ml-auto w-[88%] sm:w-[80%] lg:w-[88%]">
            <Img id="heroComposition" ratio="4 / 5" priority sizes="(min-width: 1024px) 45vw, 85vw" className="max-h-[70vh] lg:max-h-none" />
          </div>
          <div className="absolute -bottom-6 left-0 w-[42%] border-[6px] border-ivory sm:w-[36%] lg:-bottom-10">
            <Img id="heroDetail" ratio="1 / 1" compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChooseJar() {
  const { add } = useCart();
  return (
    <section aria-labelledby="jar-title" className="section-y border-t border-line bg-paper">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="jar-title" eyebrow="Choose your jar" title="One ghee, three sizes." intro="The same Gheeji A2 Ghee in every jar. Pick the size that suits how often you cook with it." />
          <ArrowLink to={`/shop/${ghee.slug}`}>Full product details</ArrowLink>
        </div>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {ghee.variants.map((v, i) => (
            <li key={v.id} className={`flex flex-col ${i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-auto' : ''}`}>
              <Link to={`/shop/${ghee.slug}?size=${v.id}`} tabIndex={-1} aria-hidden="true"><Img id={v.image} ratio="4 / 5" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" /></Link>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
                <h3 className="font-serif text-4xl font-light">{v.label}</h3>
                <p className="tabular text-xl font-semibold">{formatINR(v.pricePaise)}</p>
              </div>
              <p className="mt-3 flex-1 text-ink-soft">{v.useCase}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn-primary flex-1" onClick={() => add({ kind: 'ghee', variantId: v.id, qty: 1 })}>
                  Add {v.label} to Cart
                </button>
                <Link to={`/shop/${ghee.slug}?size=${v.id}`} className="btn-secondary flex-1 px-4">
                  Details<span className="sr-only"> for the {v.label} jar</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function KnowWhatYouBuy() {
  const rows = [
    { n: '01', title: 'What is in the jar', body: 'Ingredients, net quantity and storage details, taken from the product label.', to: `/shop/${ghee.slug}#details`, cta: 'Product details' },
    { n: '02', title: 'What “A2” refers to', body: 'A plain explanation of the term, and what it does and does not tell you about ghee.', to: '/learn#a2', cta: 'Read the explainer' },
    { n: '03', title: 'How to read a ghee label', body: 'The details to look for on any jar, from the licence number to the net quantity.', to: '/learn#label', cta: 'Label checklist' },
    { n: '04', title: 'Where it comes from', body: 'Sourcing and production details will be published here once they are confirmed. We will not guess.', to: '/about#sourcing', cta: 'About Gheeji' },
  ];
  return (
    <section aria-labelledby="know-title" className="section-y">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="know-title" eyebrow="Know what you are buying" title="Clear information, not slogans." intro="Good food deserves a straight explanation. Here is where to find the facts about Gheeji ghee." />
        </div>
        <ol className="border-t border-line">
          {rows.map((r) => (
            <li key={r.n} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
              <span className="font-serif text-2xl text-gold" aria-hidden="true">{r.n}</span>
              <div>
                <h3 className="font-sans text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 text-ink-soft">{r.body}</p>
              </div>
              <div className="col-start-2 sm:col-start-3">
                <ArrowLink to={r.to}>{r.cta}</ArrowLink>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EverydayMeals() {
  return (
    <section aria-labelledby="meals-title" className="bg-sand">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:py-24">
        <Img id="mealDal" ratio="16 / 11" sizes="(min-width: 1024px) 55vw, 100vw" />
        <div>
          <SectionHeading id="meals-title" eyebrow="Ghee in everyday meals" title="From the tawa to the thali." />
          <ul className="mt-8 space-y-5">
            {culinaryUses.slice(0, 4).map((u) => (
              <li key={u.title} className="border-l-2 border-gold pl-4">
                <h3 className="font-sans text-base font-semibold">{u.title}</h3>
                <p className="mt-1 text-ink-soft">{u.body}</p>
              </li>
            ))}
          </ul>
          <ArrowLink to="/learn#cooking" className="mt-6">More ways to cook with ghee</ArrowLink>
        </div>
      </div>
    </section>
  );
}

function Gifts() {
  return (
    <section aria-labelledby="gifts-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="gifts-title" eyebrow="Gifts with a clear purpose" title="Open the box, and you know what is inside." intro="Three ready-made boxes with Gheeji ghee at the centre. Every item and pack size is listed." />
          <Link to="/gifts" className="btn-secondary shrink-0">Explore Gift Boxes</Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {giftBoxes.map((b) => <GiftCard key={b.id} box={b} />)}
        </div>
      </div>
    </section>
  );
}

function Corporate() {
  const asks = ['Approximate quantity', 'Budget per box', 'Branding or message needs', 'Delivery cities and timing'];
  return (
    <section aria-labelledby="corp-title" className="on-dark bg-oxblood text-ivory">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div>
          <Eyebrow>Corporate gifting</Eyebrow>
          <h2 id="corp-title" className="mt-4 text-h2 font-normal text-ivory">Gifts for your team and clients, planned with you.</h2>
          <p className="mt-5 max-w-xl text-lg text-ivory/85">
            Start from an Gheeji gift box and shape it around the occasion: a thank-you after a big quarter, a welcome for new joiners, or festive greetings to clients.
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {occasions.map((o) => (
              <li key={o.id} className="border-t border-ivory/25 pt-4">
                <h3 className="font-sans text-base font-semibold text-ivory">{o.label}</h3>
                <p className="mt-1 text-sm text-ivory/80">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-10 lg:border-l lg:border-ivory/20 lg:pl-16">
          <Img id="corporateHero" ratio="4 / 3" sizes="(min-width: 1024px) 40vw, 100vw" />
          <div>
            <h3 className="font-serif text-2xl text-ivory">What to share for a quote</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {asks.map((a) => (
                <li key={a} className="flex items-center gap-3 text-ivory/90"><span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />{a}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ivory/75">We reply with a written quotation. Nothing is final until you approve it.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/corporate-gifting#quote" className="btn-light !text-oxblood">Request a Quote</Link>
              <Link to="/corporate-gifting" className="btn-outline-light hover:!text-oxblood">How it works</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faqs() {
  return (
    <section aria-labelledby="faq-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading id="faq-title" eyebrow="Frequent questions" title="Good to know." />
        <div className="border-t border-line">
          {homeFaqs.map((f) => (
            <Disclosure key={f.q} title={f.q}>
              <p>{f.a}</p>
              {f.link && <ArrowLink to={f.link.to} className="mt-2">{f.link.label}</ArrowLink>}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section aria-label="Next steps" className="border-t border-line">
      <div className="grid md:grid-cols-2">
        <div className="bg-paper px-4 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="ml-auto max-w-lg">
            <Eyebrow>For your kitchen</Eyebrow>
            <h2 className="mt-4 text-h2 font-normal">Shop for yourself.</h2>
            <p className="mt-4 text-ink-soft">Choose a 200 ml, 500 ml or 1 litre jar of Gheeji A2 Ghee.</p>
            <Link to="/shop" className="btn-primary mt-8">Shop A2 Ghee</Link>
          </div>
        </div>
        <div className="bg-sand px-4 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="max-w-lg">
            <Eyebrow>For your team</Eyebrow>
            <h2 className="mt-4 text-h2 font-normal">Plan gifts for your people.</h2>
            <p className="mt-4 text-ink-soft">Share your quantity and budget, and start with a clear gifting brief.</p>
            <Link to="/corporate-gifting" className="btn-primary mt-8">Explore Corporate Gifting</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
