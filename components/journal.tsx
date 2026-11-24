"use client";

/**
 * Homepage "Journal" — 60 animations / transitions.
 *
 * Section   1 cursor spotlight · 2 watermark drift loop · 3 watermark scroll parallax · 4 eyebrow rule grow
 *           5 index tick · 6 heading line-1 mask rise · 7 heading line-2 mask rise · 8 accent ink sweep
 *           9 sub blur-in · 10 header hairline draw
 * Filters   11 tabs stagger-in · 12 sliding active pill · 13 count badge pop · 14 tab hover lift
 *           15 grid re-flow on filter · 16 card exit blur/scale · 17 card enter rise
 * Button    18 magnetic pull · 19 arrow loop nudge · 20 ink fill sweep
 * Card      21 clip-path entrance · 22 3D tilt · 23 cursor border glow · 24 "Read" cursor follower
 *           25 follower scale in/out · 26 hover lift shadow · 27 reading-progress bar (∝ minutes)
 * Content   28 cover zoom · 29 category chip slide · 30 meta fade-up · 31 title underline draw
 *           32 excerpt brighten · 33 read-time ring draw · 34 arrow rotate + fill · 35 author avatar pop
 *           36 index number roll
 * Covers    37 hue drift · 38 grain flicker
 *           orbits 39 ring rotation · 40 satellites · 41 core pulse
 *           waves  42 phase shift · 43 dash flow · 44 bubble rise
 *           dots   45 dot wave · 46 scan line · 47 cross blink
 *           rays   48 rotation · 49 breathe · 50 core glow
 * Featured  51 badge shine · 52 cover scroll parallax · 53 title word rise · 54 excerpt fade-up
 *           55 CTA magnetic · 56 "latest" ping
 * Footer    57 rule draw · 58 article count-up · 59 avg read count-up · 60 topic ticker
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion, AnimatePresence, LayoutGroup, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CountUp } from "./client";

const EASE = [0.16, 1, 0.3, 1] as const;
const MotionLink = motion.create(Link);
export type JournalPost = { slug: string; title: string; excerpt: string; category: string; date: string; mins: number; author: string };

/** Native SVG rotation about an exact centre (Framer's SVG transform-origin is unreliable for groups). */
function Spin({ cx, cy, dur, run, reverse = false, children }: { cx: number; cy: number; dur: number; run: boolean; reverse?: boolean; children: React.ReactNode }) {
  return (
    <g>
      {children}
      {run && <animateTransform attributeName="transform" type="rotate" from={`${reverse ? 360 : 0} ${cx} ${cy}`} to={`${reverse ? 0 : 360} ${cx} ${cy}`} dur={`${dur}s`} repeatCount="indefinite" />}
    </g>
  );
}

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// ─────────────────────────────────────────────────────────────
// 37–50 · generative covers
// ─────────────────────────────────────────────────────────────
function Cover({ variant, hot, run }: { variant: number; hot: boolean; run: boolean }) {
  const speed = hot ? 0.5 : 1;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 37 hue drift */}
      <motion.div className="absolute -inset-1/2"
        style={{ background: "radial-gradient(circle at 30% 30%, #175563 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(229,109,34,0.35) 0%, transparent 40%), #0a2229" }}
        animate={run ? { x: ["0%", "8%", "-4%", "0%"], y: ["0%", "-6%", "4%", "0%"] } : {}}
        transition={{ duration: 14 * speed, repeat: Infinity, ease: "easeInOut" }} />
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {variant === 0 && (
          <g>
            {[50, 80, 110].map((r, k) => (
              <motion.circle key={r} cx="270" cy="130" r={r} fill="none" stroke="#82b3bd" strokeOpacity={0.6 - k * 0.12} strokeDasharray={k === 1 ? "2 8" : undefined}
                animate={run ? { rotate: k % 2 ? -360 : 360 } : {}} transition={{ duration: (20 + k * 10) * speed, repeat: Infinity, ease: "linear" }} />
            ))}
            {[0, 1, 2].map((k) => (
              <Spin key={k} cx={270} cy={130} dur={(6 + k * 3) * speed} run={run}>
                <circle cx={270 + 50 + k * 30} cy="130" r={k === 0 ? 4 : 3} fill={k === 0 ? "#ea8540" : "#d9e9ec"} />
              </Spin>
            ))}
            <motion.circle cx="270" cy="130" r="16" fill="#f6c9a3" animate={run ? { r: [14, 19, 14], opacity: [0.9, 0.6, 0.9] } : {}} transition={{ duration: 2.6, repeat: Infinity }} />
          </g>
        )}
        {variant === 1 && (
          <g>
            {[0, 1, 2, 3, 4].map((k) => (
              <motion.path key={k} fill="none" stroke={k === 2 ? "#ea8540" : "#82b3bd"} strokeOpacity={k === 2 ? 0.9 : 0.35} strokeWidth={k === 2 ? 1.8 : 1}
                strokeDasharray={k % 2 ? "4 6" : undefined}
                animate={run ? {
                  d: [
                    `M0 ${110 + k * 18} C 100 ${80 + k * 18}, 200 ${150 + k * 18}, 400 ${100 + k * 18}`,
                    `M0 ${100 + k * 18} C 100 ${150 + k * 18}, 220 ${70 + k * 18}, 400 ${120 + k * 18}`,
                    `M0 ${110 + k * 18} C 100 ${80 + k * 18}, 200 ${150 + k * 18}, 400 ${100 + k * 18}`,
                  ],
                  strokeDashoffset: [0, -40],
                } : { d: `M0 ${110 + k * 18} C 100 ${80 + k * 18}, 200 ${150 + k * 18}, 400 ${100 + k * 18}` }}
                transition={{ duration: (6 + k) * speed, repeat: Infinity, ease: "easeInOut" }} />
            ))}
            {[60, 180, 300].map((x, k) => (
              <motion.circle key={x} cx={x} r={4 - k} fill="#fff" fillOpacity="0.6"
                animate={run ? { cy: [230, 40], opacity: [0, 1, 0] } : { cy: 140 }} transition={{ duration: (4 + k) * speed, repeat: Infinity, delay: k * 1.1, ease: "easeOut" }} />
            ))}
          </g>
        )}
        {variant === 2 && (
          <g>
            {Array.from({ length: 9 * 15 }).map((_, i) => {
              const cx = 20 + (i % 15) * 26, cy = 30 + Math.floor(i / 15) * 26;
              return (
                <motion.circle key={i} cx={cx} cy={cy} r="1.6" fill="#82b3bd"
                  animate={run ? { r: [1.2, 3, 1.2], opacity: [0.25, 0.9, 0.25] } : {}}
                  transition={{ duration: 2.4 * speed, repeat: Infinity, delay: ((i % 15) + Math.floor(i / 15)) * 0.08, ease: "easeInOut" }} />
              );
            })}
            <motion.rect x="0" width="400" height="2" fill="#ea8540" fillOpacity="0.7" animate={run ? { y: [20, 240, 20] } : { y: 130 }} transition={{ duration: 5 * speed, repeat: Infinity, ease: "easeInOut" }} />
            <motion.path d="M300 70 h16 M308 62 v16" stroke="#f6c9a3" strokeWidth="2" animate={run ? { opacity: [1, 0.1, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }} />
          </g>
        )}
        {variant === 3 && (
          <g>
            <Spin cx={290} cy={120} dur={40 * speed} run={run}>
              {Array.from({ length: 18 }).map((_, k) => (
                <motion.line key={k} x1="290" y1="120" x2={Math.round((290 + Math.cos((k / 18) * Math.PI * 2) * 140) * 100) / 100} y2={Math.round((120 + Math.sin((k / 18) * Math.PI * 2) * 140) * 100) / 100}
                  stroke={k % 6 === 0 ? "#ea8540" : "#82b3bd"} strokeOpacity={k % 6 === 0 ? 0.7 : 0.22}
                  animate={run ? { pathLength: [0.55, 1, 0.55] } : {}} transition={{ duration: 3 * speed, repeat: Infinity, delay: k * 0.12, ease: "easeInOut" }} />
              ))}
            </Spin>
            <motion.circle cx="290" cy="120" r="26" fill="#f6c9a3" fillOpacity="0.25" animate={run ? { r: [22, 34, 22] } : {}} transition={{ duration: 3.2, repeat: Infinity }} />
            <circle cx="290" cy="120" r="8" fill="#f6c9a3" />
          </g>
        )}
      </svg>
      {/* 38 grain flicker */}
      <motion.div className="grain absolute inset-0" animate={run ? { opacity: [0.7, 1, 0.8, 1] } : {}} transition={{ duration: 0.6, repeat: Infinity }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 18–20, 55 · magnetic
// ─────────────────────────────────────────────────────────────
function Magnetic({ children, s = 0.25 }: { children: React.ReactNode; s?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 14 });
  const y = useSpring(0, { stiffness: 200, damping: 14 });
  return (
    <motion.div ref={ref} style={{ x, y }} className="inline-block"
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * s); y.set((e.clientY - r.top - r.height / 2) * s); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// 21–36 · card shell + content
// ─────────────────────────────────────────────────────────────
function PostCard({ p, index, featured = false }: { p: JournalPost; index: number; featured?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { margin: "-5% 0px" });
  const reduce = useReducedMotion();
  const [hot, setHot] = useState(false);
  const variant = hash(p.category) % 4;

  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const lx = useMotionValue(0), ly = useMotionValue(0);
  const fx = useSpring(lx, { stiffness: 350, damping: 28 }), fy = useSpring(ly, { stiffness: 350, damping: 28 });
  const rX = useSpring(useTransform(my, [0, 1], [3.5, -3.5]), { stiffness: 160, damping: 18 });
  const rY = useSpring(useTransform(mx, [0, 1], [-3.5, 3.5]), { stiffness: 160, damping: 18 });
  const gpx = useTransform(mx, (v) => `${v * 100}%`), gpy = useTransform(my, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(260px circle at ${gpx} ${gpy}, rgba(229,109,34,0.75), transparent 70%)`;

  // 52 cover scroll parallax (featured)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const words = p.title.split(" ");
  const R = 9, C = 2 * Math.PI * R;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, clipPath: "inset(12% 0% 0% 0% round 16px)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 16px)" }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.35 } }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE, layout: { duration: 0.6, ease: EASE } }}
      className="[perspective:1200px]"
    >
      <MotionLink
        ref={ref}
        href={`/blog/${p.slug}`}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
          lx.set(e.clientX - r.left); ly.set(e.clientY - r.top);
        }}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => { setHot(false); mx.set(0.5); my.set(0.5); }}
        onFocus={() => setHot(true)} onBlur={() => setHot(false)}
        style={reduce ? undefined : { rotateX: rX, rotateY: rY }}
        className={`group relative flex h-full overflow-hidden rounded-2xl border border-line bg-paper transition-shadow duration-500 hover:shadow-[var(--shadow-pop)] [@media(pointer:fine)]:cursor-none ${featured ? "flex-col" : "flex-col sm:flex-row"}`}
      >
        {/* 23 border glow */}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />

        {/* Cover */}
        <div className={`relative shrink-0 overflow-hidden ${featured ? "aspect-[16/10] w-full" : "aspect-[16/10] w-full sm:aspect-auto sm:w-[44%]"}`}>
          <motion.div className="absolute inset-0" style={featured && !reduce ? { y: coverY, scale: 1.12 } : undefined}>
            {/* 28 zoom */}
            <motion.div className="absolute inset-0" animate={{ scale: hot ? 1.06 : 1 }} transition={{ duration: 1.2, ease: EASE }}>
              <Cover variant={variant} hot={hot} run={inView && !reduce} />
            </motion.div>
          </motion.div>
          {/* 29 category chip */}
          <motion.span className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.08, duration: 0.6, ease: EASE }}>
            {p.category}
          </motion.span>
          {/* 51 + 56 featured badge */}
          {featured && (
            <span className="shine absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-70" /><span className="relative h-1.5 w-1.5 rounded-full bg-accent-500" /></span>
              Latest
            </span>
          )}
          {/* 36 index roll */}
          <span className="absolute bottom-3 right-4 z-10 h-[1.1em] overflow-hidden font-mono text-[11px] text-white/60">
            <motion.span className="block" initial={{ y: "100%" }} animate={inView ? { y: 0 } : {}} transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: EASE }}>
              {String(index + 1).padStart(2, "0")}
            </motion.span>
          </span>
          {featured && (
            <span className="absolute bottom-4 left-4 right-14 z-10 font-serif text-[30px] leading-[1.05] text-white/95 sm:text-[40px]">
              {/* 53 title word rise */}
              {words.map((w, k) => (
                <span key={k} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%" }} animate={inView ? { y: 0 } : {}} transition={{ delay: 0.25 + k * 0.04, duration: 0.8, ease: EASE }}>
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
          {/* 30 meta */}
          <motion.div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400"
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.08, duration: 0.6 }}>
            <span>{p.date}</span>
            <span className="h-px w-3 bg-slate-300" />
            {/* 33 read ring */}
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 22 22" className="h-3.5 w-3.5 -rotate-90" aria-hidden>
                <circle cx="11" cy="11" r={R} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                <motion.circle cx="11" cy="11" r={R} fill="none" stroke="#e56d22" strokeWidth="2" strokeDasharray={C}
                  animate={{ strokeDashoffset: hot ? 0 : C }} transition={{ duration: hot ? p.mins * 0.35 : 0.4, ease: "linear" }} />
              </svg>
              {p.mins} min
            </span>
          </motion.div>

          {featured ? (
            <h3 className="sr-only">{p.title}</h3>
          ) : (
            <h3 className="relative mt-3 w-fit text-[19px] leading-snug tracking-tight text-ink">
              {p.title}
              {/* 31 underline */}
              <motion.span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink" animate={{ scaleX: hot ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
            </h3>
          )}

          {/* 32, 54 excerpt */}
          <motion.p className={`mt-2 flex-1 leading-relaxed transition-colors duration-500 ${hot ? "text-slate-700" : "text-slate-500"} ${featured ? "text-[16px]" : "line-clamp-2 text-[14.5px]"}`}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 + index * 0.08, duration: 0.7 }}>
            {p.excerpt}
          </motion.p>

          <div className="mt-6 flex items-center justify-between">
            {/* 35 author */}
            <span className="flex items-center gap-2.5 text-[13px] text-slate-500">
              <motion.span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-[10px] text-white"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.45 + index * 0.08 }}>
                {p.author.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </motion.span>
              <span className="truncate">{p.author}</span>
            </span>
            {/* 34 arrow */}
            {featured ? (
              <Magnetic>
                <span className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13.5px] text-white transition-colors duration-300 group-hover:bg-accent-500">
                  Read article <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Magnetic>
            ) : (
              <motion.span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border"
                animate={{ rotate: hot ? 45 : 0, backgroundColor: hot ? "#0f1a1c" : "rgba(0,0,0,0)", borderColor: hot ? "#0f1a1c" : "#e2dfd7", color: hot ? "#fff" : "#6f6e67" }}
                transition={{ duration: 0.35, ease: EASE }}>
                <ArrowUpRight size={15} />
              </motion.span>
            )}
          </div>

          {/* 27 reading-progress bar */}
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
            <motion.span className="block h-full origin-left bg-accent-500" animate={{ scaleX: hot ? 1 : 0 }} transition={{ duration: hot ? p.mins * 0.35 : 0.3, ease: hot ? "linear" : "easeOut" }} />
          </span>
        </div>

        {/* 24, 25 "Read" cursor follower */}
        <motion.span aria-hidden className="pointer-events-none absolute left-0 top-0 z-30 hidden [@media(pointer:fine)]:block" style={{ x: fx, y: fy }}>
          <motion.span className="-ml-9 -mt-9 grid h-[72px] w-[72px] place-items-center rounded-full bg-ink text-[12px] font-medium text-white shadow-[var(--shadow-pop)]"
            animate={{ scale: hot ? 1 : 0, opacity: hot ? 1 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <span className="flex items-center gap-1">Read <ArrowUpRight size={12} /></span>
          </motion.span>
        </motion.span>
      </MotionLink>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────
export function JournalSection({ posts, index = 7 }: { posts: JournalPost[]; index?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const cats = useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);
  const [cat, setCat] = useState<string>("All");
  const shown = (cat === "All" ? posts : posts.filter((p) => p.category === cat)).slice(0, 3);
  const avg = posts.length ? Math.round(posts.reduce((a, p) => a + p.mins, 0) / posts.length) : 0;

  // 1 spotlight
  const sx = useMotionValue(-999), sy = useMotionValue(-999);
  const spot = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(45,117,132,0.07), transparent 60%)`;
  // 3 watermark parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wmY = useTransform(scrollYProgress, [0, 1], ["-15%", "25%"]);

  // 5 index tick
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setIdx(index); return; }
    let k = 0;
    const id = setInterval(() => { k++; setIdx(k); if (k >= index) clearInterval(id); }, 70);
    return () => clearInterval(id);
  }, [inView, index, reduce]);

  if (!posts.length) return null;
  const [featured, ...rest] = shown;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-line bg-white"
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top); }}
      onMouseLeave={() => { sx.set(-999); sy.set(-999); }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />
      {/* 2, 3 watermark */}
      <motion.div aria-hidden className="pointer-events-none absolute -right-[5vw] top-10 select-none whitespace-nowrap font-sans text-[24vw] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(15_26_28/0.06)]"
        style={{ y: wmY }} animate={reduce ? {} : { x: ["0%", "-6%", "0%"] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}>
        Journal
      </motion.div>

      <div className="container-x relative py-24 sm:py-32">
        {/* Header */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
              <motion.span className="h-px w-5 origin-left bg-current opacity-60" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, ease: EASE }} />
              <span className="tabular text-ink">{String(idx).padStart(2, "0")}</span>Journal
            </p>
            <h2 className="mt-5 text-[34px] font-normal leading-[1.04] tracking-[-0.035em] text-ink sm:text-[48px]" aria-label="Notes from our dentists.">
              {["Notes from", "our dentists."].map((l, k) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]" aria-hidden>
                  <motion.span className={`block ${k ? "ink-sweep" : ""}`} initial={{ y: "105%" }} animate={inView ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.1 + k * 0.1, ease: EASE }}>{l}</motion.span>
                </span>
              ))}
            </h2>
            <motion.p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-500"
              initial={{ opacity: 0, filter: "blur(8px)" }} animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}} transition={{ duration: 1, delay: 0.35 }}>
              Plain-language guides on treatments, costs and everyday care, written by the specialists who treat you.
            </motion.p>
          </div>

        </div>

        {/* 10 hairline */}
        <motion.div aria-hidden className="mt-12 h-px origin-left bg-gradient-to-r from-ink via-line to-transparent" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* 11–14 filters */}
            <LayoutGroup id="journal-tabs">
              <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0"><div className="flex w-max gap-1 rounded-full border border-line bg-paper p-1" role="tablist" aria-label="Filter articles by topic">
                {["All", ...cats].map((c, k) => {
                  const on = c === cat;
                  const n = c === "All" ? posts.length : posts.filter((p) => p.category === c).length;
                  return (
                    <motion.button key={c} role="tab" aria-selected={on} type="button" onClick={() => setCat(c)}
                      initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + k * 0.05, duration: 0.5, ease: EASE }}
                      whileHover={{ y: -1 }}
                      className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${on ? "text-white" : "text-slate-600 hover:text-ink"}`}>
                      {on && <motion.span layoutId="journal-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                      <span className="relative">{c}</span>
                      <motion.span key={`${c}-${on}`} className={`tabular relative font-mono text-[10px] ${on ? "text-white/60" : "text-slate-400"}`} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                        {n}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div></div>
            </LayoutGroup>
            {/* 18–20 all articles */}
            <Magnetic>
              <Link href="/blog" className="group btn-ghost relative overflow-hidden hover:border-ink hover:bg-transparent">
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                <span className="relative transition-colors duration-300 group-hover:text-white">All articles</span>
                <motion.span className="relative transition-colors duration-300 group-hover:text-white" animate={reduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
            </Magnetic>
          </div>

        {/* 15–17 grid */}
        <motion.div layout className="mt-10 grid gap-5 lg:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {featured && (
              <motion.div key={featured.slug} layout className="lg:col-span-7">
                <PostCard p={featured} index={0} featured />
              </motion.div>
            )}
            {rest.length > 0 && (
              <motion.div key={`side-${cat}`} layout className="flex flex-col gap-5 lg:col-span-5">
                {rest.map((p, i) => <PostCard key={p.slug} p={p} index={i + 1} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer strip 57–60 */}
        <div className="mt-14">
          <motion.div aria-hidden className="h-px origin-left bg-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <dl className="flex gap-10 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
              <div><dt>Articles</dt><dd className="mt-1 text-[22px] tracking-normal text-ink"><CountUp to={posts.length} /></dd></div>
              <div><dt>Avg. read</dt><dd className="mt-1 text-[22px] tracking-normal text-ink"><CountUp to={avg} /> <span className="text-[13px] text-slate-400">min</span></dd></div>
            </dl>
            <div className="relative overflow-hidden md:max-w-[60%] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <motion.div className="flex w-max gap-8 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400"
                animate={reduce ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
                {[...cats, ...cats, ...cats, ...cats].map((c, k) => (
                  <span key={k} className="flex items-center gap-8"><span>{c}</span><span className="h-1 w-1 rounded-full bg-accent-500" /></span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
