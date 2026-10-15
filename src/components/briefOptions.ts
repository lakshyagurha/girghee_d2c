import { customBox, giftBoxes } from '../content/gifts';
import { formatINR } from '../lib/format';

export const boxOptions = [
  ...giftBoxes.map((b) => ({ id: b.id, label: `${b.name.replace('Ghee Culture ', '')} (${formatINR(b.pricePaise ?? 0)} per box)` })),
  { id: customBox.id, label: 'Custom box (price on quotation)' },
  { id: 'not-sure', label: 'Not sure yet' },
];
