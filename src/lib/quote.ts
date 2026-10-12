import { integrations } from '../content/brand';

export interface QuoteRequest {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  quantity: string;
  budget: string;
  preferredBox: string;
  occasion: string;
  deliveryDate: string;
  cities: string;
  branding: string;
  notes: string;
  consent: boolean;
}

export type SubmitResult =
  | { mode: 'demo' }
  | { mode: 'sent' }
  | { mode: 'error'; message: string };

/**
 * Sends the enquiry when a real endpoint is configured. Otherwise returns demo mode
 * and transmits nothing. No data is stored in the browser either way.
 */
export async function submitQuote(req: QuoteRequest): Promise<SubmitResult> {
  const { connected, endpoint } = integrations.quoteForm;
  if (!connected || !endpoint) return { mode: 'demo' };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) return { mode: 'error', message: `The server responded with ${res.status}.` };
    return { mode: 'sent' };
  } catch {
    return { mode: 'error', message: 'We could not reach the server. Please check your connection and try again.' };
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Lenient: allows +91, spaces and dashes; 10–13 digits. */
export const PHONE_RE = /^\+?[\d\s-]{10,16}$/;
