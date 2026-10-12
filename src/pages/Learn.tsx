import { culinaryUses, labelChecklist, methods, references, storageTips } from '../content/learn';
import { ghee } from '../content/products';
import { usePageMeta } from '../lib/hooks';
import { Img } from '../components/Img';
import { ArrowLink, Disclosure, Eyebrow } from '../components/ui';

const Ref = ({ id }: { id: string }) => {
  const n = references.findIndex((r) => r.id === id) + 1;
  return <sup><a href={`#ref-${id}`} className="ml-0.5 text-xs font-semibold text-navy underline underline-offset-2" aria-label={`Reference ${n}`}>[{n}]</a></sup>;
};

const toc = [
  ['a2', 'What “A2” means'], ['label', 'Reading a ghee label'], ['methods', 'How ghee is made'],
  ['cooking', 'Cooking with ghee'], ['storage', 'Storing ghee'], ['questions', 'Questions'],
];

export default function Learn() {
  usePageMeta('Learn About Ghee', 'What the term A2 means, how to read a ghee label, how ghee is generally made, cooking ideas and storage tips.');
  return (
    <>
      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <Eyebrow>Learn</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-display font-light">Ghee, explained plainly.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">Short answers to common questions about ghee. This page covers general information. Anything specific to Gheeji is clearly marked.</p>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[14rem_1fr] lg:gap-20 lg:py-20">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">On this page</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 lg:block lg:space-y-0.5">
            {toc.map(([id, l]) => <li key={id}><a href={`#${id}`} className="inline-flex min-h-[40px] items-center text-sm font-medium text-navy hover:underline">{l}</a></li>)}
          </ul>
        </nav>

        <div className="max-w-3xl space-y-20">
          <section id="a2" aria-labelledby="a2-title">
            <h2 id="a2-title" className="text-h2 font-normal">What “A2” means</h2>
            <div className="mt-5 space-y-4 text-ink-soft">
              <p>Cow’s milk contains a protein called beta-casein. It comes in different genetic variants, two of which are known as A1 and A2. They differ by a single amino acid. Whether a cow produces A1, A2 or both depends on its genetics.<Ref id="efsa-2009" /></p>
              <p>“A2” on a dairy label usually means the milk came from cows that produce only the A2 variant. It describes the protein in the <em>source milk</em>.</p>
              <p>Ghee is almost entirely milk fat. Indian food standards require ghee to contain at least 99.5% milk fat and no more than 0.5% moisture, so very little milk protein remains in the finished product.<Ref id="fssai-dairy-std" /></p>
              <p>In August 2024, FSSAI issued an advisory asking food businesses to remove A1/A2 claims from milk and milk product labels, then withdrew it within days for further stakeholder consultation.<Ref id="fssai-a1a2-2024" /> If you see the term on a label, read it as a description of the milk source, not as a health claim.</p>
            </div>
            <aside className="mt-8 border-l-2 border-gold bg-paper p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">About Gheeji specifically</p>
              <p className="mt-2 text-ink-soft">Details of Gheeji’s milk source, and how it is verified, will be published here once confirmed.</p>
            </aside>
          </section>

          <section id="label" aria-labelledby="label-title">
            <h2 id="label-title" className="text-h2 font-normal">How to read a ghee label</h2>
            <p className="mt-5 text-ink-soft">Packaged food in India must carry certain information. Here is what to look for on any jar of ghee.<Ref id="fssai-labelling" /></p>
            <dl className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {labelChecklist.map((l) => (
                <div key={l.term} className="border-b border-line py-4">
                  <dt className="font-semibold">{l.term}</dt>
                  <dd className="mt-1 text-sm text-ink-soft">{l.body}</dd>
                </div>
              ))}
            </dl>
            <ArrowLink to={`/shop/${ghee.slug}#details`} className="mt-4">See Gheeji’s product information</ArrowLink>
          </section>

          <section id="methods" aria-labelledby="methods-title">
            <h2 id="methods-title" className="text-h2 font-normal">How ghee is generally made</h2>
            <p className="mt-5 text-ink-soft">All ghee is made by heating milk fat until the water evaporates and the milk solids separate out. There are several common ways to get there.<Ref id="niftem-ghee" /></p>
            <ol className="mt-6 space-y-6">
              {methods.map((m, i) => (
                <li key={m.name} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="font-serif text-2xl text-gold" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="font-sans text-lg font-semibold">{m.name}</h3>
                    <p className="mt-1 text-ink-soft">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="mt-8 border-l-2 border-gold bg-paper p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">About Gheeji specifically</p>
              <p className="mt-2 text-ink-soft">These are general methods. Gheeji’s own production method has not yet been published and is not implied by this section.</p>
            </aside>
          </section>

          <section id="cooking" aria-labelledby="cooking-title">
            <h2 id="cooking-title" className="text-h2 font-normal">Cooking with ghee</h2>
            <div className="mt-6"><Img id="mealDal" ratio="16 / 9" /></div>
            <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {culinaryUses.map((u) => (
                <li key={u.title} className="border-t border-line pt-4">
                  <h3 className="font-sans text-base font-semibold">{u.title}</h3>
                  <p className="mt-1 text-ink-soft">{u.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="storage" aria-labelledby="storage-title">
            <h2 id="storage-title" className="text-h2 font-normal">Storing ghee</h2>
            <p className="mt-5 text-ink-soft">General guidance for any ghee. Always follow the storage instructions and dates on your jar’s label.</p>
            <ul className="mt-5 space-y-3">
              {storageTips.map((t) => <li key={t} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" /><span>{t}</span></li>)}
            </ul>
          </section>

          <section id="questions" aria-labelledby="q-title">
            <h2 id="q-title" className="text-h2 font-normal">Questions</h2>
            <div className="mt-6 border-t border-line">
              <Disclosure title="Is ghee the same as butter?">
                <p>No. Ghee is made by heating butter or cream until the water evaporates and the milk solids separate out. Butter still contains water and milk solids.<Ref id="fssai-dairy-std" /></p>
              </Disclosure>
              <Disclosure title="Why does my ghee look grainy, or change texture?">
                <p>Ghee can be liquid, soft, grainy or firm depending on the room temperature and how it cooled. A change in texture on its own is normal.</p>
              </Disclosure>
              <Disclosure title="Is ghee suitable for people with a milk allergy or lactose intolerance?">
                <p>Ghee is a dairy product made from milk. We do not make claims about its suitability for milk allergies or lactose intolerance. If you have a medical or dietary condition, please ask a qualified health professional.</p>
              </Disclosure>
              <Disclosure title="Does the volume on the jar tell me the weight?">
                <p>No. Millilitres measure volume and grams measure weight, and the two are not the same for ghee. Check the net quantity on the label to see which one is declared.</p>
              </Disclosure>
            </div>
          </section>

          <section aria-labelledby="refs-title" className="border-t border-line pt-8">
            <h2 id="refs-title" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">References</h2>
            <ol className="mt-4 space-y-3 text-sm text-ink-soft">
              {references.map((r, i) => (
                <li key={r.id} id={`ref-${r.id}`} className="grid grid-cols-[1.75rem_1fr]">
                  <span>{i + 1}.</span>
                  <span>{r.label} <a href={r.href} target="_blank" rel="noopener noreferrer" className="break-all text-navy underline underline-offset-2">Source<span className="sr-only"> (opens in a new tab)</span></a>{r.note && <> · <em>{r.note}</em></>}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
