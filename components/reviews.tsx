"use client";

/**
 * Patient reviews.
 * Desktop: two marquee rows running in opposite directions (pause on hover, edge fades).
 * Mobile: swipeable card deck (see review-deck.tsx).
 */

import { motion } from "framer-motion";
import { ReviewDeck } from "./review-deck";
import { ArrowUpRight } from "lucide-react";
import type { Review } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

function Stars({ size = 14 }: { size?: number }) {
  return (
    <span className="flex gap-0.5 text-accent-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8Z" /></svg>
      ))}
    </span>
  );
}

const GoogleG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2Z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2s.1-1.4.4-2V7H2a11 11 0 0 0 0 10l3.7-3Z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7l3.7 2.9C6.6 7.4 9.1 5.4 12 5.4Z" />
  </svg>
);

function ReviewCard({ r, className = "" }: { r: Review; className?: string }) {
  return (
    <figure className={`flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[var(--shadow-soft)] ${className}`}>
      <div className="flex items-center justify-between">
        <Stars />
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400"><GoogleG /> Google</span>
      </div>
      <blockquote className="mt-4 flex-1 text-[15.5px] leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] text-white">{r.name[0]}</span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] text-ink">{r.name}</span>
          <span className="block truncate text-[12.5px] text-slate-500">{r.tag}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items, reverse = false, duration }: { items: Review[]; reverse?: boolean; duration: number }) {
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex w-max gap-4 py-2 group-hover/row:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{ animation: `reviews-marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[...items, ...items].map((r, i) => (
          <div key={i} className="w-[360px] shrink-0" aria-hidden={i >= items.length ? true : undefined}>
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsSection({ reviews, mapLink, index = 5 }: { reviews: Review[]; mapLink: string; index?: number }) {
  const half = Math.ceil(reviews.length / 2);
  return (
    <section className="overflow-hidden border-t border-line bg-white">
      <div className="container-x pt-24 sm:pt-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} className="max-w-2xl">
            <p className="eyebrow"><span className="text-ink">{String(index).padStart(2, "0")}</span>Patients</p>
            <h2 className="mt-5 text-[34px] font-normal leading-[1.04] tracking-[-0.035em] text-ink sm:text-[48px]">
              In their words. <span className="text-slate-400">Straight from Google.</span>
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <Stars size={18} />
              <span className="text-[14px] text-slate-500">5-star reviews from patients of the Sahakarnagar clinic</span>
            </div>
          </motion.div>
          <a href={mapLink} target="_blank" rel="noopener" className="btn-ghost shrink-0 self-start md:self-auto">
            <GoogleG /> Read all on Google <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      {/* Desktop: two marquee rows */}
      <div className="mt-14 hidden space-y-4 pb-24 sm:pb-32 md:block" aria-label="Patient reviews">
        <MarqueeRow items={reviews.slice(0, half)} duration={70} />
        <MarqueeRow items={reviews.slice(half)} duration={80} reverse />
      </div>

      {/* Mobile: one rotating card */}
      <div className="container-x mt-10 pb-24 md:hidden">
        <ReviewDeck items={reviews} />
      </div>
    </section>
  );
}
