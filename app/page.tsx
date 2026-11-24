import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CLINIC, SERVICES, DOCTORS, REVIEWS, HOME_FAQS, FLYER } from "@/lib/site";
import { listPosts, readingTime } from "@/lib/db";
import { localImage } from "@/lib/images";
import { StandardsSection } from "@/components/standards";
import { Hero } from "@/components/hero";
import { ReviewsSection } from "@/components/reviews";
import { SmileStudio } from "@/components/smile-studio";
import { JournalSection, type JournalPost } from "@/components/journal";
import { Reveal, Faq, HoursTable, ImageSlider, ProcessSteps, TreatmentsShowcase, type Slide, type TreatmentItem } from "@/components/client";
import { SectionHead, DoctorCard, CtaBand, JsonLd, faqSchema, pad, formatDate } from "@/components/shared";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Apollo Dental Sahakarnagar | Best Dental Clinic & Dentist in Sahakar Nagar, Bangalore" },
  description:
    "Looking for the best dentist in Sahakarnagar? Apollo Dental offers implants, root canal, braces, Invisalign, teeth whitening & kids dentistry by 11 specialists. Open 7 days. Easy EMI. Book now.",
  alternates: { canonical: "/" },
};

const SLIDES: Slide[] = [
  { src: "/images/home/banner-services.png", w: 1920, h: 556, href: "/book-appointment", alt: "One stop solution for all your dental needs: RCT, extractions, laser gum treatments and crowns. Book an appointment.", caption: "RCT, extractions, laser gum treatments and crowns under one roof" },
  { src: "/images/home/banner-award.png", w: 1920, h: 556, alt: "Apollo Dental ranked No. 1 in Dental Care in the Times All India Top Lifestyle Hospitals/Clinics Ranking Survey 2025, for the 6th time in a row.", caption: "Ranked No. 1 in Dental Care, Times All India Survey 2025, for the 6th year running" },
  { src: "/images/home/team-1.png", w: 1600, h: 1064, alt: "The Apollo Dental Sahakarnagar team at the clinic reception", caption: "Our Sahakarnagar team at the front desk" },
  { src: "/images/home/team-2.png", w: 1600, h: 1064, alt: "Apollo Dental Sahakarnagar clinical team", caption: "The clinical team who'll look after you" },
  { src: "/images/home/team-3.png", w: 1600, h: 1064, alt: "Apollo Dental Sahakarnagar team smiling at the reception desk", caption: "A warm welcome, seven days a week" },
];

const STANDARDS = [
  { t: "The Apollo protocols", d: "Clinical standards, sterilisation and patient-safety protocols of The Apollo Hospitals Group, applied at every chair." },
  { t: "A specialist for each case", d: "Implants with an implantologist, braces with an orthodontist, children with a pedodontist. Not one generalist for everything." },
  { t: "Precise, gentler technology", d: "Digital radiography, dental lasers and rotary endodontics mean shorter appointments and more predictable results." },
  { t: "Plans you can understand", d: "Every option, timeline and cost explained before treatment starts, with easy EMI options available (T&C apply)." },
];

const STEPS = [
  { t: "Book", d: "Call, WhatsApp or request a callback. We confirm a slot that suits you, including evenings and Sundays." },
  { t: "Diagnose", d: "A thorough examination with imaging where needed. Findings and options are explained clearly." },
  { t: "Treat", d: "Your specialist carries out treatment with comfort and precision as the priority." },
  { t: "Follow up", d: "Aftercare guidance and reviews so your results last, plus the 365-day oral health plan." },
];

