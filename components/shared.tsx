import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CLINIC, SERVICES, PAGES, SITE_URL, FLYER, type Doctor } from "@/lib/site";
import { localImage } from "@/lib/images";
import { Facebook, Instagram } from "./icons";
import { CookieSettingsButton, Reveal, OpenStatus } from "./client";
import type { Post } from "@/lib/db";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Section heading: mono label + two-tone display title. */
export function SectionHead({ eyebrow, title, accent, sub, center = true, light = false, index }: { eyebrow: string; title: string; accent?: string; sub?: string; center?: boolean; light?: boolean; index?: number }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "text-white/50" : ""} ${center ? "justify-center" : ""}`}>
        {index !== undefined && <span className={light ? "text-white" : "text-ink"}>{pad(index)}</span>}
        {eyebrow}
      </p>
      <h2 className={`mt-5 text-[34px] font-normal leading-[1.04] tracking-[-0.035em] sm:text-[48px] ${light ? "text-white" : "text-ink"}`}>
        {title}{accent && <> <span className={light ? "text-white/45" : "text-slate-400"}>{accent}</span></>}
      </h2>
      {sub && <p className={`mt-5 text-[17px] leading-relaxed ${center ? "mx-auto max-w-xl" : "max-w-lg"} ${light ? "text-white/60" : "text-slate-500"}`}>{sub}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, accent, sub, crumbs }: { eyebrow: string; title: string; accent?: string; sub?: string; crumbs: { name: string; path: string }[] }) {
  return (
    <section className="border-b border-line">
      <div className="container-x pb-14 pt-10 sm:pb-20 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
          {crumbs.map((c, i) => (
            <span key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i < crumbs.length - 1 ? <Link href={c.path} className="transition hover:text-ink">{c.name}</Link> : <span className="text-slate-600" aria-current="page">{c.name}</span>}
            </span>
          ))}
        </nav>
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 text-[40px] font-normal leading-[1.02] tracking-[-0.04em] text-ink sm:text-[64px]">
              {title}{accent && <> <span className="text-slate-400">{accent}</span></>}
            </h1>
          </Reveal>
          {sub && (
            <Reveal delay={0.1}>
              <p className="max-w-md text-[17px] leading-relaxed text-slate-500 lg:pb-2">{sub}</p>
            </Reveal>
          )}
        </div>
      </div>
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </section>
  );
}

export function ServiceCard({ s, i = 0 }: { s: (typeof SERVICES)[number]; i?: number }) {
  const n = SERVICES.findIndex((x) => x.slug === s.slug) + 1;
  return (
    <Reveal delay={(i % 3) * 0.06} className="h-full">
      <Link href={`/services/${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-slate-300 hover:shadow-[var(--shadow-soft)] sm:p-7">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
          <span>{pad(n)}</span>
          <span>{s.group}</span>
        </div>
        <h3 className="mt-10 text-[22px] leading-tight tracking-tight text-ink">{s.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-500">{s.short}</p>
        <div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-[13.5px]">
          <span className="text-slate-500">{s.subServices.length} procedures</span>
          <span className="flex items-center gap-1.5 text-ink">
            Learn more <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function initials(name: string) {
  return name.replace(/^Dr\.?\s*/i, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
}

export function DoctorCard({ d, i = 0 }: { d: Doctor; i?: number }) {
  const photo = localImage(d.photo);
  return (
    <Reveal delay={(i % 4) * 0.06} className="h-full">
      <article className="group h-full">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
          {photo ? (
            <Image src={photo} alt={`${d.name}, ${d.role} at Apollo Dental Sahakarnagar`} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover object-top grayscale-[15%] transition duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0" />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-serif text-[88px] leading-none text-slate-300 transition-colors duration-500 group-hover:text-slate-400" aria-hidden>
              {initials(d.name)}
            </span>
          )}
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-slate-600 backdrop-blur">{d.qual}</span>
        </div>
        <h3 className="mt-4 text-[17px] tracking-tight text-ink">{d.name}</h3>
        <p className="mt-0.5 text-[14px] text-slate-500">{d.role}</p>
        {d.award && <p className="mt-2 text-[12.5px] leading-snug text-accent-700">{d.award}</p>}
      </article>
    </Reveal>
  );
}

export function formatDate(d: string) {
  return new Date(d.replace(" ", "T")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const readMins = (p: Post) => Math.max(2, Math.round((p.content?.split(/\s+/).length ?? 600) / 220));

export function BlogCard({ p, i = 0 }: { p: Post; i?: number }) {
  return (
    <Reveal delay={(i % 3) * 0.06} className="h-full">
      <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col">
        <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl bg-brand-950 p-5 text-white grain">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50">{p.category}</span>
          <span className="max-w-[85%] font-serif text-[26px] leading-[1.1] text-white/90 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1">{p.title}</span>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">{formatDate(p.created_at)} · {readMins(p)} min read</p>
        <h3 className="mt-2 line-clamp-2 text-[18px] leading-snug tracking-tight text-ink"><span className="link-u">{p.title}</span></h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[14.5px] leading-relaxed text-slate-500">{p.excerpt}</p>
      </Link>
    </Reveal>
  );
}

export function CtaBand() {
  return (
    <section className="grain bg-brand-950 text-white">
      <div className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal>
          <p className="eyebrow text-white/45">Appointments</p>
          <h2 className="mt-5 text-[40px] font-normal leading-[1.02] tracking-[-0.04em] sm:text-[64px]">
            Book a visit. <span className="text-white/40">We&apos;ll take it from there.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-[16px] leading-relaxed text-white/60">Consultations with our specialists, seven days a week. EMI available on treatment.<span className="text-white/35">*</span></p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book-appointment" className="btn-primary h-12 px-6">Book appointment <ArrowRight size={16} /></Link>
            <a href={`tel:${CLINIC.phones[0].tel}`} className="btn tabular h-12 border border-white/20 px-6 text-white hover:border-white/50">{CLINIC.phones[0].display}</a>
          </div>
          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-wider text-white/30">*T&amp;C apply</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink pb-20 text-white/60 md:pb-0">
      <div className="container-x grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <span className="inline-block rounded-lg bg-white px-3 py-2"><Image src="/logo.png" alt="Apollo Dental" width={90} height={65} className="h-9 w-auto" /></span>
          <p className="mt-6 max-w-xs text-[14.5px] leading-relaxed">
            Specialist dental care from The Apollo Hospitals Group, in Sahakarnagar, North Bengaluru.
          </p>
          <OpenStatus className="mt-6 text-[13px] text-white/75" />
        </div>
        <FooterCol title="Treatments">
          {SERVICES.slice(0, 7).map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="link-u transition hover:text-white">{s.title}</Link></li>)}
          <li><Link href="/services" className="text-white/90 transition hover:text-white">All treatments →</Link></li>
        </FooterCol>
        <FooterCol title="Clinic">
          {PAGES.filter((p) => p.href !== "/").map((n) => <li key={n.href}><Link href={n.href} className="link-u transition hover:text-white">{n.label}</Link></li>)}
        </FooterCol>
        <div>
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35">Visit</h3>
          <address className="mt-5 text-[14.5px] not-italic leading-relaxed text-white/80">
            {CLINIC.address.line1}<br />{CLINIC.address.line2}<br /><span className="text-white/50">{CLINIC.address.landmark}</span>
          </address>
          <a href={CLINIC.mapLink} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1 text-[14px] text-white transition hover:text-accent-300">Get directions <ArrowUpRight size={14} /></a>
          <ul className="mt-6 space-y-1.5 text-[14.5px]">
            {CLINIC.phones.map((p) => (
              <li key={p.tel} className="flex justify-between gap-4">
                <span className="text-white/40">{p.label}</span>
                <a href={`tel:${p.tel}`} className="tabular text-white/80 transition hover:text-white">{p.display}</a>
              </li>
            ))}
            <li className="pt-2"><a href={`mailto:${CLINIC.email}`} className="break-all text-white/80 transition hover:text-white">{CLINIC.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="container-x border-b border-white/10 py-6 text-[12.5px] leading-relaxed text-white/40">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">Serving&nbsp;&nbsp;</span>
        {CLINIC.areasServed.join(" · ")}
      </div>

      <div className="container-x flex flex-col gap-4 py-6 text-[12.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {CLINIC.name}. Part of Apollo Dental, <a href={FLYER.parentWebsite.href} target="_blank" rel="noopener" className="transition hover:text-white">The Apollo Hospitals Group</a>.</p>
        <div className="flex items-center gap-5">
          <CookieSettingsButton className="transition hover:text-white" />
          <Link href="/privacy-policy" className="transition hover:text-white">Privacy</Link>
          <Link href="/cookie-policy" className="transition hover:text-white">Cookies</Link>
          <span className="flex gap-1">
            {[{ href: CLINIC.social.facebook, I: Facebook, l: "Facebook" }, { href: CLINIC.social.instagram, I: Instagram, l: "Instagram" }].map(({ href, I, l }) => (
              <a key={l} href={href} target="_blank" rel="noopener" aria-label={l} className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10 hover:text-white"><I size={15} /></a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35">{title}</h3>
      <ul className="mt-5 space-y-2 text-[14.5px]">{children}</ul>
    </div>
  );
}
