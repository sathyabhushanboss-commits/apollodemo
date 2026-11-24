"use client";

/**
 * Homepage hero — 59 animations / transitions.
 *
 * Backdrop   1 dot-grid fade-in · 2 dot-grid mouse parallax · 3 cursor spotlight · 4 tooth line-art draw
 *            5 tooth counter-parallax · 6 orbit ring rotation · 7 orbit satellite · 8 light-beam sweep
 *            9 scroll parallax (copy column) · 10 scroll fade of backdrop
 * Eyebrow    11 rule grow · 12 live ping · 13 letter-by-letter reveal
 * Headline   14 line-1 mask rise · 15 line-2 mask rise · 16 per-character blur→sharp stagger · 17 per-letter hover lift
 *            18 rotating phrase enter · 19 rotating phrase blur-exit · 20 hand-drawn underline redraw
 * Paragraph  21 blur-in · 22 marker sweep "Eleven specialists" · 23 marker sweep "The Apollo Hospitals Group"
 * CTAs       24 staggered rise · 25 primary magnetic pull · 26 primary shine loop · 27 arrow nudge
 *            28 phone ring wiggle · 29 secondary magnetic pull · 30 secondary ink-fill sweep
 * Trust      31 avatar pop stagger · 32 avatar hover raise · 33 avatar name tooltip · 34 "+7" count-up
 *            35 award slide-in · 36 award shine · 37 award star spin
 * Card       38 entrance rise/blur · 39 3D tilt · 40 cursor spotlight · 41 rotating conic border · 42 header reveal
 *            43 hairline draw · 44 live IST clock (blinking colon) · 45 fields cascade-in · 46 focus pulse ring
 *            47 submit shine · 48 open-status ping
 * Chips      49 spring pop-in · 50 float bob · 51 mouse depth parallax
 * Facts      52 top rule draw · 53 cell stagger rise · 54 count-up · 55 "EMI" scramble · 56 icon stroke draw
 *            57 hover tint sweep · 58 hover bottom bar fill
 * Scroll     59 scroll-cue line loop
 */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, useReducedMotion, useInView,
} from "framer-motion";
import { ArrowRight, Phone, Star, Check } from "lucide-react";
import { CLINIC } from "@/lib/site";
import { LeadForm, OpenStatus, CountUp } from "./client";

const EASE = [0.16, 1, 0.3, 1] as const;
const PHRASES = ["close to home.", "open 7 days.", "on easy EMI."];
const TOOTH = "M7.2 3C4.9 3 3 4.9 3 7.4c0 2.4 1.1 3.8 1.7 6.3.6 2.7.9 7.3 2.7 7.3 1.7 0 1.7-4.7 3.1-4.7h3c1.4 0 1.4 4.7 3.1 4.7 1.8 0 2.1-4.6 2.7-7.3.6-2.5 1.7-3.9 1.7-6.3C21 4.9 19.1 3 16.8 3c-2 0-3 1.1-4.8 1.1S9.2 3 7.2 3Z";

export type HeroAvatar = { src: string; name: string };

