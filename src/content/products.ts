import type { ImageId } from './images';

/**
 * Content provenance. Every customer-facing fact carries one of these so that
 * sample copy can never be mistaken for approved product information.
 *  - approved: confirmed by the business / final label. Safe to publish.
 *  - sample:   prototype copy written for this build. Needs owner approval.
 *  - general:  general, non-Ghee Culture-specific information (e.g. "ghee is a dairy product").
 *  - pending:  fact is required but not yet supplied. Rendered as "awaiting information".
 */
export type Provenance = 'approved' | 'sample' | 'general' | 'pending';

export interface Sourced {
  status: Provenance;
  /** Text shown to customers. null when pending. */
  text: string | null;
}

export type VolumeUnit = 'ml' | 'l';
export type MassUnit = 'g' | 'kg';

export interface Volume { value: number; unit: VolumeUnit }
export interface Mass { value: number; unit: MassUnit }

export interface GheeVariant {
  id: string;
  sku: string;
  label: string;
  /** Volume on the jar. Kept separate from mass — never substitute one for the other. */
  volume: Volume;
  /** Net mass, only if printed on the approved label. */
  netMass: Mass | null;
  /** Price in integer paise (₹599 = 59900). Illustrative until approved. */
  pricePaise: number;
  useCase: string;
  image: ImageId;
  available: boolean;
}

export interface InfoSection {
  id: string;
  title: string;
  content: Sourced;
  /** Optional general guidance, always labelled as general on the page. */
  generalNote?: string;
  link?: { label: string; to: string };
}

export interface GheeProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: Sourced;
  variants: GheeVariant[];
  defaultVariantId: string;
  gallery: ImageId[];
  info: InfoSection[];
}

export const ghee: GheeProduct = {
  id: 'ghee-culture-a2-ghee',
  slug: 'ghee-culture-a2-ghee',
  name: 'Ghee Culture A2 Ghee',
  shortName: 'A2 Ghee',
  description: {
    status: 'sample',
    text: 'A jar for everyday meals, from warm rotis to a comforting bowl of dal. Choose the size that suits your kitchen.',
  },
  defaultVariantId: '500ml',
  variants: [
    {
      id: '200ml', sku: 'GC-GHEE-200ML', label: '200 ml',
      volume: { value: 200, unit: 'ml' }, netMass: null,
      pricePaise: 59900,
      useCase: 'A first jar, a smaller household, or a jar to tuck into a gift.',
      image: 'ghee200', available: true,
    },
    {
      id: '500ml', sku: 'GC-GHEE-500ML', label: '500 ml',
      volume: { value: 500, unit: 'ml' }, netMass: null,
      pricePaise: 129900,
      useCase: 'For kitchens that reach for ghee through the week.',
      image: 'ghee500', available: true,
    },
    {
      id: '1l', sku: 'GC-GHEE-1L', label: '1 litre',
      volume: { value: 1, unit: 'l' }, netMass: null,
      pricePaise: 239900,
      useCase: 'For larger families and regular home cooking.',
      image: 'ghee1l', available: true,
    },
  ],
  gallery: ['ghee500', 'gheeTexture', 'gheeLabel', 'gheeKitchen'],
  info: [
    { id: 'ingredients', title: 'Ingredients', content: { status: 'pending', text: null } },
    {
      id: 'sourcing', title: 'Sourcing', content: { status: 'pending', text: null },
      link: { label: 'What “A2” refers to', to: '/learn#a2' },
    },
    {
      id: 'preparation', title: 'How it is made', content: { status: 'pending', text: null },
      link: { label: 'How ghee is generally made', to: '/learn#methods' },
    },
    {
      id: 'storage', title: 'Storage', content: { status: 'pending', text: null },
      generalNote: 'General guidance for ghee: keep the lid closed, use a clean, dry spoon, and store away from direct heat and sunlight.',
    },
    { id: 'shelf-life', title: 'Shelf life', content: { status: 'pending', text: null } },
    {
      id: 'allergens', title: 'Allergens',
      content: { status: 'general', text: 'Ghee is a dairy product made from milk.' },
    },
    {
      id: 'shipping', title: 'Shipping', content: { status: 'pending', text: null },
      link: { label: 'Shipping policy (draft)', to: '/policies/shipping' },
    },
  ],
};

export const PENDING_COPY = 'Awaiting approved information. This will be published from the final product label and business records before launch.';

export function getVariant(id: string | null | undefined): GheeVariant | undefined {
  return ghee.variants.find((v) => v.id === id);
}
