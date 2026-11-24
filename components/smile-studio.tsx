"use client";

/**
 * "Smile Studio" — interactive tooth-cleaning moment.
 * Brush follows the pointer (mouse or finger); stains fade as it passes; foam bubbles rise;
 * at 100% the tooth shines and sparkles, then resets. Auto-demos itself when idle.
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const TOOTH = "M7.2 3C4.9 3 3 4.9 3 7.4c0 2.4 1.1 3.8 1.7 6.3.6 2.7.9 7.3 2.7 7.3 1.7 0 1.7-4.7 3.1-4.7h3c1.4 0 1.4 4.7 3.1 4.7 1.8 0 2.1-4.6 2.7-7.3.6-2.5 1.7-3.9 1.7-6.3C21 4.9 19.1 3 16.8 3c-2 0-3 1.1-4.8 1.1S9.2 3 7.2 3Z";
const T = "translate(20 30) scale(15)";

// Stains placed on the crown (svg units, viewBox 400x420)
const STAINS = [
  { x: 108, y: 128, r: 20 }, { x: 150, y: 150, r: 15 }, { x: 128, y: 190, r: 22 }, { x: 176, y: 205, r: 14 },
  { x: 205, y: 160, r: 18 }, { x: 245, y: 140, r: 16 }, { x: 288, y: 125, r: 19 }, { x: 270, y: 182, r: 22 },
  { x: 228, y: 222, r: 16 }, { x: 300, y: 205, r: 13 }, { x: 160, y: 250, r: 14 }, { x: 250, y: 258, r: 15 },
  { x: 118, y: 236, r: 12 }, { x: 205, y: 270, r: 12 },
];
// Auto-brush zig-zag path across the crown
const AUTO_PATH: [number, number][] = [];
for (let row = 0; row < 7; row++) {
  const y = 118 + row * 25;
  const xs = row % 2 ? [310, 95] : [95, 310];
  for (let k = 0; k <= 12; k++) AUTO_PATH.push([xs[0] + ((xs[1] - xs[0]) * k) / 12, y + Math.sin(k) * 6]);
}
const SPARKS = [
  { x: 70, y: 70, s: 1.2, d: 0 }, { x: 335, y: 80, s: 1, d: 0.08 }, { x: 352, y: 220, s: 0.8, d: 0.16 },
  { x: 48, y: 210, s: 0.9, d: 0.12 }, { x: 200, y: 30, s: 1.1, d: 0.05 }, { x: 300, y: 330, s: 0.7, d: 0.2 }, { x: 100, y: 330, s: 0.75, d: 0.22 },
];

type Bubble = { id: number; x: number; y: number; r: number };

function Spark({ x, y, s }: { x: number; y: number; s: number }) {
  return <path d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z" transform={`translate(${x} ${y}) scale(${s})`} fill="#fff7ee" />;
}

export function SmileStudio() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(wrapRef, { margin: "-20% 0px" });
  const [clean, setClean] = useState<boolean[]>(() => STAINS.map(() => false));
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false); // user is brushing
  const [auto, setAuto] = useState(false);
  const lastUser = useRef(0);
  const bid = useRef(0);
  const lastBubble = useRef(0);

  const bx = useSpring(300, { stiffness: 380, damping: 30 });
  const by = useSpring(345, { stiffness: 380, damping: 30 });
  const tilt = useSpring(-18, { stiffness: 200, damping: 18 });
  const prevX = useRef(300);

  const progress = clean.filter(Boolean).length / STAINS.length;

  const scrub = useCallback((x: number, y: number) => {
    bx.set(x); by.set(y);
    tilt.set(Math.max(-40, Math.min(10, -18 + (x - prevX.current) * 1.4)));
    prevX.current = x;
    setClean((c) => {
      let changed = false;
      const n = c.map((v, i) => {
        if (v) return v;
        const s = STAINS[i];
        if (Math.hypot(s.x - x, s.y - y) < s.r + 22) { changed = true; return true; }
        return v;
      });
      return changed ? n : c;
    });
    const now = performance.now();
    if (now - lastBubble.current > 55) {
      lastBubble.current = now;
      const id = ++bid.current;
      setBubbles((b) => [...b.slice(-22), { id, x: x + (Math.random() - 0.5) * 34, y: y + (Math.random() - 0.5) * 20, r: 3 + Math.random() * 6 }]);
      setTimeout(() => setBubbles((b) => b.filter((q) => q.id !== id)), 1100);
    }
  }, [bx, by, tilt]);

  const toSvg = (cx: number, cy: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = cx; pt.y = cy;
    const m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : null;
  };

  // completion → celebrate → reset
  // (kept as two effects: setting `done` must not cancel the pending reset timer)
  useEffect(() => {
    if (progress >= 1 && !done) setDone(true);
  }, [progress, done]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setClean(STAINS.map(() => false));
      setDone(false);
    }, 4200);
    return () => clearTimeout(t);
  }, [done]);

  // idle auto-demo
  useEffect(() => {
    if (reduce || !inView || done) { setAuto(false); return; }
    const id = setInterval(() => {
      if (performance.now() - lastUser.current > 2600) setAuto(true);
    }, 500);
    return () => clearInterval(id);
  }, [inView, done, reduce]);

  useEffect(() => {
    if (!auto || done) return;
    let k = 0;
    const id = setInterval(() => {
      if (performance.now() - lastUser.current < 2600) { setAuto(false); return; }
      const [x, y] = AUTO_PATH[k % AUTO_PATH.length];
      scrub(x, y);
      k++;
    }, 45);
    return () => clearInterval(id);
  }, [auto, done, scrub]);

  const onPointer = (e: React.PointerEvent) => {
    const p = toSvg(e.clientX, e.clientY);
    if (!p) return;
    lastUser.current = performance.now();
    if (auto) setAuto(false);
    if (!done) scrub(p.x, p.y);
  };

  const pct = Math.round(progress * 100);

  return (
    <section ref={wrapRef} className="container-x py-20 sm:py-28">
      <div className="grain relative overflow-hidden rounded-3xl bg-brand-950 text-white">
        {/* ambient glow follows completion */}
        <motion.div aria-hidden className="pointer-events-none absolute right-[8%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full"
          animate={{ background: done ? "radial-gradient(circle, rgba(246,201,163,0.35), transparent 65%)" : `radial-gradient(circle, rgba(45,117,132,${0.18 + progress * 0.22}), transparent 65%)` }}
          transition={{ duration: 0.8 }} />

        <div className="relative grid items-center gap-6 p-7 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-16">
          {/* Copy */}
          <div>
            <motion.p className="eyebrow text-white/50" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              Smile studio
            </motion.p>
            <h2 className="mt-5 text-[36px] font-normal leading-[1.02] tracking-[-0.04em] sm:text-[54px]">
              {["Give this tooth", "a proper clean."].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]">
                  <motion.span className={`block ${i ? "text-white/45" : ""}`} initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1, ease: EASE }}>{l}</motion.span>
                </span>
              ))}
            </h2>
            <motion.p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}>
              <span className="hidden md:inline">Move your cursor over the tooth to brush away the stains.</span>
              <span className="md:hidden">Drag your finger over the tooth to brush away the stains.</span>{" "}
              In the clinic, a professional scale and polish does this properly.
            </motion.p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/services/teeth-cleaning-general-dentistry" className="shine btn-primary h-12 px-6">Book a cleaning <ArrowRight size={16} /></Link>
              <button type="button" onClick={() => { setClean(STAINS.map(() => false)); setDone(false); lastUser.current = performance.now(); }}
                className="btn h-12 border border-white/20 px-5 text-white hover:border-white/50">Reset</button>
            </div>
          </div>

          {/* Stage */}
          <div
            className="relative mx-auto aspect-[400/420] w-full max-w-[460px] touch-none select-none md:cursor-none"
            onPointerMove={onPointer}
            onPointerDown={(e) => { setActive(true); onPointer(e); }}
            onPointerUp={() => setActive(false)}
            onPointerLeave={() => setActive(false)}
            role="img"
            aria-label={`Interactive tooth, ${pct}% cleaned`}
          >
            <svg ref={svgRef} viewBox="0 0 400 420" className="h-full w-full overflow-visible">
              <defs>
                <radialGradient id="ss-enamel" cx="38%" cy="28%" r="80%">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.55" stopColor="#f4f1ea" />
                  <stop offset="1" stopColor="#d9d3c6" />
                </radialGradient>
                <linearGradient id="ss-dull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d8c08a" />
                  <stop offset="1" stopColor="#b8995a" />
                </linearGradient>
                <radialGradient id="ss-stain">
                  <stop offset="0" stopColor="#8a6a2e" stopOpacity="0.85" />
                  <stop offset="0.6" stopColor="#a5823f" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#b8995a" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ss-shine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="ss-clip"><path d={TOOTH} transform={T} /></clipPath>
                <filter id="ss-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
                <filter id="ss-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="22" stdDeviation="20" floodColor="#000" floodOpacity="0.45" /></filter>
              </defs>

              {/* orbit + floor shadow */}
              <motion.circle cx="200" cy="200" r="186" fill="none" stroke="#82b3bd" strokeOpacity="0.18" strokeDasharray="2 9"
                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} />
              <ellipse cx="200" cy="392" rx="120" ry="12" fill="#000" opacity="0.35" filter="url(#ss-soft)" />

              {/* tooth (gentle float) */}
              <motion.g animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <g filter="url(#ss-shadow)">
                  <path d={TOOTH} transform={T} fill="url(#ss-enamel)" />
                </g>
                <g clipPath="url(#ss-clip)">
                  {/* dull yellow cast fades as it gets cleaner */}
                  <motion.rect x="0" y="0" width="400" height="420" fill="url(#ss-dull)" animate={{ opacity: 0.55 * (1 - progress) }} transition={{ duration: 0.5 }} />
                  {/* stains */}
                  {STAINS.map((s, i) => (
                    <motion.ellipse key={i} cx={s.x} cy={s.y} rx={s.r * 1.25} ry={s.r} fill="url(#ss-stain)"
                      initial={false}
                      animate={clean[i] ? { opacity: 0, scale: 0.4 } : { opacity: 1, scale: 1 }}
                      transition={{ duration: clean[i] ? 0.45 : 0.8, ease: EASE, delay: clean[i] ? 0 : i * 0.04 }}
                      style={{ transformOrigin: `${s.x}px ${s.y}px` }} />
                  ))}
                  {/* glossy highlight */}
                  <ellipse cx="128" cy="112" rx="16" ry="34" fill="#fff" opacity="0.4" transform="rotate(-24 128 112)" filter="url(#ss-soft)" />
                  {/* completion shine sweep */}
                  <AnimatePresence>
                    {done && (
                      <motion.rect key="shine" y="0" width="90" height="420" fill="url(#ss-shine)" transform="skewX(-18)"
                        initial={{ x: -120 }} animate={{ x: 520 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeInOut", repeat: 2, repeatDelay: 0.5 }} />
                    )}
                  </AnimatePresence>
                </g>
                <path d={TOOTH} transform={T} fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth={0.09} />
              </motion.g>

              {/* foam bubbles */}
              <AnimatePresence>
                {bubbles.map((b) => (
                  <motion.circle key={b.id} cx={b.x} r={b.r} fill="#ffffff" fillOpacity="0.85" stroke="#d9e9ec" strokeWidth="0.8"
                    initial={{ cy: b.y, opacity: 0, scale: 0.3 }} animate={{ cy: b.y - 40, opacity: [0, 1, 0], scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1.05, ease: "easeOut" }} style={{ transformOrigin: `${b.x}px ${b.y}px` }} />
                ))}
              </AnimatePresence>

              {/* sparkles on completion */}
              <AnimatePresence>
                {done && SPARKS.map((p, i) => (
                  <motion.g key={i} initial={{ scale: 0, rotate: -90, opacity: 0 }} animate={{ scale: [0, 1.2, 1], rotate: 0, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: p.d + 0.2, duration: 0.6, ease: EASE }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                    <motion.g animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}>
                      <Spark x={p.x} y={p.y} s={p.s} />
                    </motion.g>
                  </motion.g>
                ))}
              </AnimatePresence>

              {/* toothbrush */}
              <motion.g style={{ x: bx, y: by }} className="pointer-events-none">
                <motion.g style={{ rotate: tilt }} animate={active || auto ? { y: [0, -3, 0, 3, 0] } : {}} transition={{ duration: 0.25, repeat: Infinity }}>
                  {/* bristles */}
                  <g transform="translate(-24 -16)">
                    {Array.from({ length: 8 }).map((_, k) => (
                      <rect key={k} x={k * 6} y="0" width="3.2" height="15" rx="1.4" fill={k % 2 ? "#e2dfd7" : "#ffffff"} />
                    ))}
                  </g>
                  {/* head + handle */}
                  <rect x="-28" y="-2" width="56" height="12" rx="6" fill="#e56d22" />
                  <path d="M26 2 C 60 2, 90 6, 150 14 L 150 24 C 90 18, 60 14, 26 12 Z" fill="#e56d22" />
                  <path d="M40 5 C 70 6, 100 9, 146 15" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <rect x="-28" y="-2" width="56" height="4" rx="2" fill="#fff" opacity="0.3" />
                </motion.g>
              </motion.g>
            </svg>

            {/* hint */}
            <AnimatePresence>
              {progress === 0 && !auto && (
                <motion.div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: [0, -4, 0] }} exit={{ opacity: 0 }} transition={{ y: { duration: 2, repeat: Infinity } }}>
                  Brush me
                </motion.div>
              )}
              {done && (
                <motion.div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[14px] text-ink shadow-[var(--shadow-pop)]"
                  initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                  Sparkling clean. Now keep it that way.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
