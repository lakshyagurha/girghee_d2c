/**
 * Learning page content. General educational information only — nothing here
 * describes Gheeji's own process. Each factual statement points to a reference id.
 * Reviewed against sources in October 2026; re-check before launch.
 */
export interface Reference { id: string; label: string; href: string; note?: string }

export const references: Reference[] = [
  {
    id: 'efsa-2009',
    label: 'EFSA (2009). Review of the potential health impact of β-casomorphins and related peptides. EFSA Scientific Report 231.',
    href: 'https://doi.org/10.2903/j.efsa.2009.231r',
  },
  {
    id: 'fssai-dairy-std',
    label: 'FSSAI. Food Safety and Standards (Food Products Standards and Food Additives) Regulations, Chapter 2.1 Dairy products and analogues, 2.1.8 Milk fat products.',
    href: 'https://fssai.gov.in/upload/uploadfiles/files/Chapter%202_1_Dairy%20products%20and%20analogues.pdf',
  },
  {
    id: 'fssai-a1a2-2024',
    label: 'News on AIR (24 Aug 2024). FSSAI orders removal of A1 and A2 claims from packaging of milk and dairy products. The advisory was withdrawn on 26 Aug 2024 for stakeholder consultation.',
    href: 'https://www.newsonair.gov.in/fssai-orders-removal-of-a1-and-a2-claims-from-all-packaging-of-milk-and-dairy-products/',
    note: 'Check the current FSSAI position before launch.',
  },
  {
    id: 'fssai-labelling',
    label: 'FSSAI. Labelling requirements for packaged food under the FSS (Labelling and Display) Regulations, 2020.',
    href: 'https://fssai.gov.in/upload/media/FSSAI_News_Packaged_FNB_04_01_2020.pdf',
  },
  {
    id: 'niftem-ghee',
    label: 'NIFTEM (PMFME scheme, Ministry of Food Processing Industries). Ghee: reading material on manufacturing methods.',
    href: 'https://niftem.ac.in/newsite/pmfme/wp-content/uploads/2022/08/Ghee-Writeup.pdf',
  },
];

export const labelChecklist = [
  { term: 'Name of the food', body: 'What the product is, for example “Ghee”.' },
  { term: 'Ingredients', body: 'Everything that goes into the product.' },
  { term: 'Net quantity', body: 'How much is in the pack. Check whether it is a volume (ml, litre) or a weight (g, kg). The two are not the same for ghee.' },
  { term: 'Date marking', body: 'The date of manufacture or packing and a use-by or expiry date. Some labels also show a best-before date.' },
  { term: 'FSSAI logo and licence number', body: 'The food business’s FSSAI licence or registration number.' },
  { term: 'Veg / non-veg mark', body: 'The green or brown symbol inside a square.' },
  { term: 'Nutrition information', body: 'Energy and nutrients, usually per 100 g or per serving.' },
  { term: 'Batch or lot number', body: 'Lets a specific batch be traced.' },
  { term: 'Manufacturer and consumer care details', body: 'The name and address of the brand owner or manufacturer, and how to contact them.' },
  { term: 'Retail sale price', body: 'The maximum retail price, inclusive of taxes.' },
];

export const methods = [
  {
    name: 'Traditional method (from curd)',
    body: 'Milk is set into curd. The curd is churned to separate butter, and the butter is then slowly heated to drive off water and leave clarified ghee. Many households in India still make ghee this way, in small batches.',
  },
  {
    name: 'Direct cream method',
    body: 'Cream is separated from milk and heated directly until the water evaporates and the milk solids settle out.',
  },
  {
    name: 'Creamery butter method',
    body: 'Cream is churned into butter, and the butter is melted and heated to clarify it. This is a common industrial route.',
  },
];

export const culinaryUses = [
  { title: 'Tadka and tempering', body: 'Heat ghee, then add cumin, mustard seeds, curry leaves or dried chillies to finish dal, sabzi or khichdi.' },
  { title: 'On rotis and parathas', body: 'Brush a little on rotis straight off the tawa, or use it to cook parathas.' },
  { title: 'With rice and dal', body: 'A spoonful over hot rice and dal is a simple, familiar comfort.' },
  { title: 'Sweets and halwa', body: 'Many halwas, laddoos and festive sweets start by roasting flour, semolina or nuts in ghee.' },
  { title: 'Roasting and sautéing', body: 'Use it for roasting poha, upma vegetables or dry fruits.' },
];

export const storageTips = [
  'Keep the lid tightly closed when you are not using the jar.',
  'Use a clean, dry spoon. Water or food scraps in the jar can spoil ghee.',
  'Store away from direct heat and sunlight, for example in a cupboard rather than next to the stove.',
  'Ghee can be soft, grainy, liquid or solid depending on the room temperature. This change in texture is normal.',
];
