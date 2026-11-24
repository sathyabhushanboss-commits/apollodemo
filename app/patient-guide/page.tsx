import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { CLINIC } from "@/lib/site";
import { PageHero, CtaBand, SectionHead, pad } from "@/components/shared";
import { Reveal, HoursTable } from "@/components/client";

export const metadata: Metadata = {
  title: "Patient Guide — Your First Visit, EMI & Aftercare",
  description: "Everything you need for your visit to Apollo Dental Sahakarnagar — what to expect, what to bring, EMI options, the 365 Days Oral Health Plan, aftercare tips and directions.",
  alternates: { canonical: "/patient-guide" },
};

const FIRST_VISIT = [
  { t: "Arrive 10 minutes early", d: "Our front desk will register you and note your medical history." },
  { t: "Talk to your dentist", d: "Share your concerns, symptoms and goals. No question is too small." },
  { t: "Examination", d: "A thorough check of teeth, gums and bite, with X-rays if needed." },
  { t: "Your treatment plan", d: "Clear options, timelines and costs explained. You decide what's next." },
];

const BRING = [
  { t: "Previous dental records or X-rays", d: "Helpful if you've had treatment elsewhere." },
  { t: "List of current medicines", d: "Especially blood thinners, diabetes or heart medication." },
  { t: "Medical history", d: "Allergies, pregnancy, and any recent surgeries or conditions." },
  { t: "ID and payment method", d: "Ask us about EMI options in advance if you'd like to use them." },
];

const AFTERCARE = [
  "Follow the specific instructions your dentist gives you. They take priority over general advice.",
  "Take prescribed medicines exactly as directed.",
  "After an extraction, avoid spitting, using straws and smoking for the first 24 hours.",
  "Stick to soft, lukewarm food on the treated side until numbness wears off.",
  "Keep brushing gently and maintain your follow-up appointments.",
];

export default function PatientGuide() {
  return (
    <>
      <PageHero eyebrow="Patient guide" title="Everything you need" accent="for your visit." sub="From booking to aftercare, a simple guide to visiting Apollo Dental Sahakarnagar." crumbs={[{ name: "Home", path: "/" }, { name: "Patient Guide", path: "/patient-guide" }]} />

      {/* First visit */}
      <section className="container-x py-24 sm:py-32">
        <SectionHead center={false} index={1} eyebrow="Your first visit" title="What to" accent="expect." sub="Most first consultations take around 30–45 minutes." />
        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {FIRST_VISIT.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.07} className="lg:pr-10">
              <li className="list-none">
                <div className="flex items-center">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink font-mono text-[11px]">{pad(i + 1)}</span>
                  {i < FIRST_VISIT.length - 1 && <span className="ml-4 hidden h-px flex-1 bg-line lg:block" />}
                </div>
                <h3 className="mt-6 text-[20px] tracking-tight text-ink">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Checklist + plans */}
      <section className="border-t border-line bg-white">
        <div className="container-x grid gap-16 py-24 sm:py-32 lg:grid-cols-2">
          <div>
            <SectionHead center={false} index={2} eyebrow="Checklist" title="What to" accent="bring." />
            <Reveal delay={0.1}>
              <ul className="mt-10 border-t border-line">
                {BRING.map((b) => (
                  <li key={b.t} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[1fr_1fr] sm:gap-6">
                    <span className="text-[16px] text-ink">{b.t}</span>
                    <span className="text-[14.5px] text-slate-500">{b.d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="space-y-4 lg:pt-[120px]">
            <Reveal>
              <div className="rounded-2xl border border-line p-8">
                <p className="eyebrow">Payment</p>
                <h3 className="mt-4 text-[24px] tracking-tight text-ink">Easy EMI options</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">Dental treatments at our clinic are available on easy EMI options, so cost doesn&apos;t have to delay the care you need. Our front desk will explain eligibility and plans. <span className="text-slate-400">*T&amp;C apply</span></p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="grain rounded-2xl bg-brand-950 p-8 text-white">
                <p className="eyebrow text-white/45">Membership</p>
                <h3 className="mt-4 text-[24px] tracking-tight">365 Days Oral Health Plan</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">Apollo Dental&apos;s year-round oral health plan helps you stay on top of check-ups and preventive care. Ask us about current inclusions and how to enrol.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Aftercare + emergency */}
      <section className="border-t border-line">
        <div className="container-x grid gap-16 py-24 sm:py-32 lg:grid-cols-2">
          <div>
            <SectionHead center={false} index={3} eyebrow="Aftercare" title="Looking after" accent="your treatment." />
            <Reveal delay={0.1}>
              <ol className="mt-10 border-t border-line">
                {AFTERCARE.map((t, i) => (
                  <li key={t} className="flex gap-5 border-b border-line py-4 text-[15.5px] leading-relaxed text-slate-700">
                    <span className="mt-1 font-mono text-[11px] text-slate-400">{pad(i + 1)}</span>{t}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:pt-[120px]">
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-red-700"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Dental emergency</p>
              <p className="mt-5 text-[17px] leading-relaxed text-ink">For severe toothache, a broken or knocked-out tooth, or swelling, call us right away.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">If a permanent tooth is knocked out, hold it by the crown (not the root), keep it moist in milk, and come in as quickly as possible.</p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-500">For heavy bleeding, major facial injury or difficulty breathing or swallowing, go to the nearest hospital emergency department.</p>
              <a href={`tel:${CLINIC.phones[0].tel}`} className="btn tabular mt-7 bg-red-600 text-white hover:bg-red-700"><Phone size={15} /> Call {CLINIC.phones[0].display}</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Getting here */}
      <section className="grain bg-brand-950 text-white">
        <div className="container-x grid gap-16 py-24 sm:py-32 lg:grid-cols-2">
          <div>
            <SectionHead light center={false} index={4} eyebrow="Getting here" title="Easy to find," accent="next to Big Market." />
            <Reveal delay={0.1}>
              <address className="mt-8 text-[17px] not-italic leading-relaxed text-white/75">{CLINIC.address.line1}<br />{CLINIC.address.line2}</address>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/50">On 60th Main Road in Sahakarnagar G Block, easily reached from Hebbal, Kodigehalli, Byatarayanapura and Yelahanka.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={CLINIC.mapLink} target="_blank" rel="noopener" className="btn-primary">Open in Google Maps <ArrowUpRight size={15} /></a>
                <Link href="/book-appointment" className="btn border border-white/20 text-white hover:border-white/50">Book your visit <ArrowRight size={15} /></Link>
              </div>
              <p className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">Patients visit us from</p>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-white/60">{CLINIC.areasServed.join(" · ")}</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">Opening hours</p>
            <div className="mt-3"><HoursTable dark /></div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
