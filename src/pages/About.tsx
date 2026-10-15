import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/hooks';
import { Img } from '../components/Img';
import { Eyebrow } from '../components/ui';

export default function About() {
  usePageMeta('About Ghee Culture', 'Ghee Culture makes A2 ghee for everyday meals and gift boxes for appreciation, with clear information and considered presentation.');
  const principles = [
    { title: 'Everyday food first', body: 'Ghee is the centre of Ghee Culture: a jar you keep in the kitchen and use for dal, rotis, rice and sweets.' },
    { title: 'Gifts with a purpose', body: 'Our gift boxes take the same jar and add a few pantry favourites, so the gift is something people will actually use.' },
    { title: 'Clear information', body: 'We list what is in the jar and the box, in plain words. If a detail is not confirmed, we say so rather than guess.' },
    { title: 'Considered presentation', body: 'Sturdy boxes, fitted inserts and a card for your note, so the box looks right when it is opened.' },
  ];
  return (
    <>
      <section className="border-b border-line">
        <div className="container-x grid items-end gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>About Ghee Culture</Eyebrow>
            <h1 className="mt-4 text-display font-light">Good ghee, and gifts worth giving.</h1>
          </div>
          <p className="text-lg text-ink-soft">Ghee Culture brings together two things: a jar of A2 ghee for your own kitchen, and gift boxes for thanking the people around you, from colleagues and clients to family and friends.</p>
        </div>
      </section>
      <section className="container-x py-12 lg:py-16"><Img id="aboutTable" ratio="16 / 10" /></section>
      <section aria-labelledby="principles-title" className="section-y pt-4">
        <div className="container-x">
          <h2 id="principles-title" className="text-h2 font-normal">What we focus on</h2>
          <ul className="mt-10 grid gap-x-12 border-t border-line md:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="border-b border-line py-8">
                <h3 className="font-serif text-2xl">{p.title}</h3>
                <p className="mt-2 text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="sourcing" aria-labelledby="sourcing-title" className="border-y border-line bg-paper">
        <div className="container-x grid gap-8 py-16 md:grid-cols-[1fr_1.5fr] lg:py-20">
          <h2 id="sourcing-title" className="text-h2 font-normal">Sourcing and production</h2>
          <div className="space-y-4 text-ink-soft">
            <p>Where our milk comes from, how our ghee is made, and how those details are checked will be published on this page once they are confirmed.</p>
            <p>Until then, you can read our <Link to="/learn" className="link">general guide to ghee</Link>, which explains common methods and how to read a label.</p>
          </div>
        </div>
      </section>
      <section className="section-y">
        <div className="container-x flex flex-col gap-4 sm:flex-row">
          <Link to="/shop" className="btn-primary">Shop A2 Ghee</Link>
          <Link to="/corporate-gifting" className="btn-secondary">Explore Corporate Gifting</Link>
        </div>
      </section>
    </>
  );
}
