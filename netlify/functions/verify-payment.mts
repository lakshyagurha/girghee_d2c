import { getKeys, json, readJson, verifyPaymentSignature } from '../lib/razorpay';

/**
 * POST { razorpay_order_id, razorpay_payment_id, razorpay_signature } from Checkout's success handler.
 * Only a valid signature proves the payment really came from Razorpay for this order.
 */
export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const keys = getKeys();
  if (!keys) return json(503, { error: 'Payments are not configured yet.' });

  const body = (await readJson(req)) as Record<string, unknown> | null;
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  if (typeof orderId !== 'string' || typeof paymentId !== 'string') {
    return json(400, { verified: false, error: 'Missing payment details.' });
  }
  if (!verifyPaymentSignature(keys.keySecret, orderId, paymentId, body?.razorpay_signature)) {
    console.warn('Payment signature mismatch', { orderId, paymentId });
    return json(400, { verified: false, error: 'We could not verify this payment.' });
  }
  console.log('Payment verified', { orderId, paymentId });
  return json(200, { verified: true, orderId, paymentId });
};
