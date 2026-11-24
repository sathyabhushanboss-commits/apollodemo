"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Phone, X, ArrowRight, ArrowUpRight, Check, Loader2, MessageCircle, ArrowUp, Plus, Calendar,
} from "lucide-react";
import { CLINIC, NAV, PAGES, SERVICES } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

// ═════════════════════════════════════════════════════════════
// Cookie helpers
// ═════════════════════════════════════════════════════════════
export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
export function setCookie(name: string, value: string, days: number) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax${secure}`;
}
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const CONSENT_COOKIE = "adsn_consent";
export type Consent = { v: 1; id: string; necessary: true; analytics: boolean; marketing: boolean; ts: number };
export function readConsent(): Consent | null {
  try {
    const raw = getCookie(CONSENT_COOKIE);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

// ═════════════════════════════════════════════════════════════
// Motion primitives
// ═════════════════════════════════════════════════════════════
export function Reveal({ children, delay = 0, y = 14, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. Screen readers get the plain string. */
export function RevealHeading({ lines, label: ariaLabel, className, as: Tag = "h1" }: { lines: React.ReactNode[]; label?: string; className?: string; as?: "h1" | "h2" }) {
  const label = ariaLabel ?? (lines.map((l) => (typeof l === "string" ? l : "")).join(" ").trim() || undefined);
  return (
    <Tag className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden={label ? true : undefined}>
          <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease: EASE }}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref} className="tabular">{n}{suffix}</span>;
}

// ═════════════════════════════════════════════════════════════
// Live clinic status (computed in IST regardless of visitor timezone)
// ═════════════════════════════════════════════════════════════
const OPEN_MIN = 9 * 60 + 30;
const closeMin = (day: number) => (day === 0 ? 17 * 60 : 20 * 60 + 30);
const fmtMin = (m: number) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")} ${m < 720 ? "AM" : "PM"}`;
const DAY_IDX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function istNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: DAY_IDX[get("weekday")] ?? 0, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type ClinicStatus = { open: boolean; label: string; day: number };
export function useClinicStatus(): ClinicStatus | null {
  const [s, setS] = useState<ClinicStatus | null>(null);
  useEffect(() => {
    const calc = () => {
      const { day, min } = istNow();
      const close = closeMin(day);
      if (min >= OPEN_MIN && min < close) {
        const left = close - min;
        return { open: true, day, label: left <= 60 ? `Open · closes in ${left} min` : `Open now · until ${fmtMin(close)}` };
      }
      if (min < OPEN_MIN) return { open: false, day, label: `Closed · opens ${fmtMin(OPEN_MIN)} today` };
      return { open: false, day, label: `Closed · opens ${fmtMin(OPEN_MIN)} tomorrow` };
    };
    setS(calc());
    const id = setInterval(() => setS(calc()), 30_000);
    return () => clearInterval(id);
  }, []);
  return s;
}

export function OpenStatus({ className = "" }: { className?: string }) {
  const s = useClinicStatus();
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
      <span className="relative flex h-2 w-2">
        {s?.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 [animation-duration:2s]" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s ? (s.open ? "bg-emerald-500" : "bg-slate-400") : "bg-slate-300"}`} />
      </span>
      <span className="tabular">{s?.label ?? "Mon–Sat 9:30 AM – 8:30 PM"}</span>
    </span>
  );
}

/** Weekly timings with today highlighted. */
export function HoursTable({ dark = false }: { dark?: boolean }) {
  const s = useClinicStatus();
  const rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d, i) => {
    const day = (i + 1) % 7;
    return { d, day, t: `${fmtMin(OPEN_MIN)} – ${fmtMin(closeMin(day))}` };
  });
  return (
    <dl className={`divide-y text-[14px] ${dark ? "divide-white/10" : "divide-line"}`}>
      {rows.map((r) => {
        const today = s?.day === r.day;
        return (
          <div key={r.d} className={`flex items-center justify-between py-2.5 ${today ? (dark ? "text-white" : "text-ink") : dark ? "text-white/55" : "text-slate-500"}`}>
            <dt className="flex items-center gap-2">
              {r.d}
              {today && <span className={`rounded-full px-1.5 py-px font-mono text-[10px] uppercase tracking-wider ${dark ? "bg-white/10" : "bg-ink text-white"}`}>Today</span>}
            </dt>
            <dd className="tabular font-mono text-[13px]">{r.t}</dd>
          </div>
        );
      })}
    </dl>
  );
}

