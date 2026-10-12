import { createHmac } from 'node:crypto';
import { priceOrder, validateCustomer, normalisePhone, readCustomer, emptyCustomer } from '../lib/pricing';
import { verifyPaymentSignature, signaturesMatch, hmacHex } from '../../netlify/lib/razorpay';
import { giftBoxes } from '../content/gifts';

const validCustomer = {
  name: 'Asha Rao', email: 'asha@example.com', phone: '+91 98765 43210',
  address: '12 MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038',
};

describe('priceOrder (server-side amount)', () => {
  it('prices from the catalogue, ignoring any price sent by the browser', () => {
    const r = priceOrder([{ kind: 'ghee', variantId: '500ml', qty: 2, pricePaise: 1 }]);
    expect(r).toEqual({ ok: true, amountPaise: 259800, lines: [expect.objectContaining({ qty: 2, unitPaise: 129900 })] });
  });

  it('adds gift boxes and ghee together', () => {
    const box = giftBoxes.find((b) => b.pricePaise != null)!;
    const r = priceOrder([{ kind: 'ghee', variantId: '200ml', qty: 1 }, { kind: 'gift', giftId: box.id, qty: 3 }]);
    expect(r.ok && r.amountPaise).toBe(59900 + box.pricePaise! * 3);
  });

  it.each([
    [[], /empty/],
    [null, /empty/],
    [[{ kind: 'ghee', variantId: 'nope', qty: 1 }], /no longer available/],
    [[{ kind: 'ghee', variantId: '500ml', qty: 0 }], /quantity/],
    [[{ kind: 'ghee', variantId: '500ml', qty: 1.5 }], /quantity/],
    [[{ kind: 'ghee', variantId: '500ml', qty: 21 }], /quantity/],
    [[{ kind: 'other', qty: 1 }], /invalid/i],
  ])('rejects %j', (items, msg) => {
    const r = priceOrder(items);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toMatch(msg);
  });
});

describe('customer details', () => {
  it('accepts a complete Indian address', () => {
    expect(validateCustomer(validCustomer)).toEqual({});
  });

  it('flags every missing field', () => {
    expect(Object.keys(validateCustomer(emptyCustomer))).toHaveLength(7);
  });

  it('normalises phone formats', () => {
    expect(normalisePhone('+91 98765-43210')).toBe('9876543210');
    expect(normalisePhone('09876543210')).toBe('9876543210');
  });

  it('rejects non-string fields from untrusted input', () => {
    expect(readCustomer({ ...validCustomer, pincode: 560038 })).toBeNull();
    expect(readCustomer(validCustomer)?.name).toBe('Asha Rao');
  });
});

describe('Razorpay signature checks', () => {
  const secret = 'test_secret';
  const sig = createHmac('sha256', secret).update('order_1|pay_1').digest('hex');

  it('accepts the signature Razorpay would send', () => {
    expect(verifyPaymentSignature(secret, 'order_1', 'pay_1', sig)).toBe(true);
  });

  it('rejects a tampered order, wrong secret or junk signature', () => {
    expect(verifyPaymentSignature(secret, 'order_2', 'pay_1', sig)).toBe(false);
    expect(verifyPaymentSignature('other', 'order_1', 'pay_1', sig)).toBe(false);
    expect(verifyPaymentSignature(secret, 'order_1', 'pay_1', 'zz')).toBe(false);
    expect(verifyPaymentSignature(secret, 'order_1', 'pay_1', undefined)).toBe(false);
    expect(signaturesMatch(hmacHex(secret, 'x'), sig.slice(0, 10))).toBe(false);
  });
});
