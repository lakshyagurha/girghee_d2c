import type { Mass, Volume } from '../content/products';

const inr0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0, minimumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Format integer paise as INR with Indian digit grouping, e.g. 12345600 → ₹1,23,456. */
export function formatINR(paise: number): string {
  if (!Number.isFinite(paise)) return '—';
  const rupees = paise / 100;
  return paise % 100 === 0 ? inr0.format(rupees) : inr2.format(rupees);
}

export function formatPack(pack: Volume | Mass | null): string {
  if (!pack) return '';
  if (pack.unit === 'l') return `${pack.value} ${pack.value === 1 ? 'litre' : 'litres'}`;
  return `${pack.value} ${pack.unit}`;
}
