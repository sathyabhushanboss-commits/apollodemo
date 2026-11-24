import type { NextConfig } from "next";

// 301 redirects from the old PHP site so existing Google rankings carry over
const LEGACY: Record<string, string> = {
  "index.php": "/", "about.php": "/about", "service.php": "/services", "contact.php": "/contact",
  "cosmetic-dentist-in-sahakara-nagar.php": "/services/cosmetic-dentistry-veneers",
  "dental-veneers-in-sahakara-nagar.php": "/services/cosmetic-dentistry-veneers",
  "dental-bonding-in-sahakara-nagar.php": "/services/cosmetic-dentistry-veneers",
  "smile-makeover-in-sahakara-nagar.php": "/services/cosmetic-dentistry-veneers",
  "teeth-whitening-clinic-in-sahakara-nagar.php": "/services/teeth-whitening",
  "dental-crowns-and-bridges-in-sahakara-nagar.php": "/services/crowns-and-bridges",
  "endodontist-in-sahakara-nagar.php": "/services/root-canal-treatment",
  "root-canal-treatment-in-sahakara-nagar.php": "/services/root-canal-treatment",
  "general-dentistry-in-sahakaranagar.php": "/services/teeth-cleaning-general-dentistry",
  "teeth-cleaning-in-sahakara-nagar.php": "/services/teeth-cleaning-general-dentistry",
  "dental-examination-in-sahakara-nagar.php": "/services/teeth-cleaning-general-dentistry",
  "dental-fillings-in-sahakara-nagar.php": "/services/teeth-cleaning-general-dentistry",
  "oral-care-in-sahakara-nagar.php": "/services/teeth-cleaning-general-dentistry",
  "painless-tooth-extraction-in-sahakarnagar.php": "/services/tooth-extraction-oral-surgery",
  "dental-surgeon-in-sahakara-nagar.php": "/services/tooth-extraction-oral-surgery",
  "dental-implants-in-sahakara-nagar.php": "/services/dental-implants",
  "orthodontic-clinic-in-sahakara-nagar.php": "/services/braces-orthodontics",
  "dental-braces-in-sahakara-nagar.php": "/services/braces-orthodontics",
  "dental-retainers-in-sahakara-nagar.php": "/services/braces-orthodontics",
  "invisalign-provider-in-sahakara-nagar.php": "/services/clear-aligners-invisalign",
  "pediatric-dentist-in-sahakar-nagar.php": "/services/pediatric-dentistry",
  "periodontal-treatments-in-sahakara-nagar.php": "/services/gum-care-periodontics",
  "bleeding-gums-treatment-in-sahakara-nagar.php": "/services/gum-care-periodontics",
  "prosthodontist-in-sahakara-nagar.php": "/services/dentures-prosthodontics",
  "dentures-in-sahakara-nagar.php": "/services/dentures-prosthodontics",
  "maxillofacial-prosthetics-in-sahakara-nagar.php": "/services/dentures-prosthodontics",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(LEGACY).map(([from, to]) => ({ source: `/${from}`, destination: to, permanent: true }));
  },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
