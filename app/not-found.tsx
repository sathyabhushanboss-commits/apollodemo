import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-6 max-w-3xl text-[44px] font-normal leading-[1.02] tracking-[-0.04em] text-ink sm:text-[72px]">
        This page is missing. <span className="text-slate-400">Like a tooth.</span>
      </h1>
      <p className="mt-6 max-w-md text-[17px] text-slate-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-dark">Back to home</Link>
        <Link href="/book-appointment" className="btn-ghost">Book appointment <ArrowRight size={15} /></Link>
      </div>
    </section>
  );
}
