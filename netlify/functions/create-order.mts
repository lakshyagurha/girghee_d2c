import { priceOrder, readCustomer, validateCustomer, normalisePhone } from '../../src/lib/pricing';
import { getKeys, json, readJson } from '../lib/razorpay';

/**
 * POST { items, customer } → creates a Razorpay order for the server-calculated amount.
 * The customer's delivery details are stored on the order as notes, so they appear
 * in the Razorpay dashboard next to the payment.
 */
export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const keys = getKeys();
  if (!keys) return json(503, { error: 'Payments are not configured yet.' });

  const body = (await readJson(req)) as { items?: unknown; customer?: unknown } | null;
  const priced = priceOrder(body?.items);
  if (!priced.ok) return json(400, { error: priced.error });
  const customer = readCustomer(body?.customer);
  if (!customer || Object.keys(validateCustomer(customer)).length > 0) {
    return json(400, { error: 'Please check your delivery details.' });
  }

  const cut = (s: string) => s.slice(0, 255);
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: priced.amountPaise,
      currency: 'INR',
      receipt: `gj_${Date.now().toString(36)}`,
      notes: {
        items: cut(priced.lines.map((l) => `${l.qty} x ${l.name}`).join('; ')),
        name: cut(customer.name),
        email: cut(customer.email),
        phone: normalisePhone(customer.phone),
        address: cut(customer.address),
        city: cut(customer.city),
        state: cut(customer.state),
        pincode: customer.pincode,
      },
    }),
  });

  if (!res.ok) {
    console.error('Razorpay order creation failed', res.status, await res.text());
    return json(502, { error: 'We could not start the payment. Please try again.' });
  }
  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return json(200, { orderId: order.id, amount: order.amount, currency: order.currency, keyId: keys.keyId });
};
