import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { getPost, listPosts, readingTime, renderMarkdown } from "@/lib/db";
import { CLINIC, SITE_URL } from "@/lib/site";
import { BlogCard, CtaBand, JsonLd, breadcrumbSchema, formatDate } from "@/components/shared";
import { LeadForm } from "@/components/client";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return { title: "Article not found" };
  return {
    title: p.title,
    description: p.excerpt,
    keywords: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
    alternates: { canonical: `/blog/${p.slug}` },
    authors: [{ name: p.author }],
    openGraph: { type: "article", title: p.title, description: p.excerpt, url: `/blog/${p.slug}`, publishedTime: p.created_at, modifiedTime: p.updated_at, authors: [p.author], tags: p.tags.split(",") },
  };
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const { html, toc } = renderMarkdown(p.content);
  const related = listPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  const url = `${SITE_URL}/blog/${p.slug}`;

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt,
          datePublished: p.created_at.replace(" ", "T"), dateModified: p.updated_at.replace(" ", "T"),
          author: { "@type": "Person", name: p.author }, publisher: { "@id": `${SITE_URL}/#clinic` },
          mainEntityOfPage: url, url, keywords: p.tags, articleSection: p.category, image: `${SITE_URL}/opengraph-image`,
        },
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]),
      ]} />

      <header className="border-b border-line">
        <div className="container-x pb-14 pt-10 sm:pb-20 sm:pt-14">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 transition hover:text-ink"><ArrowLeft size={13} /> Journal</Link>
          <div className="mt-12 max-w-4xl">
            <p className="eyebrow">{p.category}</p>
            <h1 className="mt-5 text-[38px] font-normal leading-[1.04] tracking-[-0.035em] text-ink sm:text-[60px]">{p.title}</h1>
            <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-slate-500">{p.excerpt}</p>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-5 text-[14px]">
            <div><dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Author</dt><dd className="mt-1 text-ink">{p.author}</dd></div>
            <div><dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Published</dt><dd className="mt-1 text-ink">{formatDate(p.created_at)}</dd></div>
            <div><dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Reading time</dt><dd className="mt-1 text-ink">{readingTime(p.content)} min</dd></div>
          </dl>
        </div>
      </header>

      <div className="container-x grid gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_340px] lg:gap-20">
        <article className="prose-blog mx-auto w-full max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {toc.length > 0 && (
            <nav className="border-t border-ink pt-5" aria-label="Table of contents">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">On this page</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="text-[14px] text-slate-500 transition hover:text-ink">{t.text}</a></li>)}
              </ul>
            </nav>
          )}
          <div className="card p-6">
            <p className="eyebrow">Talk to a specialist</p>
            <p className="mt-3 text-[20px] tracking-tight text-ink">Book a consultation</p>
            <div className="mt-4"><LeadForm source={`blog:${p.slug}`} variant="compact" submitLabel="Request callback" /></div>
            <a href={`tel:${CLINIC.phones[0].tel}`} className="tabular mt-4 flex items-center justify-center gap-2 text-[14px] text-slate-600 hover:text-ink"><Phone size={15} /> {CLINIC.phones[0].display}</a>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-20 sm:py-24">
          <div className="container-x">
            <h2 className="text-[30px] tracking-tight text-ink sm:text-[38px]">Keep <span className="text-slate-400">reading</span></h2>
            <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-3">{related.map((r, i) => <BlogCard key={r.id} p={r} i={i} />)}</div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