export default function HomePage() {
  const journal: JournalPost[] = listPosts().slice(0, 9).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, author: p.author,
    date: formatDate(p.created_at), mins: readingTime(p.content),
  }));
  const avatars = DOCTORS.map((d) => ({ src: localImage(d.photo), name: d.name }))
    .filter((a): a is { src: string; name: string } => !!a.src).slice(0, 4);
  const treatments: TreatmentItem[] = SERVICES.map((s) => ({
    slug: s.slug, title: s.title, short: s.short, group: s.group, subServices: s.subServices,
    img: localImage(`/images/services/${s.slug}.jpg`) ?? localImage(`/images/services/${s.slug}.svg`),
  }));
  const extra = FLYER.servicesAvailable.map((s) => s.label).filter((l) => !SERVICES.some((s) => s.title.toLowerCase().includes(l.toLowerCase().split(" ")[0])));

  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />

      {/* ─── Highlights slider ────────────────────────────── */}
      <section className="container-x pt-5 sm:pt-8">
        <ImageSlider slides={SLIDES} />
      </section>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <Hero avatars={avatars} />

      {/* ─── Smile studio (interactive tooth) ─────────────── */}
      <SmileStudio />

      {/* ─── 01 Treatments ────────────────────────────────── */}
      <section className="container-x py-24 sm:py-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHead center={false} index={1} eyebrow="Treatments" title="Complete dental care," accent="under one roof." sub="From a routine clean to full-mouth rehabilitation, planned and carried out by the right specialist." />
          <Reveal delay={0.1}>
            <Link href="/services" className="btn-ghost shrink-0">All treatments <ArrowRight size={15} /></Link>
          </Reveal>
        </div>

        <div className="mt-14 lg:mt-16">
          <TreatmentsShowcase items={treatments} />
        </div>

        {extra.length > 0 && (
          <Reveal>
            <p className="mt-8 text-[14px] leading-relaxed text-slate-500 lg:ml-[calc(41.666%+1.5rem)]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Also available&nbsp;&nbsp;</span>
              {extra.join(" · ")}
            </p>
          </Reveal>
        )}
      </section>

      {/* ─── 02 Standard ──────────────────────────────────── */}
      <StandardsSection items={STANDARDS} />

      {/* ─── 03 Process ───────────────────────────────────── */}
      <section className="container-x py-24 sm:py-32">
        <SectionHead center={false} index={3} eyebrow="Your visit" title="Clear at every step," accent="from first call to follow-up." />
        <ProcessSteps steps={STEPS} />
      </section>

      {/* ─── 04 Dentists ──────────────────────────────────── */}
      <section className="border-t border-line bg-white">
        <div className="container-x py-24 sm:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHead center={false} index={4} eyebrow="The team" title="Eleven specialists." accent="One clinic." sub="MDS-qualified dentists in implantology, orthodontics, endodontics, periodontics, prosthodontics, paediatric dentistry and oral surgery." />
            <Reveal><Link href="/doctors" className="btn-ghost shrink-0">Meet the team <ArrowRight size={15} /></Link></Reveal>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {DOCTORS.slice(0, 4).map((d, i) => <DoctorCard key={d.name} d={d} i={i} />)}
          </div>
        </div>
      </section>

      {/* ─── 05 Reviews ───────────────────────────────────── */}
      <ReviewsSection reviews={REVIEWS} mapLink={CLINIC.mapLink} />

      {/* ─── 06 FAQ ───────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead center={false} index={6} eyebrow="Questions" title="Good to know" accent="before you visit." sub="If your question isn't here, our front desk is happy to help." />
            <Reveal delay={0.1}>
              <div className="mt-8 divide-y divide-line border-y border-line">
                {CLINIC.phones.slice(0, 2).map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="group flex items-center justify-between py-4">
                    <span className="text-[14px] text-slate-500">{p.label}</span>
                    <span className="tabular flex items-center gap-2 text-[16px] text-ink">{p.display} <ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-ink" /></span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.05}><Faq items={HOME_FAQS} /></Reveal>
        </div>
      </section>

      {/* ─── 07 Journal ───────────────────────────────────── */}
      <JournalSection posts={journal} />

      {/* ─── 08 Visit ─────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <SectionHead center={false} index={8} eyebrow="Visit" title="60th Main Road," accent="next to Big Market." />
            <Reveal delay={0.1}>
              <address className="mt-8 text-[16px] not-italic leading-relaxed text-slate-600">
                {CLINIC.address.line1}<br />{CLINIC.address.line2}
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={CLINIC.mapLink} target="_blank" rel="noopener" className="btn-dark">Get directions <ArrowUpRight size={15} /></a>
                <Link href="/contact" className="btn-ghost">Contact</Link>
              </div>
              <div className="mt-12">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">Opening hours</p>
                <div className="mt-3"><HoursTable /></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-line bg-slate-100 lg:min-h-[480px]">
              <iframe title="Apollo Dental Sahakarnagar on Google Maps" src={CLINIC.mapEmbed} className="absolute inset-0 h-full w-full border-0 grayscale contrast-[1.05]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { href: "/patient-guide", k: "First visit?", v: "Read the patient guide" },
                { href: "/gallery", k: "The clinic", v: "See inside" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="group flex items-center justify-between rounded-xl border border-line bg-white p-5 transition hover:border-slate-300">
                  <span>
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">{l.k}</span>
                    <span className="mt-1 block text-[16px] text-ink">{l.v}</span>
                  </span>
                  <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
