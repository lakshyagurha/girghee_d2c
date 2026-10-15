import { Link } from 'react-router-dom';
import { itemCount, type GiftBox } from '../content/gifts';
import { formatINR, formatPack } from '../lib/format';
import { useCart } from '../lib/cart';
import { Img } from './Img';

export function GiftCard({ box, headingLevel = 3 }: { box: GiftBox; headingLevel?: 2 | 3 }) {
  const { add } = useCart();
  const H = `h${headingLevel}` as 'h3';
  const n = itemCount(box);
  return (
    <article className="flex flex-col border border-line bg-paper">
      <Link to={`/gifts/${box.slug}`} tabIndex={-1} aria-hidden="true" className="block">
        <Img id={box.images.open} ratio="1 / 1" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <H className="text-h3 font-normal">
            <Link to={`/gifts/${box.slug}`} className="hover:text-navy">{box.name.replace('Ghee Culture ', '')}</Link>
          </H>
          <p className="tabular shrink-0 text-lg font-semibold">{box.pricePaise != null ? formatINR(box.pricePaise) : 'On quote'}</p>
        </div>
        <p className="mt-2 text-ink-soft">{box.description.text}</p>
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">Inside · {n} items</p>
          <ul className="mt-2 space-y-1 text-[0.95rem]">
            {box.contents.map((i, k) => (
              <li key={k} className="flex justify-between gap-3">
                <span>{i.quantity} × {i.name}</span>
                <span className="text-ink-soft">{formatPack(i.pack)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto grid gap-2 pt-6">
          <Link to={`/gifts/${box.slug}`} className="btn-secondary w-full">See What’s Inside</Link>
          <button type="button" onClick={() => add({ kind: 'gift', giftId: box.id, qty: 1 })} className="btn-primary w-full" aria-label={`Add ${box.name} to cart`}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
