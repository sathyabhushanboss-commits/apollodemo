import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, getService, CLINIC, SITE_URL } from "@/lib/site";
import { PageHero, ServiceCard, CtaBand, JsonLd, faqSchema, pad } from "@/components/shared";
import { LeadForm, Reveal, Faq, OpenStatus } from "@/components/client";
import { localImage } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: `${s.title} in Sahakarnagar, Bangalore`,
    description: `${s.short} ${s.title} at Apollo Dental Sahakarnagar by specialist dentists. Easy EMI. Book a consultation today.`.slice(0, 160),
    keywords: s.keywords,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.title} | Apollo Dental Sahakarnagar`, description: s.short, url: `/services/${s.slug}` },
  };
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line pt-8 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="flex items-baseline gap-3 text-[15px] text-ink md:flex-col md:gap-2">
        <span className="font-mono text-[11px] text-slate-400">{pad(n)}</span>{title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const img = localImage(`/images/services/${s.slug}.jpg`) ?? localImage(`/images/services/${s.slug}.svg`);
  const related = SERVICES.filter((x) => x.slug !== s.slug && x.category === s.category).concat(SERVICES.filter((x) => x.slug !== s.slug && x.category !== s.category)).slice(0, 3);

  return (
    <>
      <JsonLd data={[
        faqSchema(s.faqs),
        {
          "@context": "https://schema.org", "@type": "MedicalProcedure", name: s.title, description: s.intro,
          url: `${SITE_URL}/services/${s.slug}`, howPerformed: s.steps.map((x) => x.title).join(", "),
          provider: { "@id": `${SITE_URL}/#clinic` },
        },
      ]} />
      <PageHero eyebrow={s.group} title={s.title} sub={s.short} crumbs={[{ name: "Home", path: "/" }, { name: "Treatments", path: "/services" }, { name: s.title, path: `/services/${s.slug}` }]} />

      <div className="container-x grid gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <article className="space-y-14 sm:space-y-16">
          <Reveal>
            <div className={img ? "grid gap-8 md:grid-cols-[1fr_240px] md:items-start xl:grid-cols-[1fr_280px]" : ""}>
              <p className="max-w-2xl text-[20px] leading-[1.6] tracking-[-0.01em] text-slate-700 sm:text-[22px]">{s.intro}</p>
              {img && (
                <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl bg-brand-950 md:order-none">
                  <Image src={img} alt={`${s.title} at Apollo Dental Sahakarnagar, Bangalore`} fill sizes="(max-width:768px) 360px, 280px" unoptimized={img.endsWith(".svg")} className="object-cover" />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <Block n={1} title="What's included">
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {s.subServices.map((x) => <li key={x} className="border-b border-line py-3 text-[16px] text-ink">{x}</li>)}
              </ul>
            </Block>
          </Reveal>

          <Reveal>
            <Block n={2} title="Who it's for">
              <ul className="space-y-3">
                {s.idealFor.map((x) => <li key={x} className="flex items-start gap-3 text-[16px] text-slate-700"><Check size={16} className="mt-1 shrink-0 text-accent-500" /> {x}</li>)}
              </ul>
            </Block>
          </Reveal>

          <Reveal>
            <Block n={3} title="Benefits">
              <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {s.benefits.map((b) => (
                  <div key={b.title} className="bg-white p-6">
                    <h3 className="text-[17px] tracking-tight text-ink">{b.title}</h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-500">{b.text}</p>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>

          <Reveal>
            <Block n={4} title="How it works">
              <ol className="relative space-y-8 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-line">
                {s.steps.map((st, i) => (
                  <li key={st.title} className="relative flex gap-5">
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink bg-paper font-mono text-[11px] text-ink">{pad(i + 1)}</span>
                    <div className="pt-1.5">
                      <h3 className="text-[17px] tracking-tight text-ink">{st.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-500">{st.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          </Reveal>

          <Reveal>
            <Block n={5} title="Questions">
              <Faq items={s.faqs} />
              <p className="mt-6 text-[12.5px] leading-relaxed text-slate-400">This information is general and not a substitute for a professional diagnosis. Treatment suitability is decided after a clinical examination.</p>
            </Block>
          </Reveal>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start" id="book">
          <div className="card p-6 sm:p-7">
            <p className="eyebrow">Consultation</p>
            <h2 className="mt-3 text-[22px] leading-tight tracking-tight text-ink">Ask about {s.title.toLowerCase()}</h2>
            <p className="mt-1 text-[14px] text-slate-500">We&apos;ll call to answer questions and book a visit.</p>
            <div className="mt-6"><LeadForm source={`service:${s.slug}`} variant="compact" defaultService={s.title} submitLabel="Request callback" /></div>
          </div>
          <dl className="mt-4 divide-y divide-line rounded-2xl border border-line px-6 text-[14px]">
            <div className="flex justify-between py-3.5"><dt className="text-slate-500">Status</dt><dd><OpenStatus className="text-ink" /></dd></div>
            <div className="flex justify-between py-3.5"><dt className="text-slate-500">Call</dt><dd><a href={`tel:${CLINIC.phones[0].tel}`} className="tabular text-ink">{CLINIC.phones[0].display}</a></dd></div>
            <div className="flex justify-between py-3.5"><dt className="text-slate-500">Payment</dt><dd className="text-ink">EMI available*</dd></div>
          </dl>
        </aside>
      </div>

      <section className="border-t border-line bg-white">
        <div className="container-x py-20 sm:py-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[30px] tracking-tight text-ink sm:text-[38px]">Related <span className="text-slate-400">treatments</span></h2>
            <Link href="/services" className="hidden items-center gap-1.5 text-[14px] text-ink sm:flex"><span className="link-u">All treatments</span> <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{related.map((r, i) => <ServiceCard key={r.slug} s={r} i={i} />)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
