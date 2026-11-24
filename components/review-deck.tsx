"use client";

/**
 * Mobile review deck — 45 animations / transitions.
 *
 * Deck       1 top card spring-forward · 2 direction-aware fly-out · 3 fly-out blur · 4 second card peek
 *            5 third card peek · 6 idle deck sway · 7 drag follow · 8 drag-linked rotation · 9 drag-linked fade
 *            10 elastic snap-back · 11 directional edge glow while dragging · 12 shadow deepen while dragging
 *            13 press-down scale · 14 new back card rises in · 15 previous card flies back in (swipe right)
 * Content    16 stars stagger pop · 17 star shimmer loop · 18 Google mark spin-in · 19 label fade
 *            20 quote mark scale-in · 21 word-by-word blur-in · 22 marker sweep on doctor names
 *            23 divider draw · 24 avatar spring pop · 25 avatar ring pulse · 26 name slide-up · 27 tag slide-in
 *            28 verified tick draw · 29 card spotlight drift · 30 corner glow pulse · 31 floating particles
 *            32 back-card content dimming
 * Controls   33 dot width morph · 34 active dot timer fill · 35 dot tap ripple · 36 arrows fade in
 *            37 arrow nudge on tap · 38 pause indicator · 39 swipe hint motion · 40 swipe hint dismiss
 * Section    41 deck entrance rise/blur · 42 stack stagger-in · 43 top-edge timer line · 44 arrival bounce
 *            45 background halo pulse
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useInView, useMotionValue, useTransform, useReducedMotion, type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Pause } from "lucide-react";
import type { Review } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 3500;

const GoogleG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2Z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2s.1-1.4.4-2V7H2a11 11 0 0 0 0 10l3.7-3Z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7l3.7 2.9C6.6 7.4 9.1 5.4 12 5.4Z" />
  </svg>
);

// ── 21, 22 · words with doctor-name highlighting ──
function Words({ text, show }: { text: string; show: boolean }) {
  const words = text.split(" ");
  const hi = new Set<number>();
  words.forEach((w, k) => { if (/^Dr\.?$/i.test(w) || /^Dr\.?[A-Z]/.test(w)) { hi.add(k); if (/^Dr\.?$/i.test(w)) hi.add(k + 1); } });
  return (
    <>
      {words.map((w, k) => (
        <motion.span
          key={k}
          className={`inline-block ${hi.has(k) ? "bg-no-repeat text-ink [background-image:linear-gradient(rgb(229_109_34/0.2),rgb(229_109_34/0.2))] [background-position:0_88%]" : ""}`}
          initial={false}
          animate={show
            ? { opacity: 1, filter: "blur(0px)", y: 0, ...(hi.has(k) ? { backgroundSize: "100% 40%" } : {}) }
            : { opacity: 0.35, filter: "blur(0px)", y: 0, ...(hi.has(k) ? { backgroundSize: "0% 40%" } : {}) }}
          transition={show ? { delay: 0.12 + k * 0.012, duration: 0.4, ease: EASE, backgroundSize: { delay: 0.45 + k * 0.012, duration: 0.5 } } : { duration: 0.2 }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </>
  );
}

// ── one card in the deck ──
function DeckCard({ r, k, dir, onSwipe, reduce }: { r: Review; k: number; dir: number; onSwipe: (d: number) => void; reduce: boolean }) {
  const isTop = k === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);                 // 8
  const fade = useTransform(x, [-260, -140, 0, 140, 260], [0.4, 1, 1, 1, 0.4]); // 9
  const leftGlow = useTransform(x, [-140, 0], [1, 0]);                           // 11
  const rightGlow = useTransform(x, [0, 140], [0, 1]);
  const shadow = useTransform(x, [-160, 0, 160], [                                // 12
    "0 30px 60px -20px rgba(15,26,28,0.35)", "0 18px 40px -22px rgba(15,26,28,0.22)", "0 30px 60px -20px rgba(15,26,28,0.35)",
  ]);

  // 1, 4, 5 · stack positions
  const pose = [
    { scale: 1, y: 0, rotate: 0, opacity: 1 },
    { scale: 0.94, y: 16, rotate: -2.2, opacity: 1 },
    { scale: 0.88, y: 30, rotate: 2.6, opacity: 0.6 },
  ][k];

  const variants: Variants = {
    // 14, 15 · entering
    enter: (d: number) => (k === 0 && d < 0
      ? { x: -380, rotate: -16, opacity: 0, scale: 1, y: 0, filter: "blur(6px)" }
      : { scale: 0.8, y: 60, opacity: 0, rotate: 0, filter: "blur(0px)" }),
    // 2, 3 · leaving
    exit: (d: number) => (k === 0
      ? {
          x: d > 0 ? [0, 14, -440] : [0, -14, 440],
          y: [0, -6, 10],
          rotate: d > 0 ? [0, 3, -20] : [0, -3, 20],
          scale: [1, 1.02, 0.96],
          opacity: [1, 1, 0],
          filter: ["blur(0px)", "blur(0px)", "blur(6px)"],
          transition: { duration: 0.75, times: [0, 0.22, 1], ease: [0.45, 0, 0.2, 1] },
        }
      : { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.35 } }),
  };

  return (
    <motion.div
      custom={dir}
      variants={variants}
      initial="enter"
      animate={{ ...pose, x: 0, filter: "blur(0px)" }} // object target (not a label) so a new stack position re-animates
      exit="exit"
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9, delay: k * 0.06 }} // 42 stack stagger
      style={{ zIndex: 10 - k }}
      className="absolute inset-0 origin-bottom"
      aria-hidden={!isTop}
    >
    {/* inner layer owns the drag (so drag values never fight the deck variants) */}
    <motion.div
      style={isTop ? { x, rotate, opacity: fade, boxShadow: shadow } : undefined}
      drag={isTop ? "x" : false}
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0 }}                                     // 10 snap-back
      dragTransition={{ bounceStiffness: 400, bounceDamping: 24 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -70 || info.velocity.x < -500) onSwipe(1);
        else if (info.offset.x > 70 || info.velocity.x > 500) onSwipe(-1);
      }}
      whileTap={isTop ? { scale: 0.985 } : undefined}                               // 13
      className={`h-full rounded-2xl touch-pan-y ${isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
    >
      <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6">
        {/* 29 spotlight drift */}
        {isTop && !reduce && (
          <motion.span aria-hidden className="pointer-events-none absolute -inset-1/2 [background:radial-gradient(circle_at_center,rgba(45,117,132,0.08),transparent_40%)]"
            animate={{ x: ["-10%", "15%", "-5%"], y: ["-8%", "10%", "-8%"] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        )}
        {/* 30 corner glow */}
        {isTop && !reduce && (
          <motion.span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent-500/15 blur-2xl"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3.6, repeat: Infinity }} />
        )}
        {/* arrival light sweep */}
        {isTop && !reduce && (
          <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            initial={{ left: "-60%" }} animate={{ left: "130%" }} transition={{ duration: 0.9, delay: 0.25, ease: [0.45, 0, 0.2, 1] }} />
        )}
        {/* 31 particles */}
        {isTop && !reduce && [0, 1, 2].map((p) => (
          <motion.span key={p} aria-hidden className="pointer-events-none absolute h-1 w-1 rounded-full bg-accent-400/60" style={{ left: `${70 + p * 9}%`, bottom: 70 }}
            animate={{ y: [0, -90], opacity: [0, 1, 0] }} transition={{ duration: 3 + p, repeat: Infinity, delay: p * 0.9, ease: "easeOut" }} />
        ))}
        {/* 11 directional edge glow */}
        {isTop && (
          <>
            <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-accent-500/25 to-transparent" style={{ opacity: leftGlow }} />
            <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-500/25 to-transparent" style={{ opacity: rightGlow }} />
          </>
        )}

        <div className="relative flex items-center justify-between">
          {/* 16, 17 stars */}
          <span className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, s) => (
              <motion.svg key={s} width="15" height="15" viewBox="0 0 24 24" className="text-accent-500" aria-hidden
                initial={false}
                animate={isTop ? { scale: [0, 1.3, 1], rotate: [-40, 10, 0], opacity: 1 } : { scale: 1, rotate: 0, opacity: 0.5 }}
                transition={isTop ? { delay: 0.1 + s * 0.06, duration: 0.5, ease: EASE } : { duration: 0.2 }}>
                <motion.path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8Z" fill="currentColor"
                  animate={isTop && !reduce ? { opacity: [1, 0.55, 1] } : { opacity: 1 }} transition={{ duration: 2.4, repeat: Infinity, delay: 1 + s * 0.15 }} />
              </motion.svg>
            ))}
          </span>
          {/* 18, 19 Google */}
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
            <motion.span initial={false} animate={isTop ? { rotate: [-180, 0], scale: [0.4, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}><GoogleG /></motion.span>
            <motion.span initial={false} animate={{ opacity: isTop ? 1 : 0.4 }} transition={{ delay: 0.3 }}>Google</motion.span>
          </span>
        </div>

        {/* 20 quote mark */}
        <motion.span aria-hidden className="relative mt-3 block h-6 font-serif text-[44px] leading-none text-slate-200"
          initial={false} animate={isTop ? { scale: [0.3, 1], opacity: [0, 1] } : { scale: 1, opacity: 0.5 }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
          &ldquo;
        </motion.span>
        {/* 21, 22, 32 text */}
        <blockquote className="relative mt-1 line-clamp-6 flex-1 text-[15.5px] leading-relaxed text-slate-700">
          <Words text={r.text} show={isTop} />
        </blockquote>

        {/* 23 divider */}
        <motion.span aria-hidden className="relative mt-4 block h-px origin-left bg-line" initial={false} animate={{ scaleX: isTop ? [0, 1] : 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} />

        <figcaption className="relative mt-4 flex items-center gap-3">
          {/* 24, 25 avatar */}
          <span className="relative">
            <motion.span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-ink font-mono text-[12px] text-white"
              initial={false} animate={isTop ? { scale: [0, 1] } : { scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 11, delay: 0.35 }}>
              {r.name[0]}
            </motion.span>
            {isTop && !reduce && (
              <motion.span aria-hidden className="absolute inset-0 rounded-full border border-accent-500" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }} />
            )}
          </span>
          <span className="min-w-0 flex-1">
            {/* 26, 28 name + verified tick */}
            <motion.span className="flex items-center gap-1.5 text-[14.5px] text-ink" initial={false} animate={isTop ? { y: [10, 0], opacity: [0, 1] } : { y: 0, opacity: 0.6 }} transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}>
              <span className="truncate">{r.name}</span>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-label="Google review">
                <circle cx="8" cy="8" r="7" fill="#e56d22" fillOpacity="0.15" />
                <motion.path d="M4.8 8.3 7 10.4l4.2-4.6" fill="none" stroke="#e56d22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  initial={false} animate={{ pathLength: isTop ? [0, 1] : 1 }} transition={{ duration: 0.5, delay: 0.7 }} />
              </svg>
            </motion.span>
            {/* 27 tag */}
            <motion.span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11.5px] text-slate-600" initial={false}
              animate={isTop ? { x: [-12, 0], opacity: [0, 1] } : { x: 0, opacity: 0.6 }} transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}>
              {r.tag}
            </motion.span>
          </span>
        </figcaption>
      </figure>
    </motion.div>
    </motion.div>
  );
}

export function ReviewDeck({ items }: { items: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = !!useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hint, setHint] = useState(true);
  const [bump, setBump] = useState(0);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = items.length;

  const go = useCallback((d: number) => {
    setDir(d);
    setI((v) => (v + d + n) % n);
    setBump((b) => b + 1);
  }, [n]);
  const interact = () => {
    setHint(false);
    setPaused(true);
    if (resume.current) clearTimeout(resume.current);
    resume.current = setTimeout(() => setPaused(false), 3000);
  };

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(t);
  }, [i, inView, paused, reduce, go]);

  const stack = [0, 1, 2].map((k) => ({ k, idx: (i + k) % n }));
  const running = inView && !paused && !reduce;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} // 41
      onTouchStart={interact}>
      <div className="relative">
        {/* 45 halo */}
        {!reduce && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-x-6 -bottom-4 top-10 rounded-[40px] bg-brand-500/10 blur-2xl"
            animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 4, repeat: Infinity }} />
        )}

        {/* 43 top-edge timer */}
        <div className="relative z-20 mx-6 mb-3 h-[2px] overflow-hidden rounded-full bg-slate-200/70">
          {running && <motion.span key={`t-${i}`} className="block h-full origin-left bg-accent-500" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DURATION / 1000, ease: "linear" }} />}
        </div>

        {/* deck — 44 arrival bounce */}
        <motion.div className="relative h-[360px]" animate={bump ? { scale: [0.985 - (bump % 2) * 0.0001, 1] } : { scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
          <AnimatePresence custom={dir}>
            {stack.slice().reverse().map(({ k, idx }) => (
              <DeckCard key={idx} r={items[idx]} k={k} dir={dir} reduce={reduce} onSwipe={(d) => { interact(); go(d); }} />
            ))}
          </AnimatePresence>

          {/* 39, 40 swipe hint */}
          <AnimatePresence>
            {hint && (
              <motion.div aria-hidden className="pointer-events-none absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, x: [0, -10, 0] }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ opacity: { delay: 1.2 }, y: { delay: 1.2 }, x: { duration: 1.4, repeat: Infinity, delay: 1.6 } }}>
                <ArrowLeft size={12} /> Swipe
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* controls */}
      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1">
          {items.map((_, k) => (
            <motion.button key={k} type="button" aria-label={`Show review ${k + 1}`} aria-current={k === i}
              onClick={() => { interact(); const d = k > i ? 1 : -1; setDir(d); setI(k); setBump((b) => b + 1); }}
              whileTap={{ scale: 1.6 }} // 35
              className="grid h-6 place-items-center">
              {/* 33, 34 */}
              <motion.span className="block h-[3px] overflow-hidden rounded-full bg-slate-200" animate={{ width: k === i ? 22 : 6 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
                {k === i && running && (
                  <motion.span key={`d-${i}`} className="block h-full origin-left bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DURATION / 1000, ease: "linear" }} />
                )}
                {k === i && !running && <span className="block h-full bg-ink" />}
              </motion.span>
            </motion.button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* 38 pause indicator */}
          <AnimatePresence>
            {paused && (
              <motion.span className="grid h-6 w-6 place-items-center text-slate-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <Pause size={12} />
              </motion.span>
            )}
          </AnimatePresence>
          {/* 36, 37 arrows */}
          {[{ d: -1, I: ArrowLeft, l: "Previous review" }, { d: 1, I: ArrowRight, l: "Next review" }].map(({ d, I, l }, k) => (
            <motion.button key={l} type="button" aria-label={l} onClick={() => { interact(); go(d); }}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + k * 0.08 }}
              whileTap={{ x: d * 4, scale: 0.92 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink">
              <I size={16} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
