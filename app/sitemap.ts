import type { MetadataRoute } from "next";
import { SERVICES, SITE_URL } from "@/lib/site";
import { listPosts } from "@/lib/db";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/services", "/doctors", "/gallery", "/patient-guide", "/faqs", "/blog", "/contact", "/book-appointment"].map((p) => ({
    url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8,
  }));
  const services = SERVICES.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 }));
  const posts = listPosts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated_at.replace(" ", "T")), changeFrequency: "monthly" as const, priority: 0.7 }));
  const legal = ["/privacy-policy", "/cookie-policy"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 }));
  return [...pages, ...services, ...posts, ...legal];
}
