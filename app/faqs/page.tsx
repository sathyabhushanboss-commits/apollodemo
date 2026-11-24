import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CLINIC, FAQ_GROUPS } from "@/lib/site";
import { PageHero, CtaBand, JsonLd, faqSchema, pad } from "@/components/shared";
import { Faq, Reveal } from "@/components/client";

export const metadata: Metadata = {
  title: "Dental FAQs — Treatments, Timings, EMI & More",
  description: "Answers to common questions about Apollo Dental Sahakarnagar — timings, appointments, EMI, implants, root canals, braces, aligners, whitening and kids' dentistry.",
  alternates: { canonical: "/faqs" },
};

const id = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ_GROUPS.flatMap((g) => g.items))} />
      <PageHero eyebrow="FAQs" title="Your questions," accent="answered." sub="Everything you'd like to know before your visit. Can't find your answer? Call or WhatsApp us." crumbs={[{ name: "Home", path: "/" }, { name: "FAQs", path: "/faqs" }]} />
      <section className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-[240px_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">Topics</p>
          <nav className="mt-4 border-t border-line" aria-label="FAQ categories">
            {FAQ_GROUPS.map((g, i) => (
              <a key={g.title} href={`#${id(g.title)}`} className="flex items-baseline gap-3 border-b border-line py-3 text-[14.5px] text-slate-600 transition hover:text-ink">
                <span className="font-mono text-[10.5px] text-slate-400">{pad(i + 1)}</span>
                <span className="flex-1">{g.title}</span>
                <span className="tabular font-mono text-[11px] text-slate-400">{g.items.length}</span>
              </a>
            ))}
          </nav>
          <div className="mt-8">
            <p className="text-[14px] text-slate-500">Still have a question?</p>
            <a href={`tel:${CLINIC.phones[0].tel}`} className="tabular mt-2 block text-[17px] text-ink"><span className="link-u">{CLINIC.phones[0].display}</span></a>
            <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1 text-[15px] text-ink"><span className="link-u">WhatsApp us</span> <ArrowUpRight size={14} /></a>
          </div>
        </aside>
        <div className="space-y-16">
          {FAQ_GROUPS.map((g, i) => (
            <Reveal key={g.title}>
              <section id={id(g.title)} className="scroll-mt-28">
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-slate-400">{pad(i + 1)}</span>
                  <h2 className="text-[28px] tracking-tight text-ink">{g.title}</h2>
                </div>
                <Faq items={g.items} />
              </section>
            </Reveal>
          ))}
          <p className="text-[12.5px] text-slate-400">Answers are general information and not a substitute for a clinical examination. <Link href="/book-appointment" className="underline underline-offset-2">Book a consultation</Link> for advice specific to you.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
