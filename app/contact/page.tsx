import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CLINIC } from "@/lib/site";
import { PageHero } from "@/components/shared";
import { LeadForm, Reveal, HoursTable, OpenStatus } from "@/components/client";

export const metadata: Metadata = {
  title: "Contact & Book Appointment — Dentist in Sahakarnagar",
  description: "Book an appointment at Apollo Dental Sahakarnagar. Call +91 98450 55386 or 080 4150 0111. 26, 1st Floor, Block G, 60th Main Road, Sahakarnagar, Bengaluru 560092 — next to Big Market.",
  alternates: { canonical: "/contact" },
};

const Label = ({ children }: { children: React.ReactNode }) => <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">{children}</p>;

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in" accent="touch." sub="Call, WhatsApp, email or send us a message. We're here to help." crumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />

      <section className="container-x grid gap-16 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
        <Reveal>
          <div className="space-y-10">
            <div>
              <Label>Phone</Label>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {CLINIC.phones.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} className="group flex items-center justify-between py-4">
                      <span className="text-[14px] text-slate-500">{p.label}</span>
                      <span className="tabular flex items-center gap-2 text-[18px] tracking-tight text-ink">{p.display}<ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-ink" /></span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener" className="group flex items-center justify-between py-4">
                    <span className="text-[14px] text-slate-500">WhatsApp</span>
                    <span className="flex items-center gap-2 text-[18px] tracking-tight text-ink">Start a chat<ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-ink" /></span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <Label>Email</Label>
              <a href={`mailto:${CLINIC.email}`} className="mt-3 block break-all text-[18px] tracking-tight text-ink"><span className="link-u">{CLINIC.email}</span></a>
            </div>
            <div>
              <Label>Address</Label>
              <address className="mt-3 text-[17px] not-italic leading-relaxed text-ink">{CLINIC.address.line1}<br />{CLINIC.address.line2}<br /><span className="text-slate-500">{CLINIC.address.landmark}</span></address>
              <a href={CLINIC.mapLink} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-ink"><span className="link-u">Get directions</span> <ArrowUpRight size={14} /></a>
            </div>
            <div>
              <div className="flex items-center justify-between"><Label>Hours</Label><OpenStatus className="text-[13px] text-slate-600" /></div>
              <div className="mt-2"><HoursTable /></div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card p-6 sm:p-10 lg:sticky lg:top-24" id="book">
            <h2 className="text-[26px] tracking-tight text-ink">Send us a message</h2>
            <p className="mt-2 text-[15px] text-slate-500">We usually respond within working hours on the same day. Want to pick a slot? <Link href="/book-appointment" className="text-ink underline underline-offset-4">Book an appointment</Link>.</p>
            <div className="mt-8"><LeadForm source="contact-page" variant="full" submitLabel="Send message" /></div>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <div className="relative h-[440px] overflow-hidden rounded-2xl border border-line bg-slate-100">
          <iframe title="Apollo Dental Sahakarnagar on Google Maps" src={CLINIC.mapEmbed} className="absolute inset-0 h-full w-full border-0 grayscale contrast-[1.05]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}
