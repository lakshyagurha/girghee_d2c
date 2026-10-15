import { useState } from 'react';
import { Link } from 'react-router-dom';
import { customBox, giftBoxes } from '../content/gifts';
import { usePageMeta } from '../lib/hooks';
import { GiftCard } from '../components/GiftCard';
import { Img } from '../components/Img';
import { DraftNote, Eyebrow } from '../components/ui';

type Sort = 'price-asc' | 'price-desc';

export default function Gifts() {
  usePageMeta('Gift Boxes', 'Ready-made Ghee Culture gift boxes with A2 ghee, pantry favourites and a greeting card. Every item listed.');
  const [sort, setSort] = useState<Sort>('price-asc');
  const sorted = [...giftBoxes].sort((a, b) => ((a.pricePaise ?? 0) - (b.pricePaise ?? 0)) * (sort === 'price-asc' ? 1 : -1));

  return (
    <>
      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <Eyebrow>Gift boxes</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-display font-light">Something good to open, and to use.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">Each box is built around a jar of Ghee Culture A2 Ghee, with a greeting card for your note. The contents and pack sizes are listed on every box.</p>
          <div className="mt-4"><DraftNote>The box line-up is a draft for review. Contents may change before launch.</DraftNote></div>
        </div>
      </section>

      <section aria-labelledby="range-title" className="section-y pt-12">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="range-title" className="font-sans text-base font-semibold text-ink-soft">{giftBoxes.length} ready-made boxes</h2>
            <label className="flex items-center gap-3 text-sm font-semibold">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field w-auto py-2 pr-8">
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((b) => <GiftCard key={b.id} box={b} headingLevel={3} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="custom-title" className="border-t border-line bg-sand">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-[1fr_1.2fr] lg:py-20">
          <Img id={customBox.image} ratio="1 / 1" />
          <div>
            <Eyebrow>For teams and larger orders</Eyebrow>
            <h2 id="custom-title" className="mt-4 text-h2 font-normal">{customBox.name}</h2>
            <p className="mt-3 text-xl font-semibold">Price on quotation</p>
            <p className="mt-4 max-w-xl text-ink-soft">{customBox.description.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/corporate-gifting?box=custom#quote" className="btn-primary">Request a Quote</Link>
              <Link to="/corporate-gifting" className="btn-secondary">How corporate gifting works</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
