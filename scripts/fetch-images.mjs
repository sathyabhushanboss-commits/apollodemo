// Downloads the clinic's existing photos from the live site into /public/images.
// Run once on your machine:  npm run fetch-images
import fs from "node:fs";
import path from "node:path";

const BASE = "https://apollodentalsahakarnagar.com/img/";
const OUT = path.join(process.cwd(), "public", "images");

const jobs = [
  // clinic gallery
  ...["b4.jpg", "b2.jpg", "abt1.jpeg", "ab.jpg", "ab1.jpeg", "ab2.jpeg", "ab3.jpeg", "ab4.jpeg"].map((f) => [f, `clinic/${f}`]),
  // doctors
  ...["d1.jpg", "d2.jpg", "d3.jpg", "d5.jpg", "d8.jpg", "d10.jpeg", "d12.jpeg", "d13.jpeg", "d15.png", "d15.jpg", "d16.jpeg"].map((f) => [f, `doctors/${f}`]),
  // treatment page hero images (live page slug → new slug)
  ...Object.entries({
    "dental-implants-in-sahakara-nagar": "dental-implants",
    "root-canal-treatment-in-sahakara-nagar": "root-canal-treatment",
    "dental-braces-in-sahakara-nagar": "braces-orthodontics",
    "invisalign-provider-in-sahakara-nagar": "clear-aligners-invisalign",
    "teeth-whitening-clinic-in-sahakara-nagar": "teeth-whitening",
    "cosmetic-dentist-in-sahakara-nagar": "cosmetic-dentistry-veneers",
    "dental-crowns-and-bridges-in-sahakara-nagar": "crowns-and-bridges",
    "pediatric-dentist-in-sahakar-nagar": "pediatric-dentistry",
    "periodontal-treatments-in-sahakara-nagar": "gum-care-periodontics",
    "painless-tooth-extraction-in-sahakarnagar": "tooth-extraction-oral-surgery",
    "dentures-in-sahakara-nagar": "dentures-prosthodontics",
    "teeth-cleaning-in-sahakara-nagar": "teeth-cleaning-general-dentistry",
  }).map(([live, slug]) => [`${live}.jpg`, `services/${slug}.jpg`]),
];

let ok = 0, fail = 0;
for (const [src, dest] of jobs) {
  const file = path.join(OUT, dest);
  try {
    const res = await fetch(BASE + src);
    if (!res.ok || !(res.headers.get("content-type") || "").startsWith("image")) throw new Error(String(res.status));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log("✓", dest); ok++;
  } catch (e) {
    console.log("✗", src, "-", e.message); fail++;
  }
}
console.log(`\nDone: ${ok} downloaded, ${fail} skipped. Restart / rebuild the site to show them.`);