// ═════════════════════════════════════════════════════════════
// Header
// ═════════════════════════════════════════════════════════════
const CATEGORY_ORDER = ["Restorative", "Cosmetic", "Orthodontic", "Preventive", "Surgical", "Specialty"] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setMenu(null); }, [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    if (!menu && !open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(null); setOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, open]);

  if (pathname?.startsWith("/admin")) return null;
  const active = (href: string) => (href === "/" ? pathname === "/" : !!pathname?.startsWith(href));
  const patients = NAV.find((n) => n.children);

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => setMenu(null)}>
      {/* Utility bar */}
      <div className={`hidden overflow-hidden bg-ink text-white/70 transition-[max-height] duration-300 md:block ${scrolled ? "max-h-0" : "max-h-10"}`}>
        <div className="container-x flex h-9 items-center justify-between text-[12.5px]">
          <OpenStatus className="text-white/80" />
          <div className="flex items-center gap-6">
            <span className="hidden lg:inline">{CLINIC.address.line1.replace("26, 1st Floor, ", "")}, Sahakarnagar · {CLINIC.address.landmark}</span>
            <a href={`tel:${CLINIC.phones[2].tel}`} className="tabular transition hover:text-white">Toll-free {CLINIC.phones[2].display}</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`relative border-b transition-[background-color,border-color] duration-300 ${scrolled || menu ? "border-line bg-paper/90 backdrop-blur-md backdrop-saturate-150" : "border-transparent bg-paper"}`}>
        <div className="container-x flex h-[68px] items-center justify-between gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Apollo Dental Sahakarnagar, home">
            <Image src="/logo.png" alt="" width={70} height={51} priority className="h-10 w-auto" />
            <span className="hidden border-l border-line pl-3 font-mono text-[10.5px] uppercase leading-[1.35] tracking-[0.14em] text-slate-500 sm:block">
              Sahakarnagar<br />Bengaluru
            </span>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {NAV.map((n) => {
              const isOn = n.children ? n.children.some((c) => active(c.href)) : active(n.href);
              const hasMenu = n.href === "/services" || !!n.children;
              const key = n.href === "/services" ? "services" : n.children ? "patients" : null;
              const cls = `relative flex h-[68px] items-center gap-1 px-3 text-[14px] transition-colors xl:px-3.5 ${isOn ? "text-ink" : "text-slate-600 hover:text-ink"}`;
              const underline = isOn && <span className="absolute inset-x-3 bottom-[18px] h-px bg-ink xl:inset-x-3.5" />;
              const chevron = hasMenu && (
                <svg width="10" height="10" viewBox="0 0 10 10" className={`mt-px transition-transform duration-200 ${menu === key ? "rotate-180" : ""}`} aria-hidden><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
              );
              if (n.children) {
                return (
                  <button key={n.label} type="button" className={cls} aria-expanded={menu === "patients"} onMouseEnter={() => setMenu("patients")} onFocus={() => setMenu("patients")} onClick={() => setMenu(menu === "patients" ? null : "patients")}>
                    {n.label}{chevron}{underline}
                  </button>
                );
              }
              return (
                <Link key={n.href} href={n.href} className={cls} onMouseEnter={() => setMenu(key)} onFocus={() => setMenu(key)} aria-current={isOn ? "page" : undefined}>
                  {n.label}{chevron}{underline}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${CLINIC.phones[0].tel}`} className="hidden items-center gap-2 whitespace-nowrap px-3 text-[14px] text-slate-600 transition hover:text-ink xl:flex">
              <Phone size={15} strokeWidth={1.75} /> <span className="tabular">{CLINIC.phones[0].display}</span>
            </a>
            <Link href="/book-appointment" className="btn-dark hidden h-10 sm:inline-flex">
              Book a visit <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
            <button onClick={() => setOpen(true)} className="-mr-2 grid h-11 w-11 place-items-center lg:hidden" aria-label="Open menu" aria-expanded={open}>
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden><path d="M3 8h16M3 14h16" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
        </div>

        {/* Mega panels */}
        <AnimatePresence>
          {menu && (
            <motion.div
              key={menu}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-paper shadow-[0_24px_40px_-24px_rgb(15_26_28/0.18)] lg:block"
            >
              {menu === "services" ? (
                <div className="container-x grid grid-cols-[1fr_300px] gap-12 py-10">
                  <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                    {CATEGORY_ORDER.map((cat) => {
                      const items = SERVICES.filter((s) => s.category === cat);
                      if (!items.length) return null;
                      return (
                        <div key={cat}>
                          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">{cat}</p>
                          <ul className="mt-3 space-y-1.5">
                            {items.map((s) => (
                              <li key={s.slug}>
                                <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-1.5 text-[15px] text-slate-700 transition hover:text-ink">
                                  <span className="link-u">{s.title}</span>
                                  <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col justify-between rounded-xl bg-ink p-6 text-white">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50">Not sure where to start?</p>
                      <p className="mt-3 text-[19px] leading-snug">Book a consultation. Your dentist will recommend the right treatment for you.</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Link href="/services" className="text-[14px] text-white/70 transition hover:text-white">All treatments</Link>
                      <Link href="/book-appointment" className="btn-primary h-9 px-4 text-[13px]">Book <ArrowRight size={14} /></Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container-x grid grid-cols-3 gap-4 py-8">
                  {patients?.children?.map((c, i) => (
                    <Link key={c.href} href={c.href} className="group rounded-xl border border-line bg-white p-5 transition hover:border-slate-300">
                      <span className="font-mono text-[11px] text-slate-400">0{i + 1}</span>
                      <span className="mt-6 flex items-center justify-between text-[17px] text-ink">{c.label}<ArrowRight size={16} className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" /></span>
                      <span className="mt-1 block text-[14px] text-slate-500">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            role="dialog" aria-modal="true" aria-label="Menu"
          >
            <div className="container-x flex h-[68px] shrink-0 items-center justify-between border-b border-line">
              <Image src="/logo.png" alt="Apollo Dental" width={70} height={51} className="h-10 w-auto" />
              <button onClick={() => setOpen(false)} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Close menu"><X size={22} strokeWidth={1.5} /></button>
            </div>
            <nav className="container-x flex-1 overflow-y-auto py-4" aria-label="Mobile">
              {PAGES.filter((p) => p.href !== "/book-appointment").map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, duration: 0.5, ease: EASE }}>
                  <Link href={n.href} className="flex items-baseline gap-4 border-b border-line py-3.5">
                    <span className="w-6 font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[26px] tracking-tight ${active(n.href) ? "text-ink" : "text-slate-600"}`}>{n.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container-x shrink-0 space-y-3 border-t border-line py-5">
              <OpenStatus className="text-[13px] text-slate-600" />
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${CLINIC.phones[0].tel}`} className="btn-ghost"><Phone size={15} /> Call</a>
                <Link href="/book-appointment" className="btn-primary">Book a visit</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════
// Lead form (hero, contact page, service pages, popup)
// ═════════════════════════════════════════════════════════════
type LeadFormProps = { source: string; variant?: "full" | "compact" | "dark"; defaultService?: string; onSuccess?: () => void; submitLabel?: string };

function Field({ label, optional, dark, children, className = "" }: { label: string; optional?: boolean; dark?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={`mb-1.5 flex items-baseline justify-between text-[13px] font-medium ${dark ? "text-white/80" : "text-slate-700"}`}>
        {label}
        {optional && <span className={`text-[12px] font-normal ${dark ? "text-white/40" : "text-slate-400"}`}>Optional</span>}
      </span>
      {children}
    </label>
  );
}

export function LeadForm({ source, variant = "full", defaultService = "", onSuccess, submitLabel = "Request appointment" }: LeadFormProps) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const dark = variant === "dark";
  const full = variant === "full";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    const phone = (payload.phone || "").replace(/\D/g, "").slice(-10);
    if (!payload.name?.trim() || payload.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (!payload.agree) return setError("Please agree to be contacted.");
    setState("loading");
    let utm: string | null = null;
    try { utm = sessionStorage.getItem("adsn_utm"); } catch {}
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, phone, source, page: pathname, utm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setName(payload.name.trim().split(" ")[0]);
      setState("done");
      setCookie("adsn_lead_done", "1", 30);
      onSuccess?.();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us.");
    }
  }

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.6 }} className="py-4">
        <span className={`grid h-10 w-10 place-items-center rounded-full ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}><Check size={18} strokeWidth={2} /></span>
        <h3 className={`mt-5 text-[22px] tracking-tight ${dark ? "text-white" : "text-ink"}`}>Thanks{name ? `, ${name}` : ""}. We&apos;ll call you shortly.</h3>
        <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-white/60" : "text-slate-500"}`}>Our front desk will call to confirm a time that suits you.</p>
        <a href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hi, I just requested an appointment on your website.")}`} target="_blank" rel="noopener" className={`mt-6 ${dark ? "btn border border-white/20 text-white hover:bg-white/10" : "btn-ghost"}`}>
          <MessageCircle size={15} /> Message us on WhatsApp
        </a>
      </motion.div>
    );
  }

  const inputCls = dark ? "input border-white/15 bg-white/[0.06] text-white placeholder:text-white/35 hover:border-white/25 focus:border-white focus:shadow-none" : "input";

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className={full ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
        <Field label="Full name" dark={dark}>
          <input name="name" required autoComplete="name" className={inputCls} />
        </Field>
        <Field label="Mobile number" dark={dark}>
          <span className="relative block">
            <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] ${dark ? "text-white/45" : "text-slate-400"}`}>+91</span>
            <input name="phone" required inputMode="numeric" autoComplete="tel-national" maxLength={14} className={`${inputCls} tabular pl-12`} />
          </span>
        </Field>
        {full && (
          <Field label="Email" optional dark={dark}>
            <input name="email" type="email" autoComplete="email" className={inputCls} />
          </Field>
        )}
        <Field label="Treatment" optional dark={dark}>
          <select name="service" defaultValue={defaultService} className={`${inputCls} ${dark ? "[&>option]:text-ink" : ""}`}>
            <option value="">Not sure yet</option>
            {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
            <option value="General Consultation">General consultation</option>
            <option value="Dental Emergency">Dental emergency / pain</option>
          </select>
        </Field>
        {full && (
          <Field label="Preferred date" optional dark={dark} className="sm:col-span-2">
            <input name="preferred_date" type="date" min={new Date().toISOString().slice(0, 10)} className={inputCls} />
          </Field>
        )}
        {full && (
          <Field label="Anything we should know?" optional dark={dark} className="sm:col-span-2">
            <textarea name="message" rows={3} className={inputCls} />
          </Field>
        )}
      </div>
      <label className={`flex items-start gap-2.5 text-[12.5px] leading-relaxed ${dark ? "text-white/55" : "text-slate-500"}`}>
        <input type="checkbox" name="agree" value="yes" defaultChecked className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-ink" />
        <span>I agree to be contacted by call, SMS or WhatsApp. <Link href="/privacy-policy" className="underline underline-offset-2">Privacy policy</Link></span>
      </label>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`text-[13.5px] ${dark ? "text-red-300" : "text-red-600"}`} role="alert">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <button type="submit" disabled={state === "loading"} className="btn-primary h-12 w-full text-[15px]">
        {state === "loading" ? <><Loader2 size={16} className="animate-spin" /> Sending</> : <>{submitLabel} <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════
// Lead capture popup: appears after 60 seconds
// ═════════════════════════════════════════════════════════════
const POPUP_DELAY_MS = 60_000;

export function LeadPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    // Testing aid: append ?popup to any URL to open it immediately
    if (new URLSearchParams(location.search).has("popup")) { setShow(true); return; }
    if (getCookie("adsn_lead_done") || getCookie("adsn_popup_dismissed")) return;
    // Timer runs once per browser session, counting from first page load (survives client-side navigation)
    let startedAt = Number(sessionStorage.getItem("adsn_popup_start") || 0);
    if (!startedAt) { startedAt = Date.now(); sessionStorage.setItem("adsn_popup_start", String(startedAt)); }
    if (sessionStorage.getItem("adsn_popup_shown")) return;
    const remaining = Math.max(0, POPUP_DELAY_MS - (Date.now() - startedAt));
    const t = setTimeout(() => {
      if (getCookie("adsn_lead_done")) return;
      setShow(true);
      sessionStorage.setItem("adsn_popup_shown", "1");
    }, remaining);
    return () => clearTimeout(t);
  }, [pathname]);

  const close = useCallback(() => {
    setShow(false);
    if (!done) setCookie("adsn_popup_dismissed", "1", 1);
  }, [done]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, close]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-end p-3 sm:place-items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="popup-title"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative grid max-h-[92dvh] w-full max-w-[860px] overflow-y-auto overscroll-contain rounded-2xl bg-paper shadow-[var(--shadow-pop)] md:grid-cols-[400px_1fr]"
          >
            <button onClick={close} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-ink" aria-label="Close">
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="relative flex flex-col bg-brand-950 text-white">
              {/* Team photo at native 3:2 — never cropped */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-brand-900 md:rounded-tl-2xl">
                <Image src="/images/home/team-3.png" alt="The Apollo Dental Sahakarnagar team" fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain" />
              </div>
              <div className="hidden flex-1 flex-col justify-between p-7 md:flex">
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">Apollo Dental · Sahakarnagar</p>
                  <h3 className="mt-3 text-[22px] leading-[1.2] tracking-tight">Specialist dental care, a short drive from home.</h3>
                </div>
                <ul className="mt-6 space-y-2.5 text-[13.5px] text-white/70">
                  {["11 specialist dentists", "Ranked No. 1 in Dental Care, Times Survey 2025", "EMI available on treatment*", "Open 7 days a week"].map((t) => (
                    <li key={t} className="flex items-center gap-3 border-t border-white/10 pt-2.5"><Check size={14} className="shrink-0 text-accent-400" /> {t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                className="mb-6 flex items-center gap-3 border-b border-line pb-5">
                <Image src="/logo.png" alt="Apollo Dental" width={104} height={75} className="h-[58px] w-auto sm:h-[64px]" />
                <span className="border-l border-line pl-3 font-mono text-[10.5px] uppercase leading-[1.4] tracking-[0.14em] text-slate-500">Sahakarnagar<br />Bengaluru</span>
              </motion.div>
              <p className="eyebrow">Free callback</p>
              <h2 id="popup-title" className="mt-3 text-[26px] leading-tight tracking-tight text-ink">Talk to our front desk</h2>
              <p className="mt-2 text-[15px] text-slate-500">Leave your number and we&apos;ll call to find a time that works for you.</p>
              <div className="mt-6">
                <LeadForm source="popup-60s" variant="compact" submitLabel="Request a callback" onSuccess={() => setDone(true)} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═════════════════════════════════════════════════════════════
// Cookie consent banner + preferences
// ═════════════════════════════════════════════════════════════
export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (!c) { const t = setTimeout(() => setVisible(true), 1200); return () => clearTimeout(t); }
    setAnalytics(c.analytics); setMarketing(c.marketing);
  }, []);

  useEffect(() => {
    const open = () => { setVisible(true); setPrefs(true); };
    window.addEventListener("adsn:open-consent", open);
    return () => window.removeEventListener("adsn:open-consent", open);
  }, []);

  function save(a: boolean, m: boolean) {
    const prev = readConsent();
    const consent: Consent = { v: 1, id: prev?.id || crypto.randomUUID(), necessary: true, analytics: a, marketing: m, ts: Date.now() };
    setCookie(CONSENT_COOKIE, JSON.stringify(consent), 180);
    if (!a) ["_ga", "_gid", "_gat"].forEach(deleteCookie);
    window.dispatchEvent(new CustomEvent("adsn:consent", { detail: consent }));
    fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(consent) }).catch(() => {});
    setVisible(false);
    setPrefs(false);
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-3 bottom-[76px] z-[60] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[400px]"
          role="dialog" aria-label="Cookie consent"
        >
          <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-pop)]">
            <p className="text-[15px] font-medium text-ink">Cookies</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
              We use essential cookies to run this site and, with your permission, analytics to improve it. <Link href="/cookie-policy" className="text-ink underline underline-offset-2">Learn more</Link>
            </p>

            <AnimatePresence initial={false}>
              {prefs && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-4 divide-y divide-line border-y border-line">
                    {[
                      { k: "necessary", t: "Strictly necessary", d: "Forms, security and core features.", v: true, set: undefined },
                      { k: "analytics", t: "Analytics", d: "Anonymous usage statistics.", v: analytics, set: setAnalytics },
                      { k: "marketing", t: "Marketing", d: "Measuring ad campaigns.", v: marketing, set: setMarketing },
                    ].map((row) => (
                      <div key={row.k} className="flex items-center justify-between gap-4 py-3">
                        <span>
                          <span className="block text-[13.5px] font-medium text-ink">{row.t}</span>
                          <span className="block text-[12.5px] text-slate-500">{row.d}</span>
                        </span>
                        <button
                          type="button" role="switch" aria-checked={row.v} aria-label={row.t} disabled={!row.set}
                          onClick={() => row.set?.(!row.v)}
                          className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${row.v ? "bg-ink" : "bg-slate-200"} ${!row.set ? "opacity-40" : ""}`}
                        >
                          <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-200 ${row.v ? "left-[19px]" : "left-[3px]"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex gap-2">
              {prefs ? (
                <button onClick={() => save(analytics, marketing)} className="btn-ghost h-9 flex-1 text-[13px]">Save</button>
              ) : (
                <button onClick={() => setPrefs(true)} className="btn-ghost h-9 flex-1 text-[13px]">Customise</button>
              )}
              <button onClick={() => save(false, false)} className="btn-ghost h-9 flex-1 text-[13px]">Reject</button>
              <button onClick={() => save(true, true)} className="btn-dark h-9 flex-1 text-[13px]">Accept</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("adsn:open-consent"))}>
      Cookie settings
    </button>
  );
}

