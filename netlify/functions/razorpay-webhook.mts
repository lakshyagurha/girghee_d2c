import { hmacHex, json, signaturesMatch } from '../lib/razorpay';

/**
 * Razorpay → server notification. Backs up the browser flow: a payment is recorded here
 * even if the customer closes the tab before the success screen.
 * Set this URL in Razorpay Dashboard → Settings → Webhooks, with the same secret as RAZORPAY_WEBHOOK_SECRET.
 */
export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return json(503, { error: 'Webhook secret not configured.' });

  // The signature covers the exact raw body, so read it as text before parsing.
  const raw = await req.text();
  if (!signaturesMatch(hmacHex(secret, raw), req.headers.get('x-razorpay-signature'))) {
    return json(400, { error: 'Invalid signature.' });
  }

  let event: { event?: string; payload?: { payment?: { entity?: Record<string, unknown> } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid JSON.' });
  }
  const p = event.payload?.payment?.entity;
  // Visible in Netlify → Logs → Functions. Replace with email / storage once chosen.
  console.log('Razorpay webhook', {
    event: event.event,
    paymentId: p?.id,
    orderId: p?.order_id,
    amount: p?.amount,
    status: p?.status,
    notes: p?.notes,
  });
  return json(200, { received: true });
};
