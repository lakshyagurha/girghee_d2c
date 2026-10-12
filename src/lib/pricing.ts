import { ghee, getVariant } from '../content/products';
import { getGiftById } from '../content/gifts';

/**
 * Server-safe order pricing (no React, no browser APIs). The payment function uses this to
 * work out the amount from the catalogue, so a tampered cart can never change what is charged.
 */
export const MAX_LINES = 20;
export const MAX_LINE_QTY = 20;

export type OrderItem =
  | { kind: 'ghee'; variantId: string; qty: number }
  | { kind: 'gift'; giftId: string; qty: number };

export interface PricedLine {
  name: string;
  qty: number;
  unitPaise: number;
  totalPaise: number;
}

export type PriceResult =
  | { ok: true; lines: PricedLine[]; amountPaise: number }
  | { ok: false; error: string };

export function priceOrder(input: unknown): PriceResult {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: 'Your cart is empty.' };
  if (input.length > MAX_LINES) return { ok: false, error: 'Too many items in the cart.' };
  const lines: PricedLine[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid cart item.' };
    const r = raw as Record<string, unknown>;
    const qty = r.qty;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > MAX_LINE_QTY) {
      return { ok: false, error: 'Invalid quantity.' };
    }
    if (r.kind === 'ghee' && typeof r.variantId === 'string') {
      const v = getVariant(r.variantId);
      if (!v || !v.available) return { ok: false, error: 'A product in your cart is no longer available.' };
      lines.push({ name: `${ghee.name} ${v.label}`, qty, unitPaise: v.pricePaise, totalPaise: v.pricePaise * qty });
    } else if (r.kind === 'gift' && typeof r.giftId === 'string') {
      const g = getGiftById(r.giftId);
      if (!g || g.pricePaise == null) return { ok: false, error: 'A gift box in your cart is no longer available.' };
      lines.push({ name: g.name, qty, unitPaise: g.pricePaise, totalPaise: g.pricePaise * qty });
    } else {
      return { ok: false, error: 'Invalid cart item.' };
    }
  }
  return { ok: true, lines, amountPaise: lines.reduce((n, l) => n + l.totalPaise, 0) };
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const emptyCustomer: Customer = { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' };

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

/** Shared by the checkout form and the server, so both apply the same rules. */
export function validateCustomer(c: Customer): CustomerErrors {
  const e: CustomerErrors = {};
  const len = (s: string) => s.trim().length;
  if (len(c.name) < 2 || len(c.name) > 80) e.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim()) || len(c.email) > 120) e.email = 'Enter a valid email address.';
  if (!/^[6-9]\d{9}$/.test(normalisePhone(c.phone))) e.phone = 'Enter a 10-digit Indian mobile number.';
  if (len(c.address) < 8 || len(c.address) > 200) e.address = 'Enter your house number, street and area.';
  if (len(c.city) < 2 || len(c.city) > 60) e.city = 'Enter your city.';
  if (len(c.state) < 2 || len(c.state) > 60) e.state = 'Enter your state.';
  if (!/^[1-9]\d{5}$/.test(c.pincode.trim())) e.pincode = 'Enter a 6-digit PIN code.';
  return e;
}

/** Strips spaces, dashes and a leading +91 / 0. */
export function normalisePhone(p: string): string {
  return p.replace(/[\s-]/g, '').replace(/^(\+?91|0)(?=\d{10}$)/, '');
}

/** Reads an untrusted object into a Customer, or null if any field is missing or not a string. */
export function readCustomer(input: unknown): Customer | null {
  if (!input || typeof input !== 'object') return null;
  const r = input as Record<string, unknown>;
  const out = {} as Customer;
  for (const k of Object.keys(emptyCustomer) as (keyof Customer)[]) {
    if (typeof r[k] !== 'string') return null;
    out[k] = (r[k] as string).trim();
  }
  return out;
}
