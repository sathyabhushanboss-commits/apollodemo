import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, SERVICE_GROUPS, SITE_URL, FLYER } from "@/lib/site";
import { PageHero, CtaBand, JsonLd, pad } from "@/components/shared";
import { Reveal } from "@/components/client";

export const metadata: Metadata = {
  title: "Dental Treatments in Sahakarnagar, Bangalore",
  description: "All dental treatments at Apollo Dental Sahakarnagar — cosmetic dentistry, root canal, general dentistry, implants, orthodontics, kids dentistry, periodontics, prosthodontics and oral care.",
  alternates: { canonical: "/services" },
};

const anchor = (g: string) => g.toLowerCase().replace(/\s+/g, "-");

export default function ServicesPage() {
  const groups = SERVICE_GROUPS.map((g) => ({ g, items: SERVICES.filter((s) => s.group === g) })).filter((x) => x.items.length);
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ItemList", name: "Dental treatments",
        itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/services/${s.slug}`, name: s.title })),
      }} />
      <PageHero eyebrow="Treatments" title="Every dental need," accent="under one roof." sub="Nine specialties in one clinic: preventive, restorative, cosmetic, orthodontic and surgical dentistry, each led by a specialist." crumbs={[{ name: "Home", path: "/" }, { name: "Treatments", path: "/services" }]} />

      <div className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Category index */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">Specialties</p>
          <nav aria-label="Treatment categories" className="-mx-5 mt-4 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
            {groups.map(({ g, items }) => (
              <a key={g} href={`#${anchor(g)}`} className="flex shrink-0 items-center justify-between gap-4 rounded-lg border border-line px-3 py-2 text-[14px] text-slate-600 transition hover:border-slate-300 hover:text-ink lg:border-0 lg:px-0 lg:py-1.5">
                {g}<span className="tabular font-mono text-[11px] text-slate-400">{items.length}</span>
              </a>
            ))}
          </nav>
          <div className="mt-10 hidden border-t border-line pt-6 lg:block">
            <p className="text-[14px] leading-relaxed text-slate-600">{FLYER.emi.replace("EMI*", "EMI")}.</p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-slate-400">{FLYER.emiNote}</p>
          </div>
        </aside>

        <div className="space-y-16 sm:space-y-20">
          {groups.map(({ g, items }) => (
            <section key={g} id={anchor(g)} className="scroll-mt-28">
              <Reveal>
                <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
                  <h2 className="text-[28px] tracking-tight text-ink sm:text-[34px]">{g}</h2>
                  <span className="tabular font-mono text-[11px] text-slate-400">{pad(items.length)}</span>
                </div>
              </Reveal>
              <ul>
                {items.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="group grid gap-x-10 gap-y-3 border-b border-line py-7 transition-colors hover:border-ink md:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <h3 className="text-[22px] leading-tight tracking-tight text-ink">{s.title}</h3>
                        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">{s.short}</p>
                      </div>
                      <ul className="flex flex-wrap content-start gap-x-4 gap-y-1 text-[14px] text-slate-500 md:pt-1">
                        {s.subServices.map((x) => <li key={x} className="flex items-center gap-2"><span className="h-px w-2 bg-slate-300" />{x}</li>)}
                      </ul>
                      <ArrowUpRight size={20} strokeWidth={1.5} className="hidden text-slate-300 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink md:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-[15px] text-slate-500">Not sure which treatment you need? <Link href="/book-appointment" className="text-ink underline underline-offset-4">Book a consultation</Link> and our dentists will guide you.</p>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
