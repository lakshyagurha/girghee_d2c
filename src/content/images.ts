/**
 * Image manifest. Every image on the site is referenced by an id from this file.
 * To add real photography: put the optimised file in /public/images and set `src`
 * (plus the true intrinsic `width`/`height`). Until `src` is set, a clearly labelled
 * placeholder frame is shown — never a disguised stand-in.
 */
export type ImageKind = 'product' | 'packaging' | 'lifestyle' | 'concept';

export interface Credit {
  /** What part of the image this covers, e.g. "Almonds". */
  subject: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface ImageSlot {
  id: string;
  alt: string;
  /** Art-direction brief for the photographer / designer. Shown on the placeholder. */
  brief: string;
  kind: ImageKind;
  width: number;
  height: number;
  src: string | null;
  /**
   * True for stock / third-party photography standing in for Gheeji's own photos.
   * Shows a small "Illustrative" tag so it is never mistaken for Gheeji product photography.
   */
  illustrative?: boolean;
  credits?: Credit[];
}

const BYSA3 = { license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' };
const BYSA4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const BY2 = { license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' };
const CC0 = { license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

/** Third-party photos used in this prototype (Wikimedia Commons). Cropped, colour-graded and combined. */
const C = {
  jar: { subject: 'Glass jar of ghee', author: 'Rainer Z ...', ...BYSA3, sourceUrl: commons('Butterschmalz-3.jpg') },
  spoonBowl: { subject: 'Ghee with a spoon', author: 'Neha Sonal', ...BYSA4, sourceUrl: commons('Home_made_Ghee.jpg') },
  bowl: { subject: 'Ghee in a steel container', author: 'Phadke09', ...BYSA4, sourceUrl: commons('Pure_Ghee-Homemade-Maharashtra.jpg') },
  roti: { subject: 'Chapatis', author: 'safaritravelplus', ...CC0, sourceUrl: commons('Chapati-1.jpg') },
  dal: { subject: 'Dal tadka, cumin rice and papad', author: 'Monali.mishra', ...BYSA4, sourceUrl: commons('Dal_Fry_Tadka,_Cumin_Rice,_Roasted_Papad_on_the_side.jpg') },
  thali: { subject: 'Gujarati thali', author: 'Dr Suryakanta Acharya', ...BYSA4, sourceUrl: commons('Rice_dal_sambar_curry_chhas_sweet-Surat-Gujarat-24.jpg') },
  almonds: { subject: 'Almonds', author: 'HaJunkiyada', ...BYSA4, sourceUrl: commons('Liat_Portal_for_Foodie_Disorder_-_Raw_almonds_in_a_bowl.jpg') },
  cashews: { subject: 'Cashews', author: 'Ranjithkumar Murugesan', ...CC0, sourceUrl: commons('CASHEW_NUTS.jpg') },
  honey: { subject: 'Honey jar', author: 'Cindy Shebley', ...BY2, sourceUrl: commons('Antique_Glass_Honey_Jar_With_Rusted_Metal_Cap_(31009798197).jpg') },
  tea: { subject: 'Tea', author: 'Maliqbhai', ...BYSA4, sourceUrl: commons('A_Moment_of_Tea_Tradition.jpg') },
  spoon: { subject: 'Wooden spoon', author: 'Miansari66', ...CC0, sourceUrl: commons('Doi_(wooden_spoon).JPG') },
} satisfies Record<string, Credit>;

const slot = (s: Omit<ImageSlot, 'src'> & { src?: string | null }): ImageSlot => ({ src: null, ...s });

export const images = {
  heroComposition: slot({
    id: 'hero-composition', kind: 'lifestyle', width: 1200, height: 1501,
    src: '/images/hero-composition.webp', illustrative: true, credits: [C.jar],
    alt: 'A glass jar filled with golden ghee, in soft natural light',
    brief: 'FINAL: Gheeji jar + open Appreciation Box on linen and warm wood, soft window light, uncluttered.',
  }),
  heroDetail: slot({
    id: 'hero-detail', kind: 'lifestyle', width: 800, height: 801,
    src: '/images/hero-detail.webp', illustrative: true, credits: [C.spoonBowl],
    alt: 'A spoon lifting grainy, golden ghee from a bowl',
    brief: 'FINAL: close-up of a spoon of Gheeji ghee over hot rice. Natural colour, not over-glossy.',
  }),
  ghee200: slot({
    id: 'ghee-200ml', kind: 'product', width: 1000, height: 1250,
    src: '/images/ghee-jar.webp', illustrative: true, credits: [C.jar],
    alt: 'Illustrative photo: a glass jar of golden ghee (not the actual Gheeji 200 ml jar)',
    brief: 'FINAL: 200 ml Gheeji jar, front-facing, on warm white (#FFFDF8). Full label legible. Same angle and light for all sizes.',
  }),
  ghee500: slot({
    id: 'ghee-500ml', kind: 'product', width: 1000, height: 1250,
    src: '/images/ghee-jar.webp', illustrative: true, credits: [C.jar],
    alt: 'Illustrative photo: a glass jar of golden ghee (not the actual Gheeji 500 ml jar)',
    brief: 'FINAL: 500 ml Gheeji jar, front-facing, on warm white (#FFFDF8). Full label legible. Same angle and light for all sizes.',
  }),
  ghee1l: slot({
    id: 'ghee-1l', kind: 'product', width: 1000, height: 1250,
    src: '/images/ghee-jar.webp', illustrative: true, credits: [C.jar],
    alt: 'Illustrative photo: a glass jar of golden ghee (not the actual Gheeji 1 litre jar)',
    brief: 'FINAL: 1 litre Gheeji jar, front-facing, on warm white (#FFFDF8). Full label legible. Same angle and light for all sizes.',
  }),
  gheeLabel: slot({
    id: 'ghee-label-back', kind: 'product', width: 1000, height: 1250,
    alt: 'Back label of the Gheeji ghee jar showing ingredients, net quantity and batch details',
    brief: 'Flat, legible photo of the approved back label (ingredients, FSSAI licence, net quantity, dates).',
  }),
  gheeTexture: slot({
    id: 'ghee-texture', kind: 'lifestyle', width: 1000, height: 1250,
    src: '/images/ghee-texture.webp', illustrative: true, credits: [C.bowl],
    alt: 'Ghee in an open steel container, showing its smooth, golden surface',
    brief: 'FINAL: open Gheeji jar from above, spoon lifting ghee, showing natural texture. Linen underneath.',
  }),
  gheeKitchen: slot({
    id: 'ghee-kitchen', kind: 'lifestyle', width: 1000, height: 1250,
    src: '/images/ghee-kitchen.webp', illustrative: true, credits: [C.roti],
    alt: 'A stack of freshly made chapatis on a plate in a home kitchen',
    brief: 'FINAL: Gheeji jar on the counter beside a tawa and a stack of rotis. Home kitchen, daylight.',
  }),
  mealDal: slot({
    id: 'meal-dal', kind: 'lifestyle', width: 1400, height: 962,
    src: '/images/meal-dal.webp', illustrative: true, credits: [C.dal],
    alt: 'A plate of dal tadka with cumin rice and roasted papad on a dark cloth',
    brief: 'FINAL: everyday thali with Gheeji ghee spooned over the dal. Warm, real, not styled-luxury.',
  }),
  littleClosed: slot({
    id: 'gift-little-closed', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Gheeji Little Thank You Box, closed, in warm ivory with a small Gheeji mark',
    brief: 'Closed rigid box, warm ivory, navy accent, fine antique-gold detail, restrained Gheeji mark.',
  }),
  littleOpen: slot({
    id: 'gift-little-contents', kind: 'packaging', width: 1200, height: 1200,
    src: '/images/contents-little.webp', illustrative: true, credits: [C.jar, C.almonds],
    alt: 'What is inside the Little Thank You Box: a jar of ghee, almonds and a greeting card. Illustrative photos of each item, not the final Gheeji packaging',
    brief: 'FINAL: open Gheeji box from above showing exactly these items in the fitted insert.',
  }),
  littleContents: slot({
    id: 'gift-little-contents', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Contents of the Little Thank You Box laid out: ghee jar, almond pack and greeting card',
    brief: 'Flat lay of the 3 items beside the box, labels facing camera.',
  }),
  appreciationClosed: slot({
    id: 'gift-appreciation-closed', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Gheeji Appreciation Box, closed',
    brief: 'Closed rigid box, same family as Little Thank You, slightly larger.',
  }),
  appreciationOpen: slot({
    id: 'gift-appreciation-contents', kind: 'packaging', width: 1200, height: 1200,
    src: '/images/contents-appreciation.webp', illustrative: true, credits: [C.jar, C.almonds, C.cashews, C.honey],
    alt: 'What is inside the Appreciation Box: a jar of ghee, almonds, cashews, honey and a greeting card. Illustrative photos of each item, not the final Gheeji packaging',
    brief: 'FINAL: open Gheeji box from above showing exactly these items in the fitted insert.',
  }),
  appreciationContents: slot({
    id: 'gift-appreciation-contents', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Contents of the Appreciation Box laid out individually',
    brief: 'Flat lay of the 5 items, labels facing camera.',
  }),
  signatureClosed: slot({
    id: 'gift-signature-closed', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Gheeji Signature Gift Box, closed',
    brief: 'Largest rigid box in the range, closed, fine gold detail.',
  }),
  signatureOpen: slot({
    id: 'gift-signature-contents', kind: 'packaging', width: 1200, height: 1200,
    src: '/images/contents-signature.webp', illustrative: true, credits: [C.jar, C.almonds, C.cashews, C.honey, C.tea, C.spoon],
    alt: 'What is inside the Signature Gift Box: a jar of ghee, almonds, cashews, honey, tea, a reusable spoon and a greeting card. Illustrative photos of each item, not the final Gheeji packaging',
    brief: 'FINAL: open Gheeji box from above showing exactly these items in the fitted insert.',
  }),
  signatureContents: slot({
    id: 'gift-signature-contents', kind: 'packaging', width: 1200, height: 1200,
    alt: 'Contents of the Signature Gift Box laid out individually',
    brief: 'Flat lay of the 7 items, labels facing camera.',
  }),
  customBox: slot({
    id: 'gift-custom-concept', kind: 'concept', width: 1200, height: 1200,
    alt: 'Concept: an Gheeji gift box with a plain sleeve showing where a company logo could be placed',
    brief: 'CONCEPT render: box with a blank sleeve marking a logo area. Must be labelled as a concept.',
  }),
  corporateHero: slot({
    id: 'corporate-contents', kind: 'lifestyle', width: 1600, height: 1200,
    src: '/images/corporate-contents.webp', illustrative: true, credits: [C.jar, C.almonds, C.cashews, C.honey, C.tea, C.spoon],
    alt: 'The items that go into Gheeji gift boxes: ghee, almonds, cashews, honey, tea, a wooden spoon and a "With Appreciation" card',
    brief: 'FINAL: a row of closed Gheeji gift boxes with message cards, ready to hand out. Office-neutral setting.',
  }),
  packagingLid: slot({
    id: 'packaging-lid', kind: 'packaging', width: 1000, height: 1000,
    alt: 'Close-up of the inside of an Gheeji gift box lid reading "With Appreciation"',
    brief: 'Macro of lid interior: "With Appreciation" in fine gold, textured paper.',
  }),
  packagingInsert: slot({
    id: 'packaging-insert', kind: 'packaging', width: 1000, height: 1000,
    alt: 'Close-up of the fitted insert holding items in an Gheeji gift box',
    brief: 'Macro of the fitted insert and how items sit securely.',
  }),
  packagingCard: slot({
    id: 'packaging-card', kind: 'packaging', width: 1000, height: 1000,
    alt: 'An Gheeji greeting card with space for a personal message',
    brief: 'Greeting card on linen, blank message area, restrained Gheeji mark.',
  }),
  aboutTable: slot({
    id: 'about-table', kind: 'lifestyle', width: 1400, height: 875,
    src: '/images/about-table.webp', illustrative: true, credits: [C.thali],
    alt: 'A home-style thali with rotis, rice, dal, curries, a sweet and buttermilk',
    brief: 'FINAL: shared meal table with the Gheeji jar in use, a gift box on the side. No staged farms.',
  }),
} satisfies Record<string, ImageSlot>;

export type ImageId = keyof typeof images;
