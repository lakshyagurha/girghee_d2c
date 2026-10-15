import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ghee, getVariant, PENDING_COPY } from '../content/products';
import { giftBoxes } from '../content/gifts';
import type { ImageId } from '../content/images';
import { formatINR } from '../lib/format';
import { useCart } from '../lib/cart';
import { usePageMeta } from '../lib/hooks';
import { Gallery } from '../components/Gallery';
import { GiftCard } from '../components/GiftCard';
import { ArrowLink, Disclosure, ProvenanceTag, QtyStepper, SectionHeading } from '../components/ui';
import NotFound from './NotFound';

export default function GheeDetail() {
  const { slug } = useParams();
  if (slug !== ghee.slug) return <NotFound />;
  return <GheeDetailPage />;
}

function GheeDetailPage() {
  const [params, setParams] = useSearchParams();
  const variant = getVariant(params.get('size')) ?? getVariant(ghee.defaultVariantId)!;
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  usePageMeta(`${ghee.name}, ${variant.label}`, `${ghee.name} in a ${variant.label} jar. ${ghee.description.text ?? ''}`);

  const selectVariant = (id: string) => setParams((p) => { p.set('size', id); return p; }, { replace: true, preventScrollReset: true });

  // Gallery: the selected jar first, then shared detail images.
  const galleryItems: { id: ImageId; caption: string }[] = [
    { id: variant.image, caption: `${variant.label} jar` },
    { id: 'gheeTexture', caption: 'Texture, open jar' },
    { id: 'gheeLabel', caption: 'Back label' },
    { id: 'gheeKitchen', caption: 'In the kitchen' },
  ];

  // Mobile purchase bar: only appears once the main Add to Cart button has scrolled out of view.
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    // Hidden again once the footer is on screen, so it never covers footer links.
    let buyAbove = false;
    let footerVisible = false;
    const footer = document.querySelector('footer');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === el) buyAbove = !e.isIntersecting && e.boundingClientRect.top < 0;
        else footerVisible = e.isIntersecting;
      }
      setShowBar(buyAbove && !footerVisible);
    });
    io.observe(el);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const addToCart = () => add({ kind: 'ghee', variantId: variant.id, qty });

  return (
    <div className={showBar ? 'pb-24 lg:pb-0' : ''}>
      <nav aria-label="Breadcrumb" className="container-x pt-6 text-sm text-ink-soft">
        <ol className="flex flex-wrap gap-2">
          <li><Link to="/" className="hover:text-navy hover:underline">Home</Link> <span aria-hidden="true">/</span></li>
          <li><Link to="/shop" className="hover:text-navy hover:underline">Shop Ghee</Link> <span aria-hidden="true">/</span></li>
          <li aria-current="page" className="text-ink">{ghee.name}</li>
        </ol>
      </nav>

      <section className="container-x grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24">
        <Gallery items={galleryItems} activeId={variant.image} label={`${ghee.name} images`} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="text-h2 font-normal">{ghee.name}</h1>
          <p className="tabular mt-3 text-2xl font-semibold" aria-live="polite">
            {formatINR(variant.pricePaise)} <span className="text-base font-normal text-ink-soft">· {variant.label}</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">Illustrative prototype price. Inclusive pricing and taxes to be confirmed.</p>
          <p className="mt-5 text-ink-soft">{ghee.description.text}</p>

          <fieldset className="mt-8">
            <legend className="text-sm font-semibold">Jar size</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {ghee.variants.map((v) => {
                const checked = v.id === variant.id;
                return (
                  <label key={v.id} className={`relative flex min-h-[64px] cursor-pointer flex-col items-center justify-center rounded-soft border px-2 py-2 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${checked ? 'border-navy bg-sand/60 ring-1 ring-navy' : 'border-ink/20 bg-paper hover:border-navy/60'}`}>
                    <input type="radio" name="size" value={v.id} checked={checked} onChange={() => selectVariant(v.id)} className="sr-only" />
                    <span className="font-semibold">{v.label}</span>
                    <span className="tabular text-sm text-ink-soft">{formatINR(v.pricePaise)}</span>
                  </label>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink-soft">{variant.useCase}</p>
          </fieldset>

          <div ref={buyRef} className="mt-6 flex flex-wrap items-end gap-3">
            <div>
              <span className="mb-1.5 block text-sm font-semibold" id="qty-label">Quantity</span>
              <QtyStepper value={qty} onChange={setQty} label="Quantity" />
            </div>
            <button type="button" onClick={addToCart} className="btn-primary min-w-[12rem] flex-1">
              Add to Cart · <span className="tabular">{formatINR(variant.pricePaise * qty)}</span>
            </button>
          </div>

          <div className="mt-8 border-t border-line pt-5 text-sm text-ink-soft">
            Giving it as a gift? <Link to="/gifts" className="link">Every Ghee Culture gift box includes a jar</Link>. For teams, see <Link to="/corporate-gifting" className="link">corporate gifting</Link>.
          </div>
        </div>
      </section>

      <section id="details" aria-labelledby="details-title" className="border-t border-line bg-paper">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:py-24">
          <div>
            <SectionHeading id="details-title" eyebrow="Product information" title="What is on the label." intro="Each section below will match the approved product label. Anything not yet confirmed is marked as awaiting information." />
          </div>
          <div className="border-t border-line">
            <Disclosure title="Net quantity" defaultOpen>
              <ul className="space-y-1">
                {ghee.variants.map((v) => (
                  <li key={v.id}>{v.label} jar: volume {v.label}{v.netMass ? `, net weight ${v.netMass.value} ${v.netMass.unit}` : ' (net weight awaiting label confirmation)'}</li>
                ))}
              </ul>
            </Disclosure>
            {ghee.info.map((s) => (
              <Disclosure key={s.id} title={<span className="flex flex-wrap items-center gap-2">{s.title} <ProvenanceTag status={s.content.status} /></span>}>
                <p>{s.content.text ?? PENDING_COPY}</p>
                {s.generalNote && <p className="mt-3"><strong className="font-semibold text-ink">General guidance (not Ghee Culture-specific): </strong>{s.generalNote}</p>}
                {s.link && <ArrowLink to={s.link.to} className="mt-2">{s.link.label}</ArrowLink>}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="gift-link-title" className="section-y">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="gift-link-title" eyebrow="Also from Ghee Culture" title="Ghee, boxed as a gift." />
            <ArrowLink to="/gifts">All gift boxes</ArrowLink>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {giftBoxes.slice(1).map((b) => <GiftCard key={b.id} box={b} />)}
          </div>
        </div>
      </section>

      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 backdrop-blur-sm lg:hidden">
          <div className="container-x flex items-center gap-3 py-3 pb-safe">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{ghee.name}</p>
              <p className="tabular text-sm text-ink-soft">{variant.label} · {qty} × {formatINR(variant.pricePaise)}</p>
            </div>
            <button type="button" onClick={addToCart} className="btn-primary shrink-0 px-5">Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}
