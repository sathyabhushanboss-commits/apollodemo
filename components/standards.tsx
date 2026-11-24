"use client";

/**
 * "Why Apollo Dental" — interactive bento.
 *
 * Animation inventory (44):
 *  Section ── S1 cursor spotlight · S2 masked heading reveal · S3 shimmer on accent phrase · S4 blur-in copy
 *             S5 hairline draw · S6 rotating background rings · S7 ticking section index
 *  Card ───── C1 clip-path stagger entrance · C2 3D spring tilt · C3 inner spotlight · C4 cursor-tracked border glow
 *             C5 index scramble on hover · C6 title nudge + underline draw · C7 copy brighten · C8 corner brackets
 *  Shield ─── V1 outline draw · V2 rotating dashed orbit · V3 scan sweep · V4 sequential ticks (loop)
 *             V5 completion pulse · V6 sterilisation step cycler
 *  Network ── V7 nodes pop · V8 links draw · V9 particles travel links · V10 patient heartbeat
 *             V11 specialist cycler · V12 hover-to-highlight link (interactive)
 *  Scan ───── V13 tooth outline draw · V14 laser sweep w/ glow · V15 grid flicker · V16 radar ping
 *             V17 ruler ticks · V18 technology label cycler
 *  Plan ───── V19 timeline draw · V20 milestone pops · V21 travelling progress dot · V22 EMI blocks fill (loop)
 *             V23 stage label cycler · V24 "on track" indicator blink
 *  Chips ──── T1 stagger in · T2 magnetic pull · T3 tooltip reveal · T4 status pulse · T5 border shimmer
 */

import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const ORANGE = "#ea8540";
const TEAL = "#82b3bd";

/** Cycles 0..n-1 every `ms` while `run` is true. */
function useTicker(n: number, ms: number, run: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms, run]);
  return i;
}

