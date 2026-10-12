export interface Faq { q: string; a: string; link?: { label: string; to: string } }

export const homeFaqs: Faq[] = [
  {
    q: 'Which jar size should I choose?',
    a: 'All three jars hold the same Gheeji A2 Ghee. Only the size changes. The 200 ml jar is an easy way to try it or to include in a gift, the 500 ml jar suits kitchens that cook with ghee through the week, and the 1 litre jar is for larger households.',
    link: { label: 'Compare sizes', to: '/shop' },
  },
  {
    q: 'Where can I find ingredients, storage and shelf-life details?',
    a: 'Each detail is listed on the product page and will match the printed label. Anything we have not yet confirmed is marked as awaiting information rather than guessed.',
    link: { label: 'Product details', to: '/shop/gheeji-a2-ghee' },
  },
  {
    q: 'What exactly is inside each gift box?',
    a: 'Every box page lists each item with its quantity and pack size. The box itself is the packaging and is not counted as an item.',
    link: { label: 'See the gift boxes', to: '/gifts' },
  },
  {
    q: 'Can gift boxes carry our company branding or a custom message?',
    a: 'Custom message cards, sleeves, logo placement and adjusted contents are options we can discuss for larger orders. What is possible, and what it costs, is confirmed in your quotation.',
    link: { label: 'Corporate gifting', to: '/corporate-gifting' },
  },
  {
    q: 'How do I request a corporate quote?',
    a: 'Share your approximate quantity, budget per box, occasion, branding needs and delivery cities through the quote form. Final contents, taxes, shipping, customisation costs, lead time and any minimum order are set out in the quotation.',
    link: { label: 'Request a quote', to: '/corporate-gifting#quote' },
  },
];

export const corporateFaqs: Faq[] = [
  {
    q: 'Is the price on a gift box the price we will pay for a bulk order?',
    a: 'No. Listed prices apply to single boxes. A bulk or custom order is priced in a written quotation that covers contents, taxes, shipping and any customisation.',
  },
  {
    q: 'Is there a minimum order quantity?',
    a: 'Any minimum order depends on the customisation you ask for and is stated in your quotation. If you are not sure of your numbers yet, choose “Not sure yet” in the form.',
  },
  {
    q: 'Can you deliver to several cities or straight to employees’ homes?',
    a: 'List your delivery cities and any address requirements in the form. Delivery coverage and timelines are confirmed in the quotation, not assumed in advance.',
  },
  {
    q: 'Can we change what goes inside a box?',
    a: 'Yes, you can ask to swap or add items. Every change is confirmed in writing before your order goes ahead.',
  },
  {
    q: 'Does using the brief builder commit us to anything?',
    a: 'No. It only fills in the quote form so you do not have to type everything again. It is not a binding quotation.',
  },
];
