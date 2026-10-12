import { Link, useParams } from 'react-router-dom';
import { policyPages } from '../content/navigation';
import { usePageMeta } from '../lib/hooks';
import NotFound from './NotFound';

/** Outline of what each policy must cover. Final text must come from the business and legal review. */
const outlines: Record<string, string[]> = {
  shipping: ['Delivery areas served', 'Dispatch and delivery timelines', 'Shipping charges', 'Handling of glass jars and damaged parcels', 'Bulk and multi-address corporate deliveries'],
  returns: ['Whether food items can be returned', 'Damaged, leaking or incorrect items: how to report and the time limit', 'Refund method and timelines', 'Corporate and custom orders'],
  privacy: ['What personal data is collected (orders, enquiries)', 'Purpose and legal basis for processing', 'Who it is shared with (payment, delivery, hosting providers)', 'Retention period', 'Rights under the Digital Personal Data Protection Act, 2023, and how to exercise them', 'Grievance officer and contact details'],
  terms: ['Who operates the website', 'Product information and pricing', 'Orders, acceptance and cancellation', 'Liability', 'Governing law and jurisdiction'],
};

export default function Policy() {
  const { slug } = useParams();
  const page = policyPages.find((p) => p.slug === slug);
  usePageMeta(page ? `${page.label} (draft)` : 'Not found');
  if (!page) return <NotFound />;
  return (
    <section className="container-x max-w-3xl py-12 lg:py-20">
      <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Draft, pending business and legal review</p>
      <h1 className="mt-4 text-h2 font-normal">{page.label}</h1>
      <p className="mt-5 text-ink-soft">This policy has not been written yet. The final text will be provided by Gheeji after business and legal review. Nothing on this page is a commitment.</p>
      <h2 className="mt-10 font-sans text-base font-semibold">This policy will cover</h2>
      <ul className="mt-3 space-y-2">
        {outlines[page.slug].map((o) => <li key={o} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />{o}</li>)}
      </ul>
      <p className="mt-10 text-sm text-ink-soft">Other drafts: {policyPages.filter((p) => p.slug !== slug).map((p, i) => <span key={p.slug}>{i > 0 && ' · '}<Link to={`/policies/${p.slug}`} className="link">{p.label}</Link></span>)}</p>
    </section>
  );
}
