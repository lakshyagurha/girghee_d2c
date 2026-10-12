import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { contact, integrations } from '../content/brand';
import { EMAIL_RE } from '../lib/quote';
import { usePageMeta } from '../lib/hooks';
import { Eyebrow } from '../components/ui';

export default function Contact() {
  usePageMeta('Contact', 'Contact Gheeji about an order, a gift box or corporate gifting.');
  const channels = [
    contact.email && { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    contact.whatsapp && { label: 'WhatsApp', value: 'Message us on WhatsApp', href: `https://wa.me/${contact.whatsapp}` },
    contact.corporateEmail && { label: 'Corporate enquiries', value: contact.corporateEmail, href: `mailto:${contact.corporateEmail}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <>
      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 text-display font-light">Get in touch.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">Questions about a jar, a gift box or an order? Send us a message.</p>
        </div>
      </section>
      <section className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:py-20">
        <div className="space-y-8">
          {channels.length > 0 ? (
            <dl className="space-y-4">
              {channels.map((c) => (
                <div key={c.label}><dt className="text-sm font-semibold text-ink-soft">{c.label}</dt><dd><a href={c.href} className="link">{c.value}</a></dd></div>
              ))}
              {contact.hours && <div><dt className="text-sm font-semibold text-ink-soft">Hours</dt><dd>{contact.hours}</dd></div>}
              {contact.address && <div><dt className="text-sm font-semibold text-ink-soft">Address</dt><dd className="whitespace-pre-line">{contact.address}</dd></div>}
            </dl>
          ) : (
            <p className="text-ink-soft">Email, phone and address details will appear here once they are confirmed.</p>
          )}
          <div className="border-l-2 border-gold bg-sand/60 p-5">
            <h2 className="font-sans text-base font-semibold">Corporate or bulk gifting?</h2>
            <p className="mt-1 text-sm text-ink-soft">The quote form asks for everything we need to prepare a proposal.</p>
            <Link to="/corporate-gifting#quote" className="btn-primary mt-4">Request a Quote</Link>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}

function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', message: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const summary = useRef<HTMLParagraphElement>(null);
  const validate = () => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = 'Enter your name.';
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email address in the format name@example.com.';
    if (!v.message.trim()) e.message = 'Enter your message.';
    if (!v.consent) e.consent = 'Please confirm we may use these details to reply.';
    return e;
  };
  if (done) {
    return (
      <div role="status" className="border border-line bg-paper p-6 sm:p-8">
        <p className="inline-block rounded-sm border border-brass px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brass">Demo only</p>
        <p className="mt-3 font-serif text-2xl">Demo only: your message has not been sent.</p>
        <p className="mt-2 text-ink-soft">This prototype is not connected to a messaging service, and nothing was stored.</p>
        <button type="button" className="btn-secondary mt-6" onClick={() => { setV({ name: '', email: '', message: '', consent: false }); setDone(false); }}>Write another message</button>
      </div>
    );
  }
  const a = (k: string) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `c-${k}-err` } : {});
  return (
    <form noValidate className="space-y-5 border border-line bg-paper p-5 sm:p-8" onSubmit={(e) => {
      e.preventDefault();
      const errs = validate(); setErrors(errs);
      if (Object.keys(errs).length) { requestAnimationFrame(() => summary.current?.focus()); return; }
      // No contact backend is connected in the prototype: show the demo state and send nothing.
      if (!integrations.contactForm.connected) setDone(true);
    }}>
      <h2 className="text-h3 font-normal">Send a message</h2>
      {Object.keys(errors).length > 0 && <p ref={summary} tabIndex={-1} role="alert" className="border-l-4 border-danger bg-danger/5 p-3 text-sm font-semibold text-danger focus:outline-none">Please correct the highlighted fields.</p>}
      <div>
        <label htmlFor="c-name" className="field-label">Name <span aria-hidden="true">*</span></label>
        <input id="c-name" autoComplete="name" className="field" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} {...a('name')} />
        {errors.name && <p id="c-name-err" className="mt-1.5 text-sm font-medium text-danger">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">Email <span aria-hidden="true">*</span></label>
        <input id="c-email" type="email" autoComplete="email" className="field" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} {...a('email')} />
        {errors.email && <p id="c-email-err" className="mt-1.5 text-sm font-medium text-danger">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">Message <span aria-hidden="true">*</span></label>
        <textarea id="c-message" rows={5} className="field" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} {...a('message')} />
        {errors.message && <p id="c-message-err" className="mt-1.5 text-sm font-medium text-danger">{errors.message}</p>}
      </div>
      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-0.5 h-6 w-6 shrink-0 accent-navy" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} {...a('consent')} />
          <span className="text-[0.95rem]">Gheeji may use these details to reply to my message. <span aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <p id="c-consent-err" className="mt-1.5 text-sm font-medium text-danger">{errors.consent}</p>}
      </div>
      <p className="text-sm font-semibold text-brass">Demo mode: nothing will be sent or stored.</p>
      <button type="submit" className="btn-primary">Send message</button>
    </form>
  );
}
