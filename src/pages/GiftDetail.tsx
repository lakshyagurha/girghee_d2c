import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGiftBySlug, giftBoxes, itemCount } from '../content/gifts';
import { images, type ImageId } from '../content/images';
import { formatINR, formatPack } from '../lib/format';
import { useCart } from '../lib/cart';
import { usePageMeta } from '../lib/hooks';
import { Gallery } from '../components/Gallery';
import { GiftCard } from '../components/GiftCard';
import { DraftNote, ProvenanceTag, QtyStepper, SectionHeading } from '../components/ui';
import NotFound from './NotFound';

export default function GiftDetail() {
  const { slug } = useParams();
  const box = getGiftBySlug(slug);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  usePageMeta(box?.name ?? 'Gift box not found', box?.description.text ?? undefined);
  if (!box || box.pricePaise == null) return <NotFound />;

  const n = itemCount(box);
  const gallery: { id: ImageId; caption: string }[] = [
    { id: box.images.open, caption: 'What’s inside' },
    { id: box.images.closed, caption: 'Closed box' },
    // Only show the laid-out contents view once a real photo exists for it.
    ...(box.images.contents && images[box.images.contents].src ? [{ id: box.images.contents, caption: 'Contents laid out' }] : []),
  ];
  const others = giftBoxes.filter((b) => b.id !== box.id);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-x pt-6 text-sm text-ink-soft">
        <ol className="flex flex-wrap gap-2">
          <li><Link to="/" className="hover:text-navy hover:underline">Home</Link> <span aria-hidden="true">/</span></li>
          <li><Link to="/gifts" className="hover:text-navy hover:underline">Gift Boxes</Link> <span aria-hidden="true">/</span></li>
          <li aria-current="page" className="text-ink">{box.name}</li>
        </ol>
      </nav>

      <section className="container-x grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24">
        <Gallery items={gallery} label={`${box.name} images`} ratio="1 / 1" />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="text-h2 font-normal">{box.name}</h1>
          <p className="tabular mt-3 text-2xl font-semibold">{formatINR(box.pricePaise)}</p>
          <p className="mt-1 text-sm text-ink-soft">Illustrative prototype price for a single box.</p>
          <p className="mt-5 text-ink-soft">{box.description.text}</p>
          <div className="mt-2"><ProvenanceTag status={box.description.status} /></div>

          <div className="mt-8 border border-line bg-paper p-5">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-navy">What’s inside · {n} items</h2>
            <table className="mt-3 w-full text-left text-[0.95rem]">
              <caption className="sr-only">Contents of the {box.name}</caption>
              <thead className="sr-only"><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Pack size</th></tr></thead>
              <tbody>
                {box.contents.map((i, k) => (
                  <tr key={k} className="border-t border-line first:border-t-0">
                    <th scope="row" className="py-2.5 pr-3 font-medium">{i.name}</th>
                    <td className="tabular py-2.5 pr-3 text-ink-soft">× {i.quantity}</td>
                    <td className="py-2.5 text-right text-ink-soft">{formatPack(i.pack) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-ink-soft">Packed in an Gheeji gift box (packaging, not counted as an item).</p>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <div>
              <span className="mb-1.5 block text-sm font-semibold">Quantity</span>
              <QtyStepper value={qty} onChange={setQty} label="Quantity" />
            </div>
            <button type="button" onClick={() => add({ kind: 'gift', giftId: box.id, qty })} className="btn-primary min-w-[12rem] flex-1">
              Add to Cart · <span className="tabular">{formatINR(box.pricePaise * qty)}</span>
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">Ordering for a team, or want changes?</p>
            <Link to={`/corporate-gifting?box=${box.id}#quote`} className="btn-secondary">Request a Bulk Quote</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="personal-title" className="border-y border-line bg-paper">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:py-20">
          <SectionHeading id="personal-title" eyebrow="Personalisation" title="Make it yours." />
          <div>
            <h3 className="font-sans text-base font-semibold">Ideal for</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {box.idealFor.map((t) => <li key={t} className="rounded-soft bg-sand px-3 py-1.5 text-sm text-navy">{t}</li>)}
            </ul>
            <h3 className="mt-8 font-sans text-base font-semibold">Proposed options</h3>
            <ul className="mt-2 space-y-2 text-ink-soft">
              {box.personalisation.map((p) => <li key={p} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />{p}</li>)}
            </ul>
            <div className="mt-5"><DraftNote>Personalisation options are proposals. Any custom arrangement is confirmed by quotation before an order goes ahead.</DraftNote></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="more-title" eyebrow="Compare" title="Other Gheeji boxes" />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {others.map((b) => <GiftCard key={b.id} box={b} />)}
          </div>
        </div>
      </section>
    </>
  );
}
