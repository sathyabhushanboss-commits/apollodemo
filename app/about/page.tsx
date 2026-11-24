import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DOCTORS, SERVICES } from "@/lib/site";
import { PageHero, CtaBand, SectionHead, pad } from "@/components/shared";
import { Reveal, CountUp } from "@/components/client";

export const metadata: Metadata = {
  title: "About Us — Apollo Dental Clinic, Sahakar Nagar",
  description: "Apollo Dental Sahakarnagar brings the trusted standards of The Apollo Hospitals Group to North Bangalore — specialist dentists, modern technology and a safe, sterile environment.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { t: "Clinical excellence", d: "Evidence-based treatment by qualified specialists." },
  { t: "Safety first", d: "Rigorous sterilisation and infection control." },
  { t: "Modern technology", d: "Digital diagnostics and minimally invasive techniques." },
  { t: "Compassion", d: "Patient, gentle care with transparent communication." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="The Apollo standard," accent="in your neighbourhood." sub="Bringing world-class dental care from The Apollo Hospitals Group to Sahakarnagar and North Bengaluru." crumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />

      <section className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHead center={false} index={1} eyebrow="Our story" title="Dentistry that puts" accent="you first." />
        <Reveal delay={0.1}>
          <div className="space-y-6 text-[18px] leading-[1.7] text-slate-600">
            <p className="text-[22px] leading-[1.5] tracking-[-0.01em] text-ink">Apollo Dental is the dental care network of The Apollo Hospitals Group, India&apos;s leading integrated healthcare provider.</p>
            <p>Our Sahakarnagar clinic brings that legacy of clinical excellence to families across North Bengaluru, from Hebbal and Byatarayanapura to Kodigehalli and Yelahanka.</p>
            <p>We offer comprehensive dentistry under one roof, from preventive care and children&apos;s dentistry to implants, orthodontics, aligners, laser dentistry and oral surgery. Every treatment is delivered by a qualified specialist, following strict sterilisation protocols.</p>
            <p>Above all, we believe great dentistry should feel comfortable. That means clear explanations, honest treatment plans, flexible EMI options and a team that genuinely cares.</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-white">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {[{ n: DOCTORS.length, l: "Specialists" }, { n: SERVICES.length, l: "Treatments" }, { n: 7, l: "Days a week" }, { n: 365, l: "Day oral health plan" }].map((s, i) => (
            <div key={s.l} className={`flex flex-col-reverse py-10 ${i % 2 ? "border-l border-line pl-6 sm:pl-8" : "pr-6"} ${i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
              <dt className="mt-3 text-[14px] text-slate-500">{s.l}</dt>
              <dd className="text-[52px] font-light leading-none tracking-[-0.04em] text-ink"><CountUp to={s.n} /></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-px py-24 sm:py-32 md:grid-cols-2 md:gap-16">
        {[
          { t: "Mission", d: "To make high-quality, specialist dental care accessible, comfortable and affordable for every family in our community." },
          { t: "Vision", d: "To be North Bengaluru's most trusted dental clinic, known for clinical excellence, honesty and the smiles we create." },
        ].map(({ t, d }, i) => (
          <Reveal key={t} delay={i * 0.08} className="border-t border-ink pt-6 pb-12 md:pb-0">
            <p className="eyebrow">{t}</p>
            <p className="mt-6 text-[26px] leading-[1.3] tracking-[-0.02em] text-ink sm:text-[30px]">{d}</p>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-line">
        <div className="container-x py-24 sm:py-32">
          <SectionHead center={false} index={2} eyebrow="Values" title="What we" accent="stand for." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ t, d }, i) => (
              <Reveal key={t} delay={i * 0.06} className="bg-white p-7">
                <span className="font-mono text-[11px] text-slate-400">{pad(i + 1)}</span>
                <h3 className="mt-10 text-[20px] tracking-tight text-ink">{t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">{d}</p>
              </Reveal>
            ))}
          </div>
          <Link href="/doctors" className="btn-dark mt-12">Meet our dentists <ArrowRight size={15} /></Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