// ─────────────────────────────────────────────────────────────
// C5 · scramble a two-digit index on hover
// ─────────────────────────────────────────────────────────────
function Scramble({ value, active }: { value: string; active: boolean }) {
  const [text, setText] = useState(value);
  useEffect(() => {
    if (!active) { setText(value); return; }
    let f = 0;
    const id = setInterval(() => {
      f++;
      setText(f > 7 ? value : value.split("").map(() => String(Math.floor(Math.random() * 10))).join(""));
      if (f > 7) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [active, value]);
  return <span className="tabular">{text}</span>;
}

// ─────────────────────────────────────────────────────────────
// Card shell: C1–C8
// ─────────────────────────────────────────────────────────────
function Card({ index, title, text, children, delay }: { index: number; title: string; text: string; delay: number; children: (s: { run: boolean; hot: boolean }) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [hot, setHot] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 160, damping: 18 });
  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const spot = useMotionTemplate`radial-gradient(380px circle at ${px} ${py}, rgba(255,255,255,0.07), transparent 65%)`;
  const glow = useMotionTemplate`radial-gradient(220px circle at ${px} ${py}, rgba(234,133,64,0.85), transparent 70%)`;

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { setHot(false); mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      className="group relative [perspective:1200px]"
      initial={{ opacity: 0, clipPath: "inset(18% 0% 0% 0% round 16px)", y: 30 }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <motion.article
        onMouseMove={onMove}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={reset}
        onFocus={() => setHot(true)}
        onBlur={reset}
        tabIndex={0}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] outline-none transition-colors duration-500 hover:bg-white/[0.04] focus-visible:border-accent-400"
      >
        {/* C3 inner spotlight */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spot }} />
        {/* C4 border glow that follows the cursor */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
        />
        {/* C8 corner brackets */}
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map((c, k) => (
          <motion.span key={c} aria-hidden className={`pointer-events-none absolute h-3 w-3 border-accent-400/80 ${c}`}
            initial={false} animate={{ opacity: hot ? 1 : 0, scale: hot ? 1 : 1.6 }} transition={{ duration: 0.35, delay: hot ? k * 0.04 : 0, ease: EASE }} />
        ))}

        {/* Illustration */}
        <div className="relative h-[210px] border-b border-white/[0.07] sm:h-[230px]" style={{ transform: "translateZ(30px)" }}>
          {children({ run: inView && !reduce, hot })}
        </div>

        {/* Copy */}
        <div className="relative p-6 sm:p-8" style={{ transform: "translateZ(20px)" }}>
          <span className="font-mono text-[11px] text-white/40"><Scramble value={String(index).padStart(2, "0")} active={hot} /></span>
          <motion.h3 className="relative mt-4 w-fit text-[22px] leading-tight tracking-tight text-white sm:text-[24px]" animate={{ x: hot ? 4 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
            {title}
            {/* C6 underline */}
            <motion.span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent-400" initial={false} animate={{ scaleX: hot ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
          </motion.h3>
          {/* C7 brighten */}
          <p className={`mt-3 max-w-md text-[15px] leading-relaxed transition-colors duration-500 ${hot ? "text-white/75" : "text-white/50"}`}>{text}</p>
        </div>
      </motion.article>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// V1–V6 · Protocols: shield + checklist + sterilisation cycle
// ─────────────────────────────────────────────────────────────
const STERI = ["Clean", "Pack", "Autoclave", "Seal"];
function ShieldViz({ run, hot }: { run: boolean; hot: boolean }) {
  const step = useTicker(STERI.length, hot ? 900 : 1600, run);
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6 px-6 sm:gap-10">
      <svg viewBox="0 0 160 170" className="h-[170px] w-[160px] shrink-0 overflow-visible" aria-hidden>
        {/* V2 orbit */}
        <motion.circle cx="80" cy="85" r="76" fill="none" stroke={TEAL} strokeOpacity="0.25" strokeDasharray="2 7"
          animate={run ? { rotate: 360 } : {}} transition={{ duration: hot ? 10 : 28, repeat: Infinity, ease: "linear" }} />
        {/* V1 shield outline */}
        <motion.path d="M80 18 L128 36 V82 C128 114 106 136 80 148 C54 136 32 114 32 82 V36 Z" fill="rgba(130,179,189,0.06)" stroke="white" strokeOpacity="0.85" strokeWidth="1.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
        {/* checklist rows */}
        {[58, 82, 106].map((y, k) => (
          <g key={y}>
            <rect x="72" y={y - 2} width="38" height="4" rx="2" fill="white" fillOpacity="0.14" />
            {/* V4 ticks drawn in sequence, looping */}
            <motion.path d={`M50 ${y} l5 5 l10 -11`} fill="none" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={run ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
              transition={{ duration: 3.6, times: [0, 0.18, 0.85, 1], delay: 0.6 + k * 0.35, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }} />
          </g>
        ))}
        {/* V3 scan sweep */}
        <clipPath id="shield-clip"><path d="M80 18 L128 36 V82 C128 114 106 136 80 148 C54 136 32 114 32 82 V36 Z" /></clipPath>
        <g clipPath="url(#shield-clip)">
          <motion.rect x="30" width="100" height="16" fill="url(#scan-grad)"
            animate={run ? { y: [10, 140] } : { y: 10 }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
        </g>
        <defs>
          <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={TEAL} stopOpacity="0" /><stop offset="1" stopColor={TEAL} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* V5 completion pulse */}
        <motion.circle cx="80" cy="85" r="60" fill="none" stroke={ORANGE} strokeWidth="1"
          animate={run ? { r: [58, 84], opacity: [0.5, 0] } : { opacity: 0 }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }} />
      </svg>

      {/* V6 sterilisation cycle */}
      <ol className="hidden space-y-2.5 font-mono text-[11px] uppercase tracking-[0.12em] sm:block" aria-label="Sterilisation sequence">
        {STERI.map((s, k) => (
          <li key={s} className="flex items-center gap-2.5">
            <motion.span className="h-1.5 w-1.5 rounded-full" animate={{ backgroundColor: k === step ? ORANGE : k < step ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)", scale: k === step ? 1.5 : 1 }} transition={{ duration: 0.3 }} />
            <motion.span animate={{ color: k === step ? "#ffffff" : "rgba(255,255,255,0.35)", x: k === step ? 3 : 0 }} transition={{ duration: 0.3 }}>{s}</motion.span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V7–V12 · Specialists network
// ─────────────────────────────────────────────────────────────
const NODES = [
  { x: 60, y: 44, l: "Implantologist" },
  { x: 260, y: 44, l: "Orthodontist" },
  { x: 60, y: 148, l: "Pedodontist" },
  { x: 260, y: 148, l: "Endodontist" },
];
function NetworkViz({ run, hot }: { run: boolean; hot: boolean }) {
  const auto = useTicker(NODES.length, 1700, run && !hot);
  const [over, setOver] = useState<number | null>(null);
  const act = over ?? auto;
  const C = { x: 160, y: 96 };
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 320 200" className="-mt-5 h-full max-h-[190px] w-full max-w-[360px] overflow-visible" role="img" aria-label="Each patient is matched to the right specialist">
        {NODES.map((n, k) => {
          const on = k === act;
          const d = `M${n.x} ${n.y} Q ${(n.x + C.x) / 2} ${n.y > C.y ? n.y + 4 : n.y - 4} ${C.x} ${C.y}`;
          return (
            <g key={n.l}>
              {/* V8 link draw + V12 highlight */}
              <motion.path d={d} fill="none" strokeWidth={on ? 1.6 : 1} strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} animate={{ stroke: on ? ORANGE : "rgba(255,255,255,0.18)" }}
                transition={{ pathLength: { duration: 1.2, delay: 0.3 + k * 0.12, ease: EASE }, stroke: { duration: 0.3 } }} />
              {/* V9 particle */}
              {run && (
                <motion.circle r={on ? 3 : 2} fill={on ? ORANGE : TEAL}
                  animate={{ cx: [n.x, (n.x + C.x) / 2, C.x], cy: [n.y, n.y > C.y ? n.y + 4 : n.y - 4, C.y], opacity: [0, 1, 0] }}
                  transition={{ duration: on ? 1.1 : 2.2, repeat: Infinity, ease: "easeInOut", delay: k * 0.4 }} />
              )}
              {/* V7 node pop (interactive) */}
              <motion.g style={{ cursor: "pointer" }} onMouseEnter={() => setOver(k)} onMouseLeave={() => setOver(null)}
                initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 + k * 0.1, type: "spring", stiffness: 260, damping: 16 }}>
                <circle cx={n.x} cy={n.y} r="16" fill="transparent" />
                <motion.circle cx={n.x} cy={n.y} r="7" animate={{ fill: on ? ORANGE : "#0d313a", stroke: on ? ORANGE : "rgba(255,255,255,0.5)", r: on ? 8 : 6 }} strokeWidth="1.2" transition={{ duration: 0.3 }} />
                <motion.text x={n.x} y={n.y > C.y ? n.y + 24 : n.y - 16} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1"
                  animate={{ fill: on ? "#ffffff" : "rgba(255,255,255,0.4)" }} transition={{ duration: 0.3 }}>{n.l.toUpperCase()}</motion.text>
              </motion.g>
            </g>
          );
        })}
        {/* V10 patient heartbeat */}
        <motion.circle cx={C.x} cy={C.y} r="22" fill="none" stroke={ORANGE} strokeOpacity="0.5"
          animate={run ? { r: [16, 30], opacity: [0.6, 0] } : {}} transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }} />
        <circle cx={C.x} cy={C.y} r="15" fill="#f6f5f1" />
        <g transform={`translate(${C.x - 7} ${C.y - 8})`} fill="#0f1a1c">
          <circle cx="7" cy="5" r="3.3" />
          <path d="M1 16c0-3.6 2.7-6 6-6s6 2.4 6 6Z" />
        </g>
      </svg>
      {/* V11 specialist cycler */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
        Matched&nbsp;→&nbsp;
        <AnimatePresence mode="wait">
          <motion.span key={act} className="inline-block text-accent-300" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} transition={{ duration: 0.25 }}>
            {NODES[act].l}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V13–V18 · Technology: tooth laser scan
// ─────────────────────────────────────────────────────────────
const TECH_LABELS = ["Digital radiography", "Laser dentistry", "Rotary endodontics"];
const TOOTH = "M7.2 3C4.9 3 3 4.9 3 7.4c0 2.4 1.1 3.8 1.7 6.3.6 2.7.9 7.3 2.7 7.3 1.7 0 1.7-4.7 3.1-4.7h3c1.4 0 1.4 4.7 3.1 4.7 1.8 0 2.1-4.6 2.7-7.3.6-2.5 1.7-3.9 1.7-6.3C21 4.9 19.1 3 16.8 3c-2 0-3 1.1-4.8 1.1S9.2 3 7.2 3Z";
function ScanViz({ run, hot }: { run: boolean; hot: boolean }) {
  const label = useTicker(TECH_LABELS.length, 2200, run);
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <pattern id="scan-grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="white" strokeOpacity="0.07" /></pattern>
          <linearGradient id="beam-v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={ORANGE} stopOpacity="0" /><stop offset="1" stopColor={ORANGE} stopOpacity="0.45" /></linearGradient>
          <filter id="glow-s"><feGaussianBlur stdDeviation="2.5" /></filter>
          <clipPath id="tooth-clip"><path d={TOOTH} transform="translate(100 20) scale(7.5)" /></clipPath>
        </defs>
        {/* V15 grid flicker */}
        <motion.rect width="320" height="220" fill="url(#scan-grid)" animate={run ? { opacity: [0.6, 1, 0.7, 1] } : { opacity: 1 }} transition={{ duration: 3, repeat: Infinity }} />
        {/* V17 ruler ticks */}
        {Array.from({ length: 12 }).map((_, k) => (
          <motion.line key={k} x1="290" x2={k % 3 ? 296 : 302} y1={28 + k * 15} y2={28 + k * 15} stroke="white" strokeOpacity="0.35"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + k * 0.04, duration: 0.3 }} />
        ))}
        {/* V13 tooth draw */}
        <motion.path d={TOOTH} transform="translate(100 20) scale(7.5)" fill="rgba(255,255,255,0.05)" stroke="white" strokeOpacity="0.9" strokeWidth={0.22}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
        {/* inner root canals */}
        <motion.path d="M150 70 C 148 110, 140 140, 132 175 M170 70 C 172 110, 180 140, 188 175" fill="none" stroke={TEAL} strokeOpacity="0.5" strokeDasharray="3 4"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.8 }} />
        {/* V14 laser sweep */}
        <g clipPath="url(#tooth-clip)">
          <motion.g animate={run ? { y: [0, 150, 0] } : {}} transition={{ duration: hot ? 2.2 : 4, repeat: Infinity, ease: "easeInOut" }}>
            <rect x="80" y="10" width="160" height="34" fill="url(#beam-v)" />
            <line x1="80" x2="240" y1="44" y2="44" stroke={ORANGE} strokeWidth="2" filter="url(#glow-s)" />
            <line x1="80" x2="240" y1="44" y2="44" stroke="#fbe5d2" strokeWidth="0.8" />
          </motion.g>
        </g>
        {/* V16 radar ping */}
        <motion.circle cx="178" cy="62" fill="none" stroke={ORANGE} strokeWidth="1"
          animate={run ? { r: [2, 22], opacity: [0.9, 0] } : { r: 0 }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeOut" }} />
        <circle cx="178" cy="62" r="2.5" fill={ORANGE} />
      </svg>
      {/* V18 label cycler */}
      <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400 align-middle" />
        <AnimatePresence mode="wait">
          <motion.span key={label} className="inline-block text-white/75" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.35 }}>
            {TECH_LABELS[label]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V19–V24 · Plan: timeline + EMI instalments
// ─────────────────────────────────────────────────────────────
const STAGES = ["Consult", "Plan", "Treat", "Review"];
function PlanViz({ run, hot }: { run: boolean; hot: boolean }) {
  const stage = useTicker(STAGES.length, hot ? 900 : 1500, run);
  const xs = [40, 120, 200, 280];
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* V19 timeline */}
        <line x1="40" x2="280" y1="78" y2="78" stroke="white" strokeOpacity="0.12" strokeWidth="2" />
        <motion.line x1="40" y1="78" y2="78" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: xs[stage] }} transition={{ duration: 0.6, ease: EASE }} />
        {/* V21 travelling dot */}
        <motion.circle cy="78" r="3" fill="#fbe5d2" animate={run ? { cx: [40, 280], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }} />
        {/* V20 milestones */}
        {xs.map((x, k) => (
          <g key={x}>
            <motion.circle cx={x} cy="78" initial={{ r: 0 }} animate={{ r: k === stage ? 8 : 5, fill: k <= stage ? ORANGE : "#0a2229", stroke: k <= stage ? ORANGE : "rgba(255,255,255,0.4)" }}
              strokeWidth="1.2" transition={{ type: "spring", stiffness: 300, damping: 18, delay: run ? 0 : 0.2 + k * 0.1 }} />
            {/* V23 stage labels */}
            <motion.text x={x} y="54" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1"
              animate={{ fill: k === stage ? "#ffffff" : "rgba(255,255,255,0.35)", y: k === stage ? 50 : 54 }} transition={{ duration: 0.3 }}>
              {STAGES[k].toUpperCase()}
            </motion.text>
          </g>
        ))}
        {/* V22 EMI instalment blocks */}
        <text x="40" y="132" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1" fill="rgba(255,255,255,0.4)">EMI INSTALMENTS</text>
        {Array.from({ length: 6 }).map((_, k) => (
          <g key={k}>
            <rect x={40 + k * 41} y="142" width="34" height="34" rx="6" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.1" />
            <motion.rect x={40 + k * 41} y="142" width="34" height="34" rx="6" fill={TEAL} fillOpacity="0.55"
              style={{ transformOrigin: `${40 + k * 41 + 17}px 176px` }}
              initial={{ scaleY: 0 }}
              animate={run ? { scaleY: [0, 1, 1, 0] } : { scaleY: 1 }}
              transition={{ duration: 4.8, times: [0, 0.15, 0.85, 1], delay: k * 0.22, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }} />
          </g>
        ))}
      </svg>
      {/* V24 on-track indicator */}
      <div className="absolute bottom-3 right-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
        <motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-400" animate={run ? { opacity: [1, 0.25, 1] } : {}} transition={{ duration: 1.4, repeat: Infinity }} />
        No surprises
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// T1–T5 · magnetic tech chips with tooltips
// ─────────────────────────────────────────────────────────────
function MagneticChip({ label, tip, i }: { label: string; tip: string; i: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  const [open, setOpen] = useState(false);
  return (
    <motion.li initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: EASE }} className="relative">
      <motion.button
        ref={ref}
        type="button"
        style={{ x, y }}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set((e.clientX - r.left - r.width / 2) * 0.3);
          y.set((e.clientY - r.top - r.height / 2) * 0.4);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { x.set(0); y.set(0); setOpen(false); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby={`chip-tip-${i}`}
        className="chip-shimmer relative flex items-center gap-2.5 overflow-hidden rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-accent-400/60 hover:text-white"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60 [animation-duration:2.4s]" style={{ animationDelay: `${i * 0.4}s` }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
        </span>
        {label}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.span id={`chip-tip-${i}`} role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-full left-0 z-10 mb-3 w-60 rounded-xl border border-white/10 bg-[#0f1a1c] p-3 text-[13px] normal-case leading-snug tracking-normal text-white/75 shadow-2xl">
            {tip}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: S1–S7
// ─────────────────────────────────────────────────────────────
export type Standard = { t: string; d: string };
const VIZ = [ShieldViz, NetworkViz, ScanViz, PlanViz];
const TECH = [
  { l: "Digital X-rays", t: "Digital radiography for precise diagnosis with clear images we can show and explain to you." },
  { l: "Laser dentistry", t: "Minimally invasive treatment for gums and soft tissue." },
  { l: "Rotary endodontics", t: "Efficient, comfortable root canal treatment with modern rotary systems." },
  { l: "Strict sterilisation", t: "Apollo Hospitals Group infection-control protocols at every chair." },
];

export function StandardsSection({ items, index = 2 }: { items: Standard[]; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const sx = useMotionValue(-1000);
  const sy = useMotionValue(-1000);
  const spot = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(45,117,132,0.22), transparent 60%)`;

  // S7 ticking section index
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setIdx(index); return; }
    let k = 0;
    const id = setInterval(() => { k++; setIdx(k); if (k >= index) clearInterval(id); }, 120);
    return () => clearInterval(id);
  }, [inView, index, reduce]);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden bg-brand-950 text-white"
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top); }}
      onMouseLeave={() => { sx.set(-1000); sy.set(-1000); }}
    >
      {/* S1 cursor spotlight */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />
      {/* S6 rotating rings */}
      <svg aria-hidden viewBox="0 0 600 600" className="pointer-events-none absolute -right-48 -top-48 h-[640px] w-[640px] opacity-60">
        {[290, 230, 170].map((r, k) => (
          <motion.circle key={r} cx="300" cy="300" r={r} fill="none" stroke="white" strokeOpacity={0.06 + k * 0.02} strokeDasharray={k === 1 ? "2 10" : k === 2 ? "1 6" : undefined}
            animate={reduce ? {} : { rotate: k % 2 ? -360 : 360 }} transition={{ duration: 60 + k * 30, repeat: Infinity, ease: "linear" }} />
        ))}
      </svg>

      <div className="container-x relative py-24 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-white/50"><span className="tabular text-white">{String(idx).padStart(2, "0")}</span>Why Apollo Dental</p>
            {/* S2 masked heading */}
            <h2 className="mt-5 text-[34px] font-normal leading-[1.04] tracking-[-0.035em] sm:text-[48px]" aria-label="Hospital-group standards, in your neighbourhood.">
              {["Hospital-group standards,", "in your neighbourhood."].map((line, k) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]" aria-hidden>
                  <motion.span className="block" initial={{ y: "105%" }} animate={inView ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.1 + k * 0.1, ease: EASE }}>
                    {k === 0 ? line : <span className="shimmer-text">{line}</span>}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
          {/* S4 blur-in copy */}
          <motion.p className="max-w-md text-[17px] leading-relaxed text-white/60 lg:ml-auto"
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }} animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}} transition={{ duration: 1, delay: 0.35, ease: EASE }}>
            The Sahakarnagar clinic brings the protocols of one of India&apos;s most trusted healthcare groups to a calm, local practice, with specialists you see by name.
          </motion.p>
        </div>

        {/* S5 hairline */}
        <motion.div aria-hidden className="mt-14 h-px origin-left bg-gradient-to-r from-accent-400 via-white/20 to-transparent" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
          {items.map((s, i) => {
            const Viz = VIZ[i % VIZ.length];
            return (
              <Card key={s.t} index={i + 1} title={s.t} text={s.d} delay={(i % 2) * 0.1 + Math.floor(i / 2) * 0.08}>
                {({ run, hot }) => <Viz run={run} hot={hot} />}
              </Card>
            );
          })}
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
          {TECH.map((t, i) => <MagneticChip key={t.l} label={t.l} tip={t.t} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
