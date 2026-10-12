import type { ImageId } from './images';

export const occasions = [
  { id: 'employee-appreciation', label: 'Employee appreciation', body: 'Thank a team after a launch, a busy quarter or a long year.' },
  { id: 'client-thank-you', label: 'Client thank-yous', body: 'Thank clients and partners with something they will use at home.' },
  { id: 'onboarding', label: 'Onboarding', body: 'Welcome new joiners with a box waiting on their first day.' },
  { id: 'festive', label: 'Festive gifting', body: 'Diwali, the new year and other celebrations, planned ahead of time.' },
] as const;

export const otherOccasion = { id: 'other', label: 'Something else' } as const;

/** Ranges deliberately avoid implying a minimum order. */
export const quantityRanges = ['Under 25', '25–50', '51–100', '101–250', '251–500', 'More than 500', 'Not sure yet'];

export const budgetRanges: { label: string; maxPaise: number | null }[] = [
  { label: 'Under ₹1,500', maxPaise: 150000 },
  { label: '₹1,500 – ₹2,500', maxPaise: 250000 },
  { label: '₹2,500 – ₹3,500', maxPaise: 350000 },
  { label: 'Above ₹3,500', maxPaise: null },
  { label: 'Not sure yet', maxPaise: null },
];

export const process = [
  { title: 'Choose a starting box', body: 'Pick the box closest to what you have in mind, or start from a blank brief.' },
  { title: 'Share your requirements', body: 'Tell us your quantity, budget per box, occasion, branding and delivery cities.' },
  { title: 'Review the proposal', body: 'You receive a proposed set of contents and a written quotation to review and adjust.' },
  { title: 'Confirm fulfilment', body: 'Agree the final contents, delivery addresses and timeline before anything is packed.' },
];

/** Proposed options only — each is subject to confirmation in a quotation. */
export const customisationOptions = [
  { title: 'Custom sleeve', body: 'A printed sleeve around the box in your colours.' },
  { title: 'Logo placement', body: 'Your logo on the sleeve or message card.' },
  { title: 'Message cards', body: 'Your message printed on each card, or a different message for each person.' },
  { title: 'Adjusted contents', body: 'Swap or add items to fit your budget and occasion.' },
];

export const packagingDetails: { image: ImageId; title: string; body: string }[] = [
  { image: 'packagingLid', title: 'Inside the lid', body: 'Proposed: “With Appreciation” printed in fine gold.' },
  { image: 'packagingInsert', title: 'Fitted insert', body: 'Proposed: each item sits in its own space, so the box opens neatly.' },
  { image: 'packagingCard', title: 'Greeting card', body: 'Proposed: space for a personal or company message.' },
];

/**
 * Seasonal campaign module. Toggle `enabled` and edit copy each season.
 * Keep dates and deadlines out unless confirmed by operations.
 */
export const seasonal = {
  enabled: true,
  eyebrow: 'Seasonal',
  title: 'Planning Diwali gifts?',
  body: 'Festive orders take time to plan. Tell us your quantity and delivery cities early and we can work through contents, cards and timelines with you.',
  cta: { label: 'Start a festive brief', occasion: 'festive' },
};
