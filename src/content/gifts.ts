import type { ImageId } from './images';
import type { Mass, Volume, Sourced } from './products';

export interface GiftItem {
  name: string;
  quantity: number;
  /** Pack size. null for items without a pack size (card, spoon). */
  pack: Volume | Mass | null;
}

export interface GiftBox {
  id: string;
  slug: string;
  name: string;
  /** Integer paise. null = price on quotation only (custom work). */
  pricePaise: number | null;
  description: Sourced;
  idealFor: string[];
  /** Listed gift items. The outer box itself is never counted here. */
  contents: GiftItem[];
  personalisation: string[];
  images: { closed: ImageId; open: ImageId; contents?: ImageId };
  /** Merchandising status — all prototype boxes are draft concepts. */
  status: 'draft' | 'approved';
}

const ghee200: GiftItem = { name: 'Ghee Culture A2 Ghee', quantity: 1, pack: { value: 200, unit: 'ml' } };
const ghee500: GiftItem = { name: 'Ghee Culture A2 Ghee', quantity: 1, pack: { value: 500, unit: 'ml' } };
const almonds: GiftItem = { name: 'Almonds', quantity: 1, pack: { value: 100, unit: 'g' } };
const cashews: GiftItem = { name: 'Cashews', quantity: 1, pack: { value: 100, unit: 'g' } };
const honey: GiftItem = { name: 'Honey', quantity: 1, pack: { value: 100, unit: 'g' } };
const tea: GiftItem = { name: 'Tea', quantity: 1, pack: { value: 50, unit: 'g' } };
const spoon: GiftItem = { name: 'Reusable spoon', quantity: 1, pack: null };
const card: GiftItem = { name: 'Greeting card', quantity: 1, pack: null };

const commonPersonalisation = [
  'A personal message printed on the greeting card',
  'For larger orders: a custom sleeve or logo placement, confirmed by quotation',
];

export const giftBoxes: GiftBox[] = [
  {
    id: 'little-thank-you', slug: 'little-thank-you-box', name: 'Ghee Culture Little Thank You Box',
    pricePaise: 129900,
    description: { status: 'sample', text: 'A simple thank-you, with something to enjoy at home.' },
    idealFor: ['Team thank-yous', 'Neighbours and hosts', 'Small celebrations'],
    contents: [ghee200, almonds, card],
    personalisation: commonPersonalisation,
    images: { closed: 'littleClosed', open: 'littleOpen', contents: 'littleContents' },
    status: 'draft',
  },
  {
    id: 'appreciation', slug: 'appreciation-box', name: 'Ghee Culture Appreciation Box',
    pricePaise: 199900,
    description: { status: 'sample', text: 'A thoughtful selection for colleagues, clients, and everyday celebrations.' },
    idealFor: ['Colleagues and clients', 'Work anniversaries', 'Festive greetings'],
    contents: [ghee200, almonds, cashews, honey, card],
    personalisation: commonPersonalisation,
    images: { closed: 'appreciationClosed', open: 'appreciationOpen', contents: 'appreciationContents' },
    status: 'draft',
  },
  {
    id: 'signature', slug: 'signature-gift-box', name: 'Ghee Culture Signature Gift Box',
    pricePaise: 299900,
    description: { status: 'sample', text: 'A fuller gift box with pantry favourites and a personal note.' },
    idealFor: ['Key clients and partners', 'Milestones', 'Family celebrations'],
    contents: [ghee500, almonds, cashews, honey, tea, spoon, card],
    personalisation: commonPersonalisation,
    images: { closed: 'signatureClosed', open: 'signatureOpen', contents: 'signatureContents' },
    status: 'draft',
  },
];

/** Custom corporate box — quote only, never an automatic price. */
export const customBox = {
  id: 'custom',
  slug: 'custom-corporate-box',
  name: 'Ghee Culture Custom Corporate Box',
  description: {
    status: 'sample',
    text: 'Start from any Ghee Culture box and tell us what you would like to change — contents, card message, sleeve or logo. Every custom arrangement is confirmed by quotation.',
  } as Sourced,
  image: 'customBox' as ImageId,
};

export const itemCount = (box: GiftBox) => box.contents.reduce((n, i) => n + i.quantity, 0);

export const getGiftBySlug = (slug: string | undefined) => giftBoxes.find((b) => b.slug === slug);
export const getGiftById = (id: string | undefined | null) => giftBoxes.find((b) => b.id === id);
