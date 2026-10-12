import { Link } from 'react-router-dom';
import { ghee } from '../content/products';
import { giftBoxes } from '../content/gifts';
import { formatINR } from '../lib/format';
import { useCart } from '../lib/cart';
import { usePageMeta } from '../lib/hooks';
import { Img } from '../components/Img';
import { ArrowLink, Eyebrow, ProvenanceTag, SectionHeading } from '../components/ui';

export default function Shop() {
  usePageMeta('Shop A2 Ghee', 'Gheeji A2 Ghee in 200 ml, 500 ml and 1 litre glass jars.');
  const { add } = useCart();
  return (
    <>
      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-display font-light">Gheeji A2 Ghee</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{ghee.description.text}</p>
          <div className="mt-3"><ProvenanceTag status={ghee.description.status} /></div>
        </div>
      </section>

      <section aria-labelledby="sizes-title" className="section-y">
        <div className="container-x">
          <h2 id="sizes-title" className="sr-only">Jar sizes</h2>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {ghee.variants.map((v) => (
              <li key={v.id} className="flex flex-col">
                <Link to={`/shop/${ghee.slug}?size=${v.id}`} tabIndex={-1} aria-hidden="true"><Img id={v.image} ratio="4 / 5" /></Link>
                <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-navy">{ghee.name}</h3>
                <div className="mt-1 flex items-baseline justify-between gap-3 border-b border-line pb-3">
                  <p className="font-serif text-4xl font-light">{v.label}</p>
                  <p className="tabular text-xl font-semibold">{formatINR(v.pricePaise)}</p>
                </div>
                <p className="mt-3 flex-1 text-ink-soft">{v.useCase}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" className="btn-primary flex-1" onClick={() => add({ kind: 'ghee', variantId: v.id, qty: 1 })}>Add {v.label} to Cart</button>
                  <Link to={`/shop/${ghee.slug}?size=${v.id}`} className="btn-secondary flex-1 px-4">View details<span className="sr-only"> for {v.label}</span></Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="compare-title" className="border-y border-line bg-paper">
        <div className="container-x py-14">
          <h2 id="compare-title" className="text-h3 font-normal">Compare sizes</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left">
              <caption className="sr-only">Gheeji A2 Ghee sizes and prices</caption>
              <thead>
                <tr className="border-b border-line text-sm text-ink-soft">
                  <th scope="col" className="py-3 pr-4 font-semibold">Jar</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Price</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Price per 100 ml</th>
                  <th scope="col" className="py-3 font-semibold">Suits</th>
                </tr>
              </thead>
              <tbody>
                {ghee.variants.map((v) => {
                  const ml = v.volume.unit === 'l' ? v.volume.value * 1000 : v.volume.value;
                  return (
                    <tr key={v.id} className="border-b border-line">
                      <th scope="row" className="py-4 pr-4 font-semibold">{v.label}</th>
                      <td className="tabular py-4 pr-4">{formatINR(v.pricePaise)}</td>
                      <td className="tabular py-4 pr-4 text-ink-soft">{formatINR(Math.round(v.pricePaise / (ml / 100)))}</td>
                      <td className="py-4 text-ink-soft">{v.useCase}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="also-title" className="section-y">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <Img id={giftBoxes[1].images.open} ratio="4 / 3" />
          <div>
            <SectionHeading id="also-title" eyebrow="Giving ghee as a gift?" title="Every Gheeji gift box includes a jar." intro="Choose a ready-made box with ghee, pantry favourites and a greeting card." />
            <div className="mt-6 flex flex-wrap gap-x-6">
              <ArrowLink to="/gifts">See gift boxes</ArrowLink>
              <ArrowLink to="/learn">Learn about ghee</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
