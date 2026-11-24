import type { Metadata } from "next";
import { GALLERY } from "@/lib/site";
import { localImage } from "@/lib/images";
import { PageHero, CtaBand } from "@/components/shared";
import { GalleryGrid } from "@/components/client";

export const metadata: Metadata = {
  title: "Clinic Gallery — Apollo Dental Sahakarnagar",
  description: "Take a look inside Apollo Dental Sahakarnagar — our clinic, treatment rooms and modern, sterile facilities in Sahakar Nagar, Bengaluru.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const items = GALLERY.filter((g) => localImage(g.src));
  return (
    <>
      <PageHero eyebrow="Gallery" title="Step inside" accent="our clinic." sub="A modern, welcoming space designed around your comfort, with the hygiene and safety standards of The Apollo Hospitals Group." crumbs={[{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]} />
      <section className="container-x py-16 sm:py-24">
        {items.length ? <GalleryGrid items={items} /> : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 sm:p-16">
            <p className="eyebrow">Gallery</p>
            <p className="mt-4 text-[24px] tracking-tight text-ink">Photos coming soon.</p>
            <p className="mt-2 text-[14.5px] text-slate-500">Run <code className="rounded bg-slate-100 px-1.5">npm run fetch-images</code> to import clinic photos.</p>
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
