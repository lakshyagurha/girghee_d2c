import { brand } from '../content/brand';
import type { CartLine } from './cart';
import type { Customer } from './pricing';

/** Browser side of the Razorpay flow. Only the public Key ID ever reaches the browser. */

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const FN = '/.netlify/functions';

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (r: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      s.remove();
      reject(new Error('load'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${FN}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `The server responded with ${res.status}.`);
  return data;
}

export type PayResult =
  | { status: 'paid'; orderId: string; paymentId: string }
  | { status: 'dismissed' }
  | { status: 'error'; message: string };

export async function payWithRazorpay(items: CartLine[], customer: Customer): Promise<PayResult> {
  let order: { orderId: string; amount: number; currency: string; keyId: string };
  try {
    [order] = await Promise.all([post<typeof order>('create-order', { items, customer }), loadCheckout()]);
  } catch (e) {
    const message = e instanceof Error && e.message !== 'load'
      ? e.message
      : 'We could not load the secure payment window. Please check your connection and try again.';
    return { status: 'error', message };
  }
  if (!window.Razorpay) return { status: 'error', message: 'The payment window did not load. Please try again.' };

  return new Promise<PayResult>((resolve) => {
    let failure: string | null = null;
    const rzp = new window.Razorpay!({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: brand.name,
      description: brand.descriptor,
      image: `${window.location.origin}/brand/icon-512.png`,
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      notes: { pincode: customer.pincode },
      theme: { color: '#273056' },
      handler: async (r: RazorpaySuccess) => {
        try {
          const v = await post<{ verified: boolean }>('verify-payment', r);
          resolve(v.verified
            ? { status: 'paid', orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id }
            : { status: 'error', message: `We could not verify your payment. If money was deducted, contact us with payment ID ${r.razorpay_payment_id}.` });
        } catch {
          resolve({ status: 'error', message: `We could not confirm your payment. If money was deducted, contact us with payment ID ${r.razorpay_payment_id}.` });
        }
      },
      modal: {
        // Razorpay shows its own retry screen on failure; report the last failure only if the customer gives up.
        ondismiss: () => resolve(failure ? { status: 'error', message: failure } : { status: 'dismissed' }),
      },
    });
    rzp.on('payment.failed', (r) => {
      failure = r.error?.description ?? 'The payment did not go through.';
    });
    rzp.open();
  });
}