// ═════════════════════════════════════════════════════════════
// Analytics: loads GA4 only after analytics consent; stores UTM params
// ═════════════════════════════════════════════════════════════
export function Analytics() {
  const [allowed, setAllowed] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    try {
      const p = new URLSearchParams(location.search);
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
      const found: Record<string, string> = {};
      keys.forEach((k) => { const v = p.get(k); if (v) found[k] = v; });
      if (Object.keys(found).length) sessionStorage.setItem("adsn_utm", JSON.stringify({ ...found, landing: location.pathname, ref: document.referrer }));
      else if (!sessionStorage.getItem("adsn_utm") && document.referrer && !document.referrer.includes(location.host))
        sessionStorage.setItem("adsn_utm", JSON.stringify({ ref: document.referrer, landing: location.pathname }));
    } catch {}
    setAllowed(!!readConsent()?.analytics);
    const on = (e: Event) => setAllowed(!!(e as CustomEvent<Consent>).detail?.analytics);
    window.addEventListener("adsn:consent", on);
    return () => window.removeEventListener("adsn:consent", on);
  }, []);

  if (!gaId || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// Floating actions: desktop WhatsApp + back-to-top, mobile action bar
// ═════════════════════════════════════════════════════════════
const WA_PATH = "M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.1 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4z";
const WhatsAppGlyph = ({ size = 20 }: { size?: number }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden><path d={WA_PATH} /></svg>;

export function FloatingActions() {
  const pathname = usePathname();
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (pathname?.startsWith("/admin")) return null;
  const wa = `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hi Apollo Dental Sahakarnagar, I'd like to book an appointment.")}`;
  return (
    <>
      {/* Desktop */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-center gap-2.5 md:flex">
        <AnimatePresence>
          {top && (
            <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-slate-600 shadow-sm transition hover:text-ink" aria-label="Back to top">
              <ArrowUp size={16} strokeWidth={1.75} />
            </motion.button>
          )}
        </AnimatePresence>
        <a href={wa} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
          className="group flex h-12 items-center gap-2 rounded-full bg-[#1fa855] pl-3.5 pr-4 text-[14px] font-medium text-white shadow-[var(--shadow-pop)] transition hover:bg-[#1a944a]">
          <WhatsAppGlyph /> WhatsApp
        </a>
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid h-16 grid-cols-[1fr_1fr_1.4fr] items-center gap-2 px-3">
          <a href={`tel:${CLINIC.phones[0].tel}`} className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-slate-300 text-[14px] font-medium text-ink"><Phone size={16} strokeWidth={1.75} /> Call</a>
          <a href={wa} target="_blank" rel="noopener" className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-slate-300 text-[14px] font-medium text-ink"><WhatsAppGlyph size={16} /> Chat</a>
          <Link href="/book-appointment" className="btn-primary h-11"><Calendar size={16} strokeWidth={1.75} /> Book visit</Link>
        </div>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// FAQ accordion
// ═════════════════════════════════════════════════════════════
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map((f, i) => {
        const on = open === i;
        const id = `faq-${i}-${f.q.length}`;
        return (
          <div key={f.q} className="border-b border-line">
            <button onClick={() => setOpen(on ? null : i)} className="group flex w-full items-start gap-5 py-5 text-left sm:py-6" aria-expanded={on} aria-controls={id}>
              <span className="mt-1 w-6 shrink-0 font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-[17px] leading-snug tracking-tight transition-colors ${on ? "text-ink" : "text-slate-700 group-hover:text-ink"}`}>{f.q}</span>
              <Plus size={18} strokeWidth={1.5} className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-300 ${on ? "rotate-45 text-ink" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                  <p className="max-w-2xl pb-6 pl-11 pr-8 text-[15.5px] leading-relaxed text-slate-600">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Gallery grid with filter + lightbox
// ═════════════════════════════════════════════════════════════
export function GalleryGrid({ items }: { items: { src: string; caption: string; tag: string }[] }) {
  const tags = ["All", ...Array.from(new Set(items.map((i) => i.tag)))];
  const [tag, setTag] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);
  const shown = tag === "All" ? items : items.filter((i) => i.tag === tag);

  useEffect(() => {
    if (idx === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [idx, shown.length]);

  return (
    <>
      <div className="flex flex-wrap gap-1 border-b border-line">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`relative px-3 pb-3 text-[14px] transition-colors ${tag === t ? "text-ink" : "text-slate-500 hover:text-ink"}`}>
            {t}
            {tag === t && <motion.span layoutId="gallery-tab" className="absolute inset-x-3 -bottom-px h-px bg-ink" />}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        <AnimatePresence>
          {shown.map((it, i) => (
            <motion.button layout key={it.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIdx(i)} className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl bg-slate-100 text-left">
              <Image src={it.src} alt={it.caption} width={800} height={600} sizes="(max-width:640px) 100vw, 33vw" className="h-auto w-full transition duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" />
              <span className="flex items-center justify-between gap-3 bg-white px-4 py-3 text-[13.5px]">
                <span className="text-ink">{it.caption}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400">{it.tag}</span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {idx !== null && shown[idx] && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdx(null)} role="dialog" aria-label="Image viewer">
            <motion.figure key={shown[idx].src} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ ease: EASE, duration: 0.5 }} className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={shown[idx].src} alt={shown[idx].caption} width={1600} height={1200} className="max-h-[80vh] w-auto rounded-lg object-contain" />
              <figcaption className="mt-4 flex justify-between text-[13px] text-white/60"><span>{shown[idx].caption}</span><span className="tabular font-mono">{String(idx + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span></figcaption>
            </motion.figure>
            <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-white/70 hover:text-white" aria-label="Close" onClick={() => setIdx(null)}><X size={22} strokeWidth={1.5} /></button>
            <button className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/80 hover:bg-white/10" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + shown.length) % shown.length); }}><ArrowRight size={18} className="rotate-180" /></button>
            <button className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 text-white/80 hover:bg-white/10" aria-label="Next" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % shown.length); }}><ArrowRight size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// Booking wizard: treatment → date & time → details
// ═════════════════════════════════════════════════════════════
const EXTRA_OPTIONS = [
  { title: "General Consultation", short: "Not sure? Start with a check-up." },
  { title: "Dental Emergency / Pain", short: "Toothache, swelling or injury." },
];

function slotsFor(d: Date) {
  // Mon–Sat 9:30–20:30, Sun 9:30–17:00 (last slot 30 min before close)
  const end = d.getDay() === 0 ? 16.5 : 20;
  const out: string[] = [];
  for (let h = 9.5; h <= end; h += 1) {
    const hh = Math.floor(h), mm = h % 1 ? "30" : "00";
    out.push(`${((hh + 11) % 12) + 1}:${mm} ${hh < 12 ? "AM" : "PM"}`);
  }
  return out;
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [first, setFirst] = useState("");

  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
  const now = new Date();
  const isToday = (d: Date) => d.toDateString() === now.toDateString();
  const slotPast = (d: Date, label: string) => {
    if (!isToday(d)) return false;
    const [hm, ap] = label.split(" "); const [h, m] = hm.split(":").map(Number);
    const hour = (h % 12) + (ap === "PM" ? 12 : 0);
    return hour * 60 + m <= now.getHours() * 60 + now.getMinutes() + 60;
  };
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const phone = (fd.phone || "").replace(/\D/g, "").slice(-10);
    if ((fd.name || "").trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (!fd.agree) return setError("Please agree to be contacted.");
    setState("loading");
    let utm: string | null = null; try { utm = sessionStorage.getItem("adsn_utm"); } catch {}
    const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fd, phone, service, preferred_date: date ? iso(date) : "", preferred_time: time, source: "booking-page", page: "/book-appointment", utm }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setState("idle"); return setError(j.error || "Something went wrong. Please call us."); }
    setFirst(fd.name.trim().split(" ")[0]); setState("done"); setCookie("adsn_lead_done", "1", 30);
  }

  const steps = ["Treatment", "Date & time", "Your details"];
  const panel = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.4, ease: EASE } };

  if (state === "done") {
    return (
      <motion.div {...panel} className="card p-8 sm:p-12">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"><Check size={20} /></span>
        <h2 className="mt-6 text-[32px] leading-tight tracking-tight text-ink">Request received, {first}.</h2>
        <p className="mt-3 max-w-md text-slate-600">We&apos;ll call you shortly to confirm your appointment.</p>
        <dl className="mt-8 max-w-md divide-y divide-line border-y border-line text-[15px]">
          <div className="flex justify-between py-3"><dt className="text-slate-500">Treatment</dt><dd className="text-ink">{service}</dd></div>
          <div className="flex justify-between py-3"><dt className="text-slate-500">Requested</dt><dd className="tabular text-ink">{date && fmt(date)} · {time}</dd></div>
        </dl>
        <p className="mt-3 text-[13px] text-slate-500">Slots are confirmed by phone, subject to availability.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(`Hi, I requested an appointment for ${service} on ${date ? fmt(date) : ""} at ${time}.`)}`} target="_blank" rel="noopener" className="btn-dark"><MessageCircle size={15} /> Confirm on WhatsApp</a>
          <Link href="/" className="btn-ghost">Back to home</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 border-b border-line">
        {steps.map((s, i) => (
          <button key={s} type="button" disabled={i > step} onClick={() => setStep(i)} className="relative px-4 py-4 text-left disabled:cursor-default sm:px-6">
            <span className={`font-mono text-[11px] ${i <= step ? "text-ink" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
            <span className={`ml-2 hidden text-[14px] sm:inline ${i === step ? "text-ink" : i < step ? "text-slate-600" : "text-slate-400"}`}>{s}</span>
            <span className="absolute inset-x-0 bottom-0 h-px bg-line">
              <motion.span className="block h-full origin-left bg-ink" initial={false} animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
            </span>
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...panel}>
              <h2 className="text-[26px] tracking-tight text-ink">What can we help with?</h2>
              <p className="mt-1 text-[15px] text-slate-500">Choose the closest match. Your dentist will confirm at the visit.</p>
              <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {[...EXTRA_OPTIONS, ...SERVICES.map((s) => ({ title: s.title, short: s.short }))].map((o) => (
                  <button key={o.title} type="button" onClick={() => { setService(o.title); setStep(1); }}
                    className={`group flex flex-col items-start bg-white p-4 text-left transition-colors hover:bg-slate-50 ${service === o.title ? "bg-slate-50" : ""}`}>
                    <span className="flex w-full items-center justify-between text-[15px] text-ink">{o.title}<ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-ink" /></span>
                    <span className="mt-1 line-clamp-2 text-[13px] text-slate-500">{o.short}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" {...panel}>
              <h2 className="text-[26px] tracking-tight text-ink">Pick a preferred date and time</h2>
              <p className="mt-1 text-[15px] text-slate-500">For <span className="text-ink">{service}</span></p>
              <div className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
                {days.map((d) => {
                  const on = date?.toDateString() === d.toDateString();
                  return (
                    <button key={d.toISOString()} type="button" onClick={() => { setDate(d); setTime(""); }}
                      className={`flex w-[68px] shrink-0 flex-col items-center rounded-xl border py-3 transition-colors ${on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-slate-300"}`}>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${on ? "text-white/60" : "text-slate-400"}`}>{isToday(d) ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      <span className="tabular mt-1 text-[22px] leading-none">{d.getDate()}</span>
                      <span className={`mt-1 text-[11px] ${on ? "text-white/60" : "text-slate-500"}`}>{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>
              {date && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7">
                  <p className="text-[14px] text-slate-500">{fmt(date)} · {date.getDay() === 0 ? "9:30 AM – 5:00 PM" : "9:30 AM – 8:30 PM"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {slotsFor(date).map((t) => {
                      const past = slotPast(date, t);
                      return (
                        <button key={t} type="button" disabled={past} onClick={() => setTime(t)}
                          className={`tabular h-11 rounded-lg border text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${time === t ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-slate-300"}`}>{t}</button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              <div className="mt-10 flex justify-between border-t border-line pt-6">
                <button type="button" onClick={() => setStep(0)} className="btn-ghost">Back</button>
                <button type="button" disabled={!date || !time} onClick={() => setStep(2)} className="btn-dark">Continue <ArrowRight size={15} /></button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form key="s2" onSubmit={submit} noValidate {...panel}>
              <h2 className="text-[26px] tracking-tight text-ink">Your details</h2>
              <p className="tabular mt-1 text-[15px] text-slate-500"><span className="text-ink">{service}</span> · {date && fmt(date)} · {time}</p>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Full name"><input name="name" autoComplete="name" className="input" /></Field>
                <Field label="Mobile number">
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-slate-400">+91</span>
                    <input name="phone" inputMode="numeric" maxLength={14} autoComplete="tel-national" className="input tabular pl-12" />
                  </span>
                </Field>
                <Field label="Email" optional className="sm:col-span-2"><input name="email" type="email" autoComplete="email" className="input" /></Field>
                <Field label="Anything we should know?" optional className="sm:col-span-2"><textarea name="message" rows={3} className="input" /></Field>
              </div>
              <label className="mt-5 flex items-start gap-2.5 text-[12.5px] text-slate-500">
                <input type="checkbox" name="agree" value="yes" defaultChecked className="mt-[3px] h-3.5 w-3.5 accent-ink" />
                <span>I agree to be contacted by call, SMS or WhatsApp. <Link href="/privacy-policy" className="underline underline-offset-2">Privacy policy</Link></span>
              </label>
              {error && <p className="mt-4 text-[13.5px] text-red-600" role="alert">{error}</p>}
              <div className="mt-10 flex justify-between border-t border-line pt-6">
                <button type="button" onClick={() => setStep(1)} className="btn-ghost">Back</button>
                <button type="submit" disabled={state === "loading"} className="btn-primary">{state === "loading" ? <><Loader2 size={16} className="animate-spin" /> Sending</> : <>Request appointment <ArrowRight size={15} /></>}</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Image slider: every slide keeps its native aspect ratio (never cropped);
// the frame animates its height between slides of different proportions.
// ═════════════════════════════════════════════════════════════
export type Slide = { src: string; w: number; h: number; alt: string; caption: string; href?: string };

export function ImageSlider({ slides, interval = 5500 }: { slides: Slide[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const n = slides.length;
  const go = useCallback((next: number, d?: number) => {
    setDir(d ?? (next > i ? 1 : -1));
    setI(((next % n) + n) % n);
  }, [i, n]);

  useEffect(() => {
    if (paused || !inView || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(i + 1, 1), interval);
    return () => clearTimeout(t);
  }, [i, paused, inView, interval, n, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const s = slides[i];
  const img = (sl: Slide, idx: number) => (
    <Image src={sl.src} alt={sl.alt} fill priority={idx === 0} sizes="(max-width: 1240px) 100vw, 1240px" className="object-contain" draggable={false} />
  );

  return (
    <div
      ref={ref}
      className="select-none"
      role="region" aria-roledescription="carousel" aria-label="Clinic highlights"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1, 1); if (e.key === "ArrowLeft") go(i - 1, -1); }}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl bg-white ring-1 ring-line sm:rounded-2xl"
        initial={false}
        animate={{ paddingBottom: `${(s.h / s.w) * 100}%` }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            className="absolute inset-0 touch-pan-y"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            drag={n > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) go(i + 1, 1);
              else if (info.offset.x > 50 || info.velocity.x > 400) go(i - 1, -1);
            }}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}
          >
            {s.href ? <Link href={s.href} className="absolute inset-0" aria-label={s.alt} draggable={false}>{img(s, i)}</Link> : img(s, i)}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Caption + controls sit below the image so nothing overlaps or hides it */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="tabular shrink-0 font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="truncate text-[14px] text-slate-600">
              {s.caption}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-1.5 sm:flex">
            {slides.map((_, k) => (
              <button key={k} type="button" onClick={() => go(k)} aria-label={`Go to slide ${k + 1}`} aria-current={k === i} className="group grid h-6 place-items-center">
                <span className={`block h-[3px] overflow-hidden rounded-full bg-slate-200 transition-[width] duration-500 ${k === i ? "w-10" : "w-4 group-hover:bg-slate-300"}`}>
                  {k === i && (
                    <motion.span
                      key={`${i}-${paused || !inView}`}
                      className="block h-full origin-left bg-ink"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused || !inView ? 0 : 1 }}
                      transition={{ duration: paused || !inView ? 0 : interval / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(i - 1, -1)} aria-label="Previous slide" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-slate-600 transition hover:border-slate-300 hover:text-ink">
            <ArrowRight size={15} className="rotate-180" />
          </button>
          <button type="button" onClick={() => go(i + 1, 1)} aria-label="Next slide" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-slate-600 transition hover:border-slate-300 hover:text-ink">
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Process timeline: loops through steps — ring draws around the active
// number, connector fills to the next, completed steps settle to ink.
// ═════════════════════════════════════════════════════════════
export function ProcessSteps({ steps, duration = 2800 }: { steps: { t: string; d: string }[]; duration?: number }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [active, setActive] = useState(-1); // -1 = reset beat between loops
  const [hover, setHover] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const n = steps.length;

  useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  useEffect(() => {
    if (reduced || hover !== null || !inView) return;
    // last step holds a little longer, then everything resets before replaying
    const wait = active === -1 ? 500 : active === n - 1 ? duration + 1200 : duration;
    const t = setTimeout(() => setActive((a) => (a >= n - 1 ? -1 : a + 1)), wait);
    return () => clearTimeout(t);
  }, [active, hover, inView, reduced, duration, n]);

  const cur = hover ?? (reduced ? n - 1 : active);
  const running = hover === null && !reduced && inView;
  const R = 17, C = 2 * Math.PI * R;

  return (
    <ol ref={ref} className="relative mt-16 grid gap-0 lg:grid-cols-4" onMouseLeave={() => setHover(null)}>
      {steps.map((s, i) => {
        const done = i < cur;
        const on = i === cur;
        const state = done ? "done" : on ? "on" : "off";
        const lineFill = done ? 1 : on && running ? 1 : 0;
        return (
          <li
            key={s.t}
            className="group relative grid cursor-default grid-cols-[2.25rem_1fr] gap-x-5 pb-10 last:pb-0 lg:block lg:pb-0 lg:pr-10"
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            aria-current={on ? "step" : undefined}
          >
            <div className="flex flex-col items-center lg:flex-row">
              {/* Number + progress ring */}
              <span className="relative grid h-9 w-9 shrink-0 place-items-center">
                <svg viewBox="0 0 40 40" className="absolute -inset-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)] -rotate-90" aria-hidden>
                  <circle cx="20" cy="20" r={R} fill="none" stroke="var(--color-line)" strokeWidth="1.25" />
                  <motion.circle
                    cx="20" cy="20" r={R} fill="none" stroke="var(--color-ink)" strokeWidth="1.25" strokeLinecap="round"
                    strokeDasharray={C}
                    initial={false}
                    animate={{ strokeDashoffset: done || (on && !running) ? 0 : on ? [C, 0] : C }}
                    transition={on && running ? { duration: duration / 1000, ease: "linear" } : { duration: 0.4, ease: EASE }}
                  />
                </svg>
                <motion.span
                  className="relative grid h-[30px] w-[30px] place-items-center rounded-full font-mono text-[11px]"
                  initial={false}
                  animate={{
                    backgroundColor: state === "off" ? "rgba(15,26,28,0)" : "rgba(15,26,28,1)",
                    color: state === "off" ? "#9d9a91" : "#ffffff",
                    scale: on ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                {on && running && (
                  <motion.span
                    key={`ping-${active}`}
                    className="absolute inset-0 rounded-full border border-ink"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.7 }}
                    transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity, repeatDelay: 0.3 }}
                  />
                )}
              </span>

              {/* Connector: vertical on mobile, horizontal on desktop */}
              {i < n - 1 && (
                <span className="absolute bottom-1 left-[17.5px] top-11 w-px bg-line lg:relative lg:bottom-auto lg:left-auto lg:top-auto lg:ml-4 lg:h-px lg:w-auto lg:flex-1">
                  {/* fill */}
                  <motion.span
                    className="absolute inset-0 origin-top bg-ink lg:hidden"
                    initial={false}
                    animate={{ scaleY: done ? 1 : on && running ? [0, 1] : 0 }}
                    transition={on && running ? { duration: duration / 1000, ease: "easeInOut" } : { duration: 0.45, ease: EASE }}
                  />
                  <motion.span
                    className="absolute inset-0 hidden origin-left bg-ink lg:block"
                    initial={false}
                    animate={{ scaleX: done ? 1 : on && running ? [0, 1] : 0 }}
                    transition={on && running ? { duration: duration / 1000, ease: "easeInOut" } : { duration: 0.45, ease: EASE }}
                  />
                  {/* leading-edge dot */}
                  {on && running && (
                    <>
                      <motion.span
                        key={`dm-${active}`}
                        className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 shadow-[0_0_0_4px_rgb(229_109_34/0.18)] lg:hidden"
                        initial={{ top: "0%", opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: duration / 1000, ease: "easeInOut", times: [0, 0.08, 0.9, 1] }}
                      />
                      <motion.span
                        key={`dd-${active}`}
                        className="absolute top-1/2 hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 shadow-[0_0_0_4px_rgb(229_109_34/0.18)] lg:block"
                        initial={{ left: "0%", opacity: 0 }}
                        animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: duration / 1000, ease: "easeInOut", times: [0, 0.08, 0.9, 1] }}
                      />
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="pt-1.5 lg:pt-0">
              <motion.h3
                className="text-[22px] tracking-tight lg:mt-6"
                initial={false}
                animate={{ color: state === "off" ? "#9d9a91" : "#0f1a1c" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {s.t}
              </motion.h3>
              <motion.p
                className="mt-2 text-[15px] leading-relaxed"
                initial={false}
                animate={{ color: on ? "#54554f" : state === "done" ? "#6f6e67" : "#b5b2a9", y: on ? 0 : 2 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {s.d}
              </motion.p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ═════════════════════════════════════════════════════════════
// Treatments showcase: indexed list + sticky image stage.
// Hover/focus a row to preview it; auto-cycles until the visitor interacts.
// ═════════════════════════════════════════════════════════════
export type TreatmentItem = { slug: string; title: string; short: string; group: string; subServices: string[]; img: string | null };

export function TreatmentsShowcase({ items, interval = 3200 }: { items: TreatmentItem[]; interval?: number }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });
  const n = items.length;
  // The stage only exists on desktop; on smaller screens rows stay static.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!desktop || touched || hovering || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), interval);
    return () => clearTimeout(t);
  }, [active, desktop, touched, hovering, inView, interval, n]);

  const pick = (i: number) => { setActive(i); setTouched(true); };
  const cur = items[active];
  const pad2 = (k: number) => String(k).padStart(2, "0");
  const isSvg = (src: string | null) => !!src && src.endsWith(".svg");

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {/* Stage (desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-950">
            <AnimatePresence initial={false}>
              <motion.div
                key={cur.slug}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.35 } }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {cur.img ? (
                  <motion.div className="absolute inset-0" initial={{ scale: 1.18 }} animate={{ scale: 1.04 }} transition={{ duration: 6, ease: EASE }}>
                    <Image src={cur.img} alt={`${cur.title} at Apollo Dental Sahakarnagar`} fill sizes="520px" unoptimized={isSvg(cur.img)} className="object-cover saturate-[.88] contrast-[1.03]" />
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 bg-brand-900" />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/85">
              <span className="rounded-full bg-ink/40 px-2.5 py-1 backdrop-blur-md">{cur.group}</span>
              <span className="tabular rounded-full bg-ink/40 px-2.5 py-1 backdrop-blur-md">{pad2(active + 1)} / {pad2(n)}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={cur.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: EASE }}>
                  <p className="text-[28px] leading-tight tracking-tight">{cur.title}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {cur.subServices.slice(0, 4).map((x, k) => (
                      <motion.li key={x} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + k * 0.05, duration: 0.4 }}
                        className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[12px] text-white/90 backdrop-blur-md">{x}</motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 h-px w-full overflow-hidden bg-white/15">
                {!touched && !hovering && inView && (
                  <motion.span key={`p-${active}`} className="block h-full origin-left bg-accent-400" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: interval / 1000, ease: "linear" }} />
                )}
              </div>
            </div>
          </div>
          <Link href={`/services/${cur.slug}`} className="group mt-4 flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 transition hover:border-slate-300">
            <span className="min-w-0">
              <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Explore treatment</span>
              <span className="block truncate text-[15px] text-ink">{cur.title}</span>
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-accent-500"><ArrowUpRight size={16} /></span>
          </Link>
        </div>
      </div>

      {/* List */}
      <ul className="border-t border-ink" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        {items.map((s, i) => {
          const on = desktop && i === active;
          return (
            <motion.li key={s.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 0.7, delay: Math.min(i, 6) * 0.04, ease: EASE }}>
              <Link
                href={`/services/${s.slug}`}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                className="group relative grid grid-cols-[64px_1fr_auto] items-center gap-x-4 border-b border-line py-4 transition-colors duration-300 hover:border-ink sm:grid-cols-[3rem_1fr_10rem_auto] sm:py-6 lg:grid-cols-[2.75rem_1fr_9rem_auto] lg:pl-5"
              >
                <motion.span aria-hidden className="absolute -left-px bottom-0 top-0 hidden w-[2px] origin-top bg-accent-500 lg:block" initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />

                {/* mobile thumbnail */}
                <span className="relative block aspect-square w-16 overflow-hidden rounded-lg bg-brand-950 sm:hidden">
                  {s.img && <Image src={s.img} alt="" fill sizes="64px" unoptimized={isSvg(s.img)} className="object-cover" />}
                </span>

                <span className={`hidden font-mono text-[11px] transition-colors duration-300 sm:block ${on ? "text-accent-600" : "text-slate-400"}`}>{pad2(i + 1)}</span>

                <span className="min-w-0">
                  <motion.span className="block text-[18px] leading-tight tracking-tight text-ink sm:text-[24px]" initial={false} animate={{ x: on ? 8 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    {s.title}
                  </motion.span>
                  <motion.span className="mt-1 block max-w-md text-[13.5px] leading-relaxed text-slate-500 sm:mt-1.5 sm:text-[14px]" initial={false} animate={{ x: on ? 8 : 0 }} transition={{ duration: 0.5, delay: 0.03, ease: EASE }}>
                    {s.short}
                  </motion.span>
                </span>

                <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400 sm:block">{s.group}</span>

                <span className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 ${on ? "lg:border-ink lg:bg-ink lg:text-white" : ""} border-line text-slate-400 group-hover:border-ink group-hover:text-ink`}>
                  <ArrowUpRight size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                </span>

                {/* tablet: floating preview on hover */}
                <span className="pointer-events-none absolute right-16 top-1/2 hidden aspect-square w-24 -translate-y-1/2 scale-90 overflow-hidden rounded-lg opacity-0 shadow-[var(--shadow-pop)] transition duration-500 group-hover:scale-100 group-hover:opacity-100 sm:block lg:hidden">
                  {s.img && <Image src={s.img} alt="" fill sizes="96px" unoptimized={isSvg(s.img)} className="object-cover" />}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
