import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPosts, readingTime } from "@/lib/db";
import { PageHero, BlogCard, CtaBand, formatDate } from "@/components/shared";
import { Reveal } from "@/components/client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dental Health Blog — Tips from Our Specialists",
  description: "Expert dental advice from the specialists at Apollo Dental Sahakarnagar — implants, root canals, braces, aligners, kids' dental care, whitening and daily oral hygiene.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = listPosts();
  const cats = Array.from(new Set(all.map((p) => p.category)));
  const posts = category ? all.filter((p) => p.category === category) : all;
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero eyebrow="Blog" title="Dental health," accent="explained simply." sub="Practical, trustworthy advice from our specialist dentists to help you and your family care for your smiles." crumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <section className="container-x py-12 sm:py-16">
        <div className="flex flex-wrap gap-1 border-b border-line">
          {[{ c: "", l: "All" }, ...cats.map((c) => ({ c, l: c }))].map(({ c, l }) => {
            const on = (category ?? "") === c;
            return (
              <Link key={l} href={c ? `/blog?category=${encodeURIComponent(c)}` : "/blog"} className={`relative px-3 pb-3 text-[14px] transition-colors ${on ? "text-ink" : "text-slate-500 hover:text-ink"}`}>
                {l}{on && <span className="absolute inset-x-3 -bottom-px h-px bg-ink" />}
              </Link>
            );
          })}
        </div>

        {featured && (
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
              <div className="grain relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl bg-brand-950 p-8 text-white sm:min-h-[380px]">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50">Featured · {featured.category}</span>
                <span className="max-w-lg font-serif text-[36px] leading-[1.05] text-white/90 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 sm:text-[48px]">{featured.title}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">{formatDate(featured.created_at)} · {readingTime(featured.content)} min read</p>
                <h2 className="mt-4 text-[30px] leading-[1.1] tracking-tight text-ink sm:text-[38px]">{featured.title}</h2>
                <p className="mt-4 text-[17px] leading-relaxed text-slate-500">{featured.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-[15px] text-ink"><span className="link-u">Read article</span> <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-20 grid gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => <BlogCard key={p.id} p={p} i={i} />)}
        </div>
        {posts.length === 0 && <p className="mt-10 text-[15px] text-slate-500">No articles yet.</p>}
      </section>
      <CtaBand />
    </>
  );
}
