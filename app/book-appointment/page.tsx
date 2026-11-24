import type { Metadata } from "next";
import { CLINIC } from "@/lib/site";
import { PageHero } from "@/components/shared";
import { BookingWizard, OpenStatus } from "@/components/client";

export const metadata: Metadata = {
  title: "Book a Dental Appointment Online — Sahakarnagar",
  description: "Book your appointment at Apollo Dental Sahakarnagar in 3 quick steps — choose a treatment, pick a date and time, and we'll call to confirm. Open 7 days.",
  alternates: { canonical: "/book-appointment" },
};

export default function BookPage() {
  return (
    <>
      <PageHero eyebrow="Book appointment" title="Book in" accent="three steps." sub="Choose your treatment, pick a convenient slot, and our team will call you to confirm." crumbs={[{ name: "Home", path: "/" }, { name: "Book Appointment", path: "/book-appointment" }]} />
      <section className="container-x grid gap-10 py-12 pb-24 sm:py-16 lg:grid-cols-[1fr_300px]">
        <BookingWizard />
        <aside className="space-y-8 text-[14.5px] lg:pt-2">
          <OpenStatus className="text-[13px] text-slate-600" />
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">Prefer to call?</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {CLINIC.phones.map((p) => (
                <li key={p.tel}><a href={`tel:${p.tel}`} className="flex justify-between py-3"><span className="text-slate-500">{p.label}</span><span className="tabular text-ink">{p.display}</span></a></li>
              ))}
            </ul>
          </div>
          {[
            { t: "Timings", d: CLINIC.hours.map((h) => `${h.days}: ${h.time}`).join(" · ") },
            { t: "Location", d: `${CLINIC.address.line1}, ${CLINIC.address.line2} (${CLINIC.address.landmark})` },
            { t: "Payment", d: "Dental treatments available on easy EMI options. T&C apply." },
            { t: "Safety", d: "Apollo Hospitals Group infection-control protocols." },
          ].map(({ t, d }) => (
            <div key={t}>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">{t}</p>
              <p className="mt-2 leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
