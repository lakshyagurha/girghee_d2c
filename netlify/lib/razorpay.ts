import { createHmac, timingSafeEqual } from 'node:crypto';

/** Server-only Razorpay helpers. Secrets come from Netlify environment variables, never the browser bundle. */

export function getKeys(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, keySecret } : null;
}

export function hmacHex(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** Constant-time comparison of two hex signatures. */
export function signaturesMatch(expectedHex: string, receivedHex: unknown): boolean {
  if (typeof receivedHex !== 'string' || !/^[0-9a-f]+$/i.test(receivedHex)) return false;
  const a = Buffer.from(expectedHex, 'hex');
  const b = Buffer.from(receivedHex, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checkout signature: HMAC-SHA256 of "order_id|payment_id" with the key secret. */
export function verifyPaymentSignature(secret: string, orderId: string, paymentId: string, signature: unknown): boolean {
  return signaturesMatch(hmacHex(secret, `${orderId}|${paymentId}`), signature);
}

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