// ── 14–17 · split a line into hoverable, blur-in characters ──
function Chars({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  let n = 0;
  return (
    <span className={`block overflow-hidden pb-[0.1em] ${className}`} aria-hidden>
      <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease: EASE }}>
        {text.split(" ").map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {word.split("").map((ch) => {
              const k = n++;
              return (
                <motion.span
                  key={k}
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: delay + 0.08 + k * 0.025, ease: EASE }}
                  whileHover={{ y: "-0.08em", transition: { type: "spring", stiffness: 400, damping: 12 } }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {w < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// ── 25, 29 · magnetic wrapper ──
function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 14 });
  const y = useSpring(0, { stiffness: 200, damping: 14 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

// ── 22, 23 · marker highlight ──
function Marker({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      className="bg-no-repeat text-ink [background-image:linear-gradient(rgb(229_109_34/0.18),rgb(229_109_34/0.18))] [background-position:0_88%]"
      initial={{ backgroundSize: "0% 38%" }}
      animate={{ backgroundSize: "100% 38%" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

// ── 44 · live IST clock ──
function IstClock() {
  const [t, setT] = useState<{ hm: string; ap: string } | null>(null);
  useEffect(() => {
    const f = () => {
      const p = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(new Date());
      const g = (k: string) => p.find((x) => x.type === k)?.value ?? "";
      setT({ hm: `${g("hour")}|${g("minute")}`, ap: g("dayPeriod").toUpperCase() });
    };
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  if (!t) return <span className="tabular">--:--</span>;
  const [h, m] = t.hm.split("|");
  return (
    <span className="tabular">
      {h}<span className="animate-[blink_1s_steps(1)_infinite]">:</span>{m} {t.ap} <span className="text-slate-400">IST</span>
    </span>
  );
}

// ── 55 · scramble text once in view ──
function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!inView) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let f = 0;
    const id = setInterval(() => {
      f++;
      setOut(text.split("").map((c, i) => (f > 6 + i * 3 ? c : chars[Math.floor(Math.random() * chars.length)])).join(""));
      if (f > 6 + text.length * 3) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [inView, text]);
  return <span ref={ref}>{out}</span>;
}

// ── 56 · facts icons ──
const ICONS: Record<string, string[]> = {
  team: ["M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6", "M16 11a3 3 0 1 0 0-6", "M18 14c2.4.6 4 2.8 4 6"],
  grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
  cal: ["M4 6h16v14H4z", "M4 10h16", "M8 3v5", "M16 3v5", "M8 14h3v3H8z"],
  emi: ["M4 7h16v12H4z", "M4 11h16", "M8 15h4", "M16 4v3", "M8 4v3"],
};
function DrawIcon({ name, delay }: { name: string; delay: number }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name].map((d, i) => (
        <motion.path key={i} d={d} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: delay + i * 0.12, ease: EASE }} />
      ))}
    </svg>
  );
}

const FACTS = [
  { k: 11, v: "Specialist dentists", d: "MDS across every discipline", icon: "team" },
  { k: 13, v: "Treatments", d: "Under one roof", icon: "grid" },
  { k: 7, v: "Days a week", d: "Including Sunday mornings", icon: "cal" },
  { k: "EMI", v: "On treatment", d: "Spread the cost. T&C apply", icon: "emi" },
] as const;

export function Hero({ avatars }: { avatars: HeroAvatar[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [phrase, setPhrase] = useState(0);

  // mouse (normalised -0.5..0.5) for parallax + pixel coords for spotlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useMotionValue(-999);
  const py = useMotionValue(-999);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const gridX = useTransform(smx, (v) => v * 18);
  const gridY = useTransform(smy, (v) => v * 18);
  const toothX = useTransform(smx, (v) => v * -36);
  const toothY = useTransform(smy, (v) => v * -36);
  const c1x = useTransform(smx, (v) => v * 28);
  const c1y = useTransform(smy, (v) => v * 28);
  const c2x = useTransform(smx, (v) => v * -22);
  const c2y = useTransform(smy, (v) => v * -22);
  const c3x = useTransform(smx, (v) => v * 40);
  const c3y = useTransform(smy, (v) => v * 40);
  const spot = useMotionTemplate`radial-gradient(520px circle at ${px}px ${py}px, rgba(229,109,34,0.07), transparent 60%)`;

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // card tilt + spotlight
  const cardRef = useRef<HTMLDivElement>(null);
  const cx = useMotionValue(0.5);
  const cy = useMotionValue(0.5);
  const rX = useSpring(useTransform(cy, [0, 1], [4, -4]), { stiffness: 150, damping: 20 });
  const rY = useSpring(useTransform(cx, [0, 1], [-4, 4]), { stiffness: 150, damping: 20 });
  const cpx = useTransform(cx, (v) => `${v * 100}%`);
  const cpy = useTransform(cy, (v) => `${v * 100}%`);
  const cardSpot = useMotionTemplate`radial-gradient(360px circle at ${cpx} ${cpy}, rgba(45,117,132,0.07), transparent 65%)`;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPhrase((p) => (p + 1) % PHRASES.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const eyebrow = "Apollo Dental · Sahakarnagar, Bengaluru";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        px.set(e.clientX - r.left);
        py.set(e.clientY - r.top);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); px.set(-999); py.set(-999); }}
    >
      {/* ───────── Backdrop (1–8, 10) ───────── */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: bgOpacity }}>
        {/* 1, 2 dot grid */}
        <motion.div
          className="absolute -inset-10 [background-image:radial-gradient(rgb(15_26_28/0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]"
          style={{ x: gridX, y: gridY }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}
        />
        {/* 3 cursor spotlight */}
        <motion.div className="absolute inset-0" style={{ background: spot }} />
        {/* 4–7 tooth + orbit */}
        <motion.svg viewBox="0 0 400 400" className="absolute -right-24 top-6 hidden h-[640px] w-[640px] text-brand-700 lg:block" style={{ x: toothX, y: toothY }}>
          <motion.circle cx="200" cy="200" r="182" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 9"
            animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} />
          <g>
            <circle cx="200" cy="18" r="4" fill="#e56d22" fillOpacity="0.55" />
            {!reduce && <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="22s" repeatCount="indefinite" />}
          </g>
          <motion.path d={TOOTH} transform="translate(80 70) scale(10)" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth={0.12}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.2, delay: 0.4, ease: EASE }} />
        </motion.svg>
        {/* 8 light beam */}
        {!reduce && (
          <motion.div className="absolute -top-1/2 h-[200%] w-40 rotate-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent"
            initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 9, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }} />
        )}
      </motion.div>

      <div className="container-x relative grid gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        {/* ───────── Copy column (9) ───────── */}
        <motion.div className="lg:col-span-7 lg:pr-6" style={reduce ? undefined : { y: copyY }}>
          {/* 11–13 eyebrow */}
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            <motion.span className="h-px w-6 origin-left bg-slate-400" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: EASE }} />
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
            </span>
            <span aria-label={eyebrow}>
              {eyebrow.split("").map((c, i) => (
                <motion.span key={i} aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.018, duration: 0.2 }}>{c}</motion.span>
              ))}
            </span>
          </p>

          {/* 14–20 headline */}
          <h1 className="mt-7 text-[46px] font-normal leading-[0.98] tracking-[-0.045em] text-ink sm:text-[76px] lg:text-[88px]" aria-label={`Specialist dentistry, ${PHRASES[0]}`}>
            <Chars text="Specialist" delay={0.1} />
            <Chars text="dentistry," delay={0.2} />
            {/* fixed-height slot: phrases stack absolutely, so nothing below ever shifts */}
            <span className="relative block h-[1.2em] overflow-hidden" aria-hidden>
              <AnimatePresence initial={false}>
                <motion.span
                  key={phrase}
                  className="absolute left-0 top-0 inline-block whitespace-nowrap text-slate-400"
                  initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-60%", opacity: 0, filter: "blur(8px)", transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] } }}
                  transition={{ duration: 0.8, ease: EASE, delay: phrase === 0 ? 0.35 : 0.18 }}
                >
                  {PHRASES[phrase]}
                  <svg viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute left-0 top-[1.02em] h-[0.12em] w-[92%] overflow-visible text-accent-500" aria-hidden>
                    <motion.path d="M2 9 C 60 3, 130 2, 190 6 S 270 12, 298 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: phrase === 0 ? 0.9 : 0.4, ease: EASE }} />
                  </svg>
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          {/* 21–23 paragraph */}
          <motion.p className="mt-8 max-w-[34rem] text-[18px] leading-relaxed text-slate-600"
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
            <Marker delay={1.2}>Eleven specialists</Marker> for implants, braces and aligners, root canals, gum care and children&apos;s dentistry. Part of{" "}
            <Marker delay={1.5}>The Apollo Hospitals Group</Marker>, on 60th Main Road next to Big Market.
          </motion.p>

          {/* 24–30 CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: EASE }}>
              <Magnetic>
                <Link href="/book-appointment" className="shine group btn-primary h-12 px-6 text-[15px]">
                  Book appointment <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8, ease: EASE }}>
              <Magnetic>
                <a href={`tel:${CLINIC.phones[0].tel}`} className="group btn-ghost tabular relative h-12 overflow-hidden px-6 text-[15px] hover:border-ink hover:bg-transparent">
                  <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                  <motion.span className="relative z-10 transition-colors duration-300 group-hover:text-white"
                    animate={reduce ? {} : { rotate: [0, -14, 14, -10, 10, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 3.2 }}>
                    <Phone size={15} strokeWidth={1.75} />
                  </motion.span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{CLINIC.phones[0].display}</span>
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* 31–37 trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {avatars.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {avatars.slice(0, 4).map((a, i) => (
                    <motion.div key={a.src} className="group/av relative"
                      initial={{ opacity: 0, scale: 0.4, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 1 + i * 0.08 }}
                      whileHover={{ y: -5, zIndex: 10 }}>
                      <span className="relative block h-10 w-10 overflow-hidden rounded-full border-2 border-paper bg-slate-100">
                        <Image src={a.src} alt={a.name} fill sizes="40px" className="object-cover object-top" />
                      </span>
                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white opacity-0 transition duration-200 group-hover/av:translate-y-0 group-hover/av:opacity-100">
                        {a.name}
                      </span>
                    </motion.div>
                  ))}
                  <motion.span className="tabular relative grid h-10 w-10 place-items-center whitespace-nowrap rounded-full border-2 border-paper bg-ink text-[12px] text-white"
                    initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: 1.35 }}>
                    <span>+<CountUp to={Math.max(0, 11 - Math.min(4, avatars.length))} /></span>
                  </motion.span>
                </div>
                <span className="text-[13.5px] leading-tight text-slate-500"><span className="block text-ink">MDS specialists</span>every discipline</span>
              </div>
            )}
            <motion.div className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line bg-white px-3.5 py-2 text-[13px] text-ink"
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.25, ease: EASE }}>
              <motion.span className="text-accent-500" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Star size={14} fill="currentColor" strokeWidth={0} />
              </motion.span>
              No. 1 in Dental Care <span className="text-slate-400">· Times Survey 2025</span>
            </motion.div>
          </div>
        </motion.div>

        {/* ───────── Card column (38–51) ───────── */}
        <motion.div className="relative lg:col-span-5"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.2, delay: 0.35, ease: EASE }}>
          <div className="[perspective:1400px]">
            <motion.div
              ref={cardRef}
              className="relative rounded-2xl p-px"
              style={reduce ? undefined : { rotateX: rX, rotateY: rY }}
              onMouseMove={(e) => {
                const r = cardRef.current!.getBoundingClientRect();
                cx.set((e.clientX - r.left) / r.width);
                cy.set((e.clientY - r.top) / r.height);
              }}
              onMouseLeave={() => { cx.set(0.5); cy.set(0.5); }}
            >
              {/* 41 rotating conic border */}
              <span aria-hidden className="conic-border absolute inset-0 rounded-2xl" />
              <span aria-hidden className="absolute inset-0 rounded-2xl border border-line" />
              <div className="hero-form relative overflow-hidden rounded-[15px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
                {/* 40 card spotlight */}
                <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: cardSpot }} />
                {/* 42 header */}
                <div className="relative flex items-start justify-between gap-4">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }}>
                    <h2 className="text-[22px] leading-tight tracking-tight text-ink">Request a callback</h2>
                    <p className="mt-1 text-[14px] text-slate-500">Our front desk will call to confirm a time.</p>
                  </motion.div>
                  {/* 44 clock */}
                  <motion.div className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-slate-600"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
                    <IstClock />
                  </motion.div>
                </div>
                {/* 43 hairline */}
                <motion.div aria-hidden className="relative mt-5 h-px origin-left bg-gradient-to-r from-accent-500/70 via-line to-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: EASE }} />
                {/* 45–47 form (CSS cascade, focus pulse, submit shine) */}
                <div className="relative mt-6">
                  <LeadForm source="home-hero" variant="compact" submitLabel="Request callback" />
                </div>
                {/* 48 status */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <OpenStatus className="relative mt-5 text-[13px] text-slate-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 49–51 floating chips (desktop) */}
          {[
            { x: c1x, y: c1y, cls: "-bottom-6 left-6", delay: 1.3, bob: 0, body: <><span className="grid h-7 w-7 place-items-center rounded-full bg-accent-50 text-accent-600"><Check size={14} /></span><span><span className="block text-ink">Apollo protocols</span><span className="text-slate-500">Sterile &amp; safe</span></span></> },
            { x: c2x, y: c2y, cls: "-right-6 -top-6", delay: 1.45, bob: 1.2, body: <><span className="font-mono text-[11px] text-slate-400">EMI</span><span className="text-ink">Easy instalments*</span></> },
            { x: c3x, y: c3y, cls: "-bottom-6 right-8", delay: 1.6, bob: 2.1, body: <><span className="text-ink">7 days</span><span className="text-slate-500">incl. Sunday</span></> },
          ].map((c, i) => (
            <motion.div key={i} aria-hidden className={`pointer-events-none absolute z-10 hidden xl:block ${c.cls}`} style={{ x: c.x, y: c.y }}>
              <motion.div
                className="flex items-center gap-2.5 rounded-xl border border-line bg-white/90 px-3.5 py-2.5 text-[12.5px] leading-tight shadow-[var(--shadow-pop)] backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: [0, -7, 0] }}
                transition={{
                  opacity: { delay: c.delay, duration: 0.4 },
                  scale: { delay: c.delay, type: "spring", stiffness: 260, damping: 16 },
                  y: { delay: c.delay + c.bob, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {c.body}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* 59 scroll cue */}
        <div aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-line">
            {!reduce && <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ink" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />}
          </span>
        </div>
      </div>

      {/* ───────── Facts (52–58) ───────── */}
      <div className="relative">
        <motion.div aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <motion.div key={f.v}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              className={`group relative flex flex-col-reverse overflow-hidden py-8 sm:py-10 ${i % 2 ? "border-l border-line pl-5 sm:pl-8" : "pr-5 sm:pr-8"} ${i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
              {/* 57 tint sweep */}
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
              {/* 58 bottom bar */}
              <span aria-hidden className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent-500 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
              <dt className="relative">
                <span className="mt-3 block text-[15px] text-ink">{f.v}</span>
                <span className="block text-[13.5px] text-slate-500">{f.d}</span>
              </dt>
              <dd className="relative flex items-end justify-between gap-3">
                <span className="tabular block text-[44px] font-light leading-none tracking-[-0.04em] text-ink sm:text-[56px]">
                  {typeof f.k === "number" ? <CountUp to={f.k} /> : <ScrambleText text={f.k} />}
                </span>
                <span className="mb-1 text-slate-300 transition-colors duration-500 group-hover:text-accent-500"><DrawIcon name={f.icon} delay={0.2 + i * 0.1} /></span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
