import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CLINIC, SITE_URL } from "@/lib/site";
import { Header, LeadPopup, CookieConsent, FloatingActions, Analytics } from "@/components/client";
import { Footer, JsonLd } from "@/components/shared";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Apollo Dental Sahakarnagar | Best Dental Clinic in Sahakar Nagar, Bangalore",
    template: "%s | Apollo Dental Sahakarnagar",
  },
  description: CLINIC.description,
  keywords: [
    "dentist in Sahakarnagar", "dental clinic Sahakar Nagar", "best dentist Bangalore", "Apollo Dental Bangalore",
    "dental implants Sahakarnagar", "root canal Sahakarnagar", "braces Bangalore", "Invisalign Bangalore",
    "kids dentist Sahakarnagar", "teeth whitening Bangalore", "dentist near Hebbal", "dentist near Byatarayanapura",
  ],
  applicationName: CLINIC.name,
  authors: [{ name: CLINIC.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: CLINIC.name,
    title: "Apollo Dental Sahakarnagar | Expert Dental Care in Bangalore",
    description: CLINIC.description,
  },
  twitter: { card: "summary_large_image", title: CLINIC.name, description: CLINIC.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "health",
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#faf9f6", width: "device-width", initialScale: 1 };

const dentistSchema = {
  "@context": "https://schema.org",
  "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
  "@id": `${SITE_URL}/#clinic`,
  name: CLINIC.name,
  alternateName: "Apollo Dental Clinic Sahakar Nagar",
  description: CLINIC.description,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image`,
  telephone: CLINIC.phones[0].tel,
  email: CLINIC.email,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, EMI",
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.address.street,
    addressLocality: CLINIC.address.locality,
    addressRegion: CLINIC.address.region,
    postalCode: CLINIC.address.postalCode,
    addressCountry: CLINIC.address.country,
  },
  hasMap: CLINIC.mapLink,
  geo: { "@type": "GeoCoordinates", latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
  areaServed: CLINIC.areasServed.map((name) => ({ "@type": "Place", name: `${name}, Bengaluru` })),
  openingHoursSpecification: CLINIC.hoursSchema.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
  parentOrganization: { "@type": "Organization", name: "Apollo Dental — The Apollo Hospitals Group", url: CLINIC.parentSite },
  medicalSpecialty: ["Dentistry", "Orthodontics", "Periodontics", "Endodontics", "Prosthodontics", "PediatricDentistry", "OralAndMaxillofacialSurgery"],
  sameAs: Object.values(CLINIC.social),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: CLINIC.name,
  publisher: { "@id": `${SITE_URL}/#clinic` },
  inLanguage: "en-IN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={[dentistSchema, websiteSchema]} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
        <LeadPopup />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
