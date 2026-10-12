import { formatINR, formatPack } from '../lib/format';
import { parseStoredCart, resolveLine } from '../lib/cart';
import { giftBoxes, itemCount } from '../content/gifts';
import { ghee } from '../content/products';
import { validateQuote } from '../components/QuoteForm';
import { emptyQuote } from '../components/QuoteForm';

describe('formatINR', () => {
  it('formats paise with the rupee symbol and Indian grouping', () => {
    expect(formatINR(59900)).toBe('₹599');
    expect(formatINR(239900)).toBe('₹2,399');
    expect(formatINR(12345600)).toBe('₹1,23,456');
    expect(formatINR(12345)).toBe('₹123.45');
  });
});

describe('catalogue', () => {
  it('stores the brief prices as integer paise', () => {
    expect(ghee.variants.map((v) => v.pricePaise)).toEqual([59900, 129900, 239900]);
    expect(giftBoxes.map((b) => b.pricePaise)).toEqual([129900, 199900, 299900]);
    for (const p of [...ghee.variants.map((v) => v.pricePaise), ...giftBoxes.map((b) => b.pricePaise!)]) expect(Number.isInteger(p)).toBe(true);
  });
  it('keeps volume separate from mass', () => {
    expect(ghee.variants.every((v) => ['ml', 'l'].includes(v.volume.unit) && v.netMass === null)).toBe(true);
    expect(formatPack({ value: 1, unit: 'l' })).toBe('1 litre');
  });
  it('has the agreed gift item counts (packaging not counted)', () => {
    expect(giftBoxes.map(itemCount)).toEqual([3, 5, 7]);
    expect(giftBoxes[2].contents.find((i) => i.name === 'Gheeji A2 Ghee')?.pack).toEqual({ value: 500, unit: 'ml' });
  });
});

describe('cart storage parsing', () => {
  it('drops malformed, unknown and out-of-range data', () => {
    expect(parseStoredCart('not json')).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    const parsed = parseStoredCart(JSON.stringify([
      { kind: 'ghee', variantId: '500ml', qty: 2 },
      { kind: 'ghee', variantId: '5l', qty: 1 },
      { kind: 'gift', giftId: 'appreciation', qty: 999 },
      { kind: 'gift', giftId: 'signature', qty: -3 },
      { kind: 'ghee', variantId: '200ml', qty: 'x' },
      null,
    ]));
    expect(parsed).toEqual([
      { kind: 'ghee', variantId: '500ml', qty: 2 },
      { kind: 'gift', giftId: 'appreciation', qty: 20 },
      { kind: 'gift', giftId: 'signature', qty: 1 },
    ]);
  });
  it('prices lines from the catalogue, not from stored data', () => {
    expect(resolveLine({ kind: 'ghee', variantId: '1l', qty: 3 })?.totalPaise).toBe(719700);
  });
});

describe('quote validation', () => {
  it('requires the core fields and consent', () => {
    const e = validateQuote(emptyQuote);
    expect(Object.keys(e).sort()).toEqual(['budget', 'company', 'consent', 'email', 'fullName', 'quantity'].sort());
  });
  it('accepts a minimal valid brief', () => {
    expect(validateQuote({ ...emptyQuote, fullName: 'A', company: 'B', email: 'a@b.co', quantity: 'Not sure yet', budget: 'Not sure yet', consent: true })).toEqual({});
  });
});
