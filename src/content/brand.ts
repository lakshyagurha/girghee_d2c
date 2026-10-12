/**
 * Brand settings, contact channels and integration status.
 * Anything set to `null` is treated as "not configured" and is hidden from the site —
 * never replace a null with a made-up value.
 */
export const brand = {
  name: 'Gheeji',
  descriptor: 'A2 Ghee & Thoughtful Gifting',
  /**
   * Brand mark (woman churning ghee), cropped from the master at /brand/gheeji-mark.png.
   * Displayed at a fixed 69 × 44 px; aspect ratio 1.575 must match the files.
   */
  logo: {
    src: '/brand/gheeji-mark-96.webp',
    srcSet: '/brand/gheeji-mark-96.webp 2x, /brand/gheeji-mark-144.webp 3x',
    width: 69,
    height: 44,
  },
  /** Shows the discreet "prototype" strip and demo labels. Set false only at launch. */
  prototype: true,
};

export interface ContactChannels {
  email: string | null;
  phone: string | null;
  /** WhatsApp business number in international format, digits only (e.g. '9198xxxxxxxx'). */
  whatsapp: string | null;
  address: string | null;
  hours: string | null;
  corporateEmail: string | null;
}

export const contact: ContactChannels = {
  email: null,
  phone: null,
  whatsapp: null,
  address: null,
  hours: null,
  corporateEmail: null,
};

/** Social profiles. null = hidden. */
export const social: { label: string; href: string | null }[] = [
  { label: 'Instagram', href: null },
  { label: 'LinkedIn', href: null },
];

/**
 * Integration status. Keep secrets out of this file — it ships to the browser.
 * `endpoint` should be a public form endpoint or your own server route, never a secret key.
 */
export const integrations = {
  checkout: { connected: false, provider: null as string | null },
  quoteForm: { connected: false, endpoint: null as string | null },
  contactForm: { connected: false, endpoint: null as string | null },
};
