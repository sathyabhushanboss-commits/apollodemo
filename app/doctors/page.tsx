import type { Metadata } from "next";
import { DOCTORS, SITE_URL } from "@/lib/site";
import { PageHero, DoctorCard, CtaBand, JsonLd } from "@/components/shared";

export const metadata: Metadata = {
  title: "Our Dentists — Specialist Dental Team in Sahakarnagar",
  description: "Meet the 11 specialist dentists at Apollo Dental Sahakarnagar — implantologists, orthodontists, endodontists, periodontists, prosthodontists, pedodontists and oral surgeons.",
  alternates: { canonical: "/doctors" },
};

export default function DoctorsPage() {
  return (
    <>
      <JsonLd data={DOCTORS.map((d) => ({
        "@context": "https://schema.org", "@type": "Person", name: d.name, jobTitle: d.role,
        hasCredential: d.qual, worksFor: { "@id": `${SITE_URL}/#clinic` },
      }))} />
      <PageHero eyebrow="Our team" title="Meet our" accent="specialists." sub="Eleven qualified dentists covering every branch of dentistry, so you're always treated by the right expert." crumbs={[{ name: "Home", path: "/" }, { name: "Our Dentists", path: "/doctors" }]} />
      <section className="container-x py-16 sm:py-24">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {DOCTORS.map((d, i) => <DoctorCard key={d.name} d={d} i={i} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
