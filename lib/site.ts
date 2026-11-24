// ─────────────────────────────────────────────────────────────
// Clinic data — single source of truth for content + SEO
// ─────────────────────────────────────────────────────────────

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://apollodentalsahakarnagar.com").replace(/\/$/, "");

export const CLINIC = {
  name: "Apollo Dental Sahakarnagar",
  shortName: "Apollo Dental",
  legalName: "Apollo Dental Clinic, Sahakar Nagar",
  tagline: "Making India Smile Through Expert Dental Care",
  description:
    "Apollo Dental Sahakarnagar offers world-class dental care in Bangalore — implants, root canal, braces, aligners, cosmetic dentistry, kids dentistry and more by 11 specialist dentists from The Apollo Hospitals Group.",
  phones: [
    { label: "Mobile / WhatsApp", display: "+91 98450 55386", tel: "+919845055386" },
    { label: "Clinic", display: "080 4150 0111", tel: "+918041500111" },
    { label: "Toll Free", display: "1800 202 0507", tel: "18002020507" },
  ],
  whatsapp: "919845055386",
  email: "info@apollodentalsahakarnagar.com",
  address: {
    line1: "26, 1st Floor, Block G, 60th Main Road",
    line2: "Sahakarnagar, Bengaluru – 560092",
    landmark: "Next to Big Market",
    street: "26, 1st Floor, Block G, 60th Main Road, Sahakarnagar",
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560092",
    country: "IN",
  },
  mapEmbed: "https://www.google.com/maps?q=Apollo+Dental+Clinic+Sahakara+Nagar,+13.062,77.593&z=16&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Apollo+Dental+Sahakarnagar+Bengaluru",
  hours: [
    { days: "Monday – Saturday", time: "9:30 AM – 8:30 PM" },
    { days: "Sunday", time: "9:30 AM – 5:00 PM" },
  ],
  // schema.org openingHoursSpecification
  hoursSchema: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "20:30" },
    { dayOfWeek: ["Sunday"], opens: "09:30", closes: "17:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61567949151614",
    instagram: "https://www.instagram.com/apollodentalsahakarnagar/",
  } as Record<string, string>,
  geo: { lat: 13.062, lng: 77.593 },
  areasServed: [
    "Sahakarnagar", "Byatarayanapura", "Hebbal", "Kodigehalli", "Yelahanka New Town", "Jakkur", "Vidyaranyapura",
    "Kogilu", "Allasandra", "Kempapura", "Amruthahalli", "Thindlu", "Sanjay Nagar", "RT Nagar", "Yelahanka",
  ],
  parentSite: "https://www.apollodental.in",
};

// The 10 main pages
export const PAGES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Treatments" },
  { href: "/doctors", label: "Our Dentists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/patient-guide", label: "Patient Guide" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/book-appointment", label: "Book Appointment" },
];

// Desktop header (Patients = dropdown)
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Treatments" },
  { href: "/doctors", label: "Dentists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/patient-guide", label: "Patients", children: [
    { href: "/patient-guide", label: "Patient Guide", desc: "First visit, EMI & 365-day oral health plan" },
    { href: "/faqs", label: "FAQs", desc: "Answers to common questions" },
    { href: "/book-appointment", label: "Book Appointment", desc: "Pick a treatment, date & time" },
  ] },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as { href: string; label: string; children?: { href: string; label: string; desc: string }[] }[];

// ─────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────
export type Service = {
  slug: string;
  title: string;
  icon: string;
  category: "Restorative" | "Cosmetic" | "Orthodontic" | "Surgical" | "Preventive" | "Specialty";
  short: string;
  intro: string;
  idealFor: string[];
  benefits: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  keywords: string[];
};

export const SERVICE_GROUPS = [
  "Cosmetic Dentistry", "Endodontics", "General Dentistry", "Dental Implants", "Orthodontics",
  "Pediatric Dentistry", "Periodontics", "Prosthodontics", "Oral Care",
] as const;

const BASE_SERVICES: Service[] = [
  {
    slug: "dental-implants",
    title: "Dental Implants",
    icon: "implant",
    category: "Restorative",
    short: "Permanent, natural-looking replacements for missing teeth — anchored like real roots.",
    intro:
      "A dental implant is a biocompatible titanium post placed in the jawbone that acts like a natural tooth root. Once it bonds with the bone, a custom crown is fixed on top — giving you a tooth that looks, feels and chews like your own. Our implantologists and prosthodontists use digital planning for precise placement, offer sedation options for anxious patients, and treat everything from a single missing tooth to full-arch restorations — with same-day implants possible in selected cases.",
    idealFor: ["One or more missing teeth", "Loose or uncomfortable dentures", "Teeth that cannot be saved", "Patients wanting a fixed, long-term solution"],
    benefits: [
      { title: "Looks & feels natural", text: "Custom-shaded crowns blend seamlessly with your smile." },
      { title: "Protects your jawbone", text: "Implants stimulate the bone and help prevent bone loss." },
      { title: "No grinding of adjacent teeth", text: "Unlike bridges, neighbouring healthy teeth stay untouched." },
      { title: "Built to last", text: "With good care, implants can last for many years." },
    ],
    steps: [
      { title: "Consultation & 3D scan", text: "Clinical exam and imaging to assess bone and plan the implant position." },
      { title: "Implant placement", text: "A minor procedure under local anaesthesia to place the implant post." },
      { title: "Healing (osseointegration)", text: "The implant fuses with the bone over a few weeks to months." },
      { title: "Final crown", text: "A custom crown is fitted for a strong, natural-looking tooth." },
    ],
    faqs: [
      { q: "Is getting a dental implant painful?", a: "The procedure is done under local anaesthesia, so you should not feel pain during it. Mild soreness for a few days afterwards is normal and is managed with prescribed medication." },
      { q: "How long does the implant process take?", a: "It depends on your bone health and the case. Typically the full process takes from a few weeks to a few months, including healing time. Your dentist will give you a timeline at the consultation." },
      { q: "Are EMI options available for implants?", a: "Yes. Dental treatments at our clinic are available on easy EMI options (T&C apply). Ask our front desk for details." },
    ],
    keywords: ["dental implants Sahakarnagar", "tooth implant Bangalore", "implant dentist near me"],
  },
  {
    slug: "root-canal-treatment",
    title: "Root Canal Treatment",
    icon: "rootcanal",
    category: "Restorative",
    short: "Save an infected tooth and relieve pain with modern, comfortable root canal therapy.",
    intro:
      "Root canal treatment (RCT) removes infected or inflamed pulp from inside the tooth, disinfects the canals and seals them — saving your natural tooth. With rotary instruments, apex locators and effective anaesthesia, today's RCT is far more comfortable than its reputation suggests. Our endodontists handle simple and complex cases.",
    idealFor: ["Severe or lingering toothache", "Sensitivity to hot or cold", "Deep decay or a cracked tooth", "Swelling or abscess near a tooth"],
    benefits: [
      { title: "Saves your natural tooth", text: "Avoids extraction and the need for a replacement." },
      { title: "Relieves pain", text: "Removing infected pulp stops the source of pain." },
      { title: "Modern & comfortable", text: "Rotary endodontics make treatment faster and smoother." },
      { title: "Restores function", text: "A crown afterwards lets you bite and chew normally." },
    ],
    steps: [
      { title: "Diagnosis & X-ray", text: "We confirm the infection and examine the root canal anatomy." },
      { title: "Cleaning & shaping", text: "Infected pulp is removed and the canals are disinfected." },
      { title: "Sealing", text: "Canals are filled and sealed to prevent reinfection." },
      { title: "Crown", text: "A crown is usually placed to protect and strengthen the tooth." },
    ],
    faqs: [
      { q: "Does a root canal hurt?", a: "With local anaesthesia, most patients describe RCT as similar to getting a filling. Some tenderness for a few days afterwards is common." },
      { q: "How many visits are needed?", a: "Many root canals are completed in one or two visits, depending on the infection and the tooth." },
      { q: "Do I need a crown after a root canal?", a: "Back teeth usually need a crown because they become more brittle after RCT. Your dentist will advise based on your tooth." },
    ],
    keywords: ["root canal treatment Sahakarnagar", "RCT Bangalore", "painless root canal"],
  },
  {
    slug: "braces-orthodontics",
    title: "Braces & Orthodontics",
    icon: "braces",
    category: "Orthodontic",
    short: "Straighten crooked teeth and correct your bite with metal or ceramic braces.",
    intro:
      "Orthodontic treatment aligns teeth and jaws for a healthier bite and a more confident smile. Our orthodontist offers metal braces, tooth-coloured ceramic braces and retainers for children, teens and adults — with a personalised plan and regular progress reviews.",
    idealFor: ["Crowded or gapped teeth", "Overbite, underbite or crossbite", "Protruding front teeth", "Teens and adults"],
    benefits: [
      { title: "Healthier bite", text: "Proper alignment distributes biting forces evenly." },
      { title: "Easier cleaning", text: "Straight teeth are easier to brush and floss." },
      { title: "Discreet options", text: "Ceramic braces blend with your natural tooth colour." },
      { title: "Lasting results", text: "Retainers help keep your new smile in place." },
    ],
    steps: [
      { title: "Orthodontic assessment", text: "Photos, X-rays and impressions to understand your bite." },
      { title: "Treatment plan", text: "Choice of braces type and an estimated timeline." },
      { title: "Fitting & adjustments", text: "Braces are fitted and adjusted at regular visits." },
      { title: "Retention", text: "Retainers maintain the result after braces come off." },
    ],
    faqs: [
      { q: "What is the right age for braces?", a: "There is no upper age limit. Children are ideally assessed around age 7, but adults can get excellent results too." },
      { q: "How long do braces take?", a: "Most cases take between 12 and 24 months, depending on complexity." },
    ],
    keywords: ["braces Sahakarnagar", "orthodontist Bangalore", "ceramic braces"],
  },
  {
    slug: "clear-aligners-invisalign",
    title: "Clear Aligners & Invisalign",
    icon: "aligner",
    category: "Orthodontic",
    short: "Nearly invisible, removable aligners to straighten teeth without wires.",
    intro:
      "Clear aligners are a series of custom, transparent trays that gradually move your teeth into position. They're removable, so you can eat what you like and brush normally — and they're barely noticeable. A digital scan lets you preview your planned result before you begin.",
    idealFor: ["Working professionals", "Mild to moderate crowding or spacing", "Relapse after earlier braces", "Anyone wanting a discreet option"],
    benefits: [
      { title: "Nearly invisible", text: "Transparent trays are hard to notice in daily life." },
      { title: "Removable", text: "Take them out to eat, brush and floss." },
      { title: "Comfortable", text: "Smooth plastic — no brackets or wires." },
      { title: "Digital planning", text: "See a simulation of your expected result upfront." },
    ],
    steps: [
      { title: "Consultation & scan", text: "A digital scan replaces messy impressions." },
      { title: "Smile simulation", text: "Review your planned tooth movement." },
      { title: "Wear your aligners", text: "Switch trays as advised, wearing them 20–22 hours a day." },
      { title: "Retainers", text: "Keep your results with retainers." },
    ],
    faqs: [
      { q: "Are aligners as effective as braces?", a: "For many mild to moderate cases, yes. Complex cases may still be better treated with braces. Our orthodontist will advise what suits you." },
      { q: "How many hours a day must I wear them?", a: "Typically 20–22 hours a day. They should only be removed for eating, drinking anything other than water, and cleaning." },
    ],
    keywords: ["Invisalign Bangalore", "clear aligners Sahakarnagar", "invisible braces"],
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    icon: "sparkle",
    category: "Cosmetic",
    short: "Professional whitening for a visibly brighter smile — safely and quickly.",
    intro:
      "Professional teeth whitening safely lightens stains caused by tea, coffee, ageing and lifestyle. Unlike over-the-counter products, in-clinic whitening is supervised by a dentist, protects your gums and gives faster, more even results.",
    idealFor: ["Yellow or dull teeth", "Tea, coffee or tobacco stains", "Before weddings and events", "A quick confidence boost"],
    benefits: [
      { title: "Visible results", text: "Noticeably brighter teeth, often in a single session." },
      { title: "Dentist supervised", text: "Gums are protected and sensitivity is managed." },
      { title: "Even shade", text: "Professional gel gives uniform results." },
      { title: "Non-invasive", text: "No drilling and no change to tooth structure." },
    ],
    steps: [
      { title: "Shade check", text: "We record your current shade and check for decay." },
      { title: "Cleaning", text: "Surface stains and plaque are removed." },
      { title: "Whitening", text: "Professional gel is applied with gums protected." },
      { title: "Aftercare", text: "Tips to keep your smile bright for longer." },
    ],
    faqs: [
      { q: "Is teeth whitening safe?", a: "When done under dental supervision, whitening is considered safe. Some people get temporary sensitivity, which usually settles within a day or two." },
      { q: "How long do results last?", a: "Results commonly last from several months to a couple of years, depending on diet and habits such as tea, coffee and smoking." },
    ],
    keywords: ["teeth whitening Sahakarnagar", "teeth whitening Bangalore", "smile whitening"],
  },
  {
    slug: "cosmetic-dentistry-veneers",
    title: "Cosmetic Dentistry & Veneers",
    icon: "smile",
    category: "Cosmetic",
    short: "Smile makeovers, veneers and bonding designed around your face.",
    intro:
      "Cosmetic dentistry improves the colour, shape, size and alignment of your teeth. From porcelain veneers and composite bonding to complete smile makeovers, our cosmetic dentists design each smile to suit your facial features and personality.",
    idealFor: ["Chipped or worn teeth", "Gaps between teeth", "Uneven or discoloured teeth", "Complete smile makeovers"],
    benefits: [
      { title: "Custom smile design", text: "Planned around your face, lips and preferences." },
      { title: "Natural aesthetics", text: "Materials that mimic natural enamel." },
      { title: "Minimal preparation", text: "Conservative options whenever possible." },
      { title: "Confidence boost", text: "A smile you'll want to show off." },
    ],
    steps: [
      { title: "Smile consultation", text: "Discuss goals and assess teeth and gums." },
      { title: "Smile design", text: "Digital planning and, where needed, a trial smile." },
      { title: "Treatment", text: "Veneers, bonding or other procedures as planned." },
      { title: "Final polish", text: "Fine-tuning for a natural, balanced look." },
    ],
    faqs: [
      { q: "What is the difference between veneers and bonding?", a: "Veneers are thin custom shells (usually porcelain) bonded to the front of teeth. Bonding uses tooth-coloured composite resin applied directly. Veneers usually last longer, while bonding is quicker and more conservative." },
    ],
    keywords: ["cosmetic dentist Bangalore", "veneers Sahakarnagar", "smile makeover"],
  },
  {
    slug: "crowns-and-bridges",
    title: "Crowns & Bridges",
    icon: "crown",
    category: "Restorative",
    short: "Strong, natural-looking caps and bridges to restore damaged or missing teeth.",
    intro:
      "Crowns cover and protect weakened teeth, while bridges replace one or more missing teeth by anchoring to neighbouring teeth. We offer metal-ceramic, zirconia and all-ceramic options to balance strength, aesthetics and budget.",
    idealFor: ["Teeth after root canal treatment", "Broken or heavily filled teeth", "One or two missing teeth", "Worn-down teeth"],
    benefits: [
      { title: "Restores strength", text: "Protects weak teeth from fracturing." },
      { title: "Aesthetic materials", text: "Zirconia and ceramic look like natural teeth." },
      { title: "Precise fit", text: "Custom-made for a comfortable bite." },
      { title: "Durable", text: "Designed for long-term daily use." },
    ],
    steps: [
      { title: "Examination", text: "Assess the tooth and choose a material." },
      { title: "Preparation", text: "The tooth is shaped and an impression or scan is taken." },
      { title: "Temporary crown", text: "Protects the tooth while the final crown is made." },
      { title: "Final fitting", text: "The permanent crown or bridge is cemented." },
    ],
    faqs: [
      { q: "Which crown material is best?", a: "Zirconia offers excellent strength and aesthetics. All-ceramic is very natural-looking for front teeth. Your dentist will recommend the best option for your tooth position and bite." },
    ],
    keywords: ["dental crown Sahakarnagar", "zirconia crown Bangalore", "dental bridge"],
  },
  {
    slug: "pediatric-dentistry",
    title: "Paediatric Dentistry",
    icon: "kids",
    category: "Specialty",
    short: "Gentle, friendly dental care for infants, children and teens.",
    intro:
      "Our consultant pedodontist specialises in children's dental care — from the first tooth to the teenage years. We care for infants, toddlers and teens — from gum care and teething advice to sealants, fillings, extractions and dental trauma — using minimally invasive techniques in a child-friendly setting, so every visit is a positive experience.",
    idealFor: ["A child's first dental visit", "Cavities in milk teeth", "Teething and infant gum care", "Chipped or knocked-out teeth (dental trauma)", "Thumb-sucking and habit correction", "Preventive fluoride and sealants"],
    benefits: [
      { title: "Child-friendly approach", text: "Patient, gentle care that builds trust." },
      { title: "Prevention first", text: "Sealants and fluoride to protect young teeth." },
      { title: "Early detection", text: "Spot bite and growth issues early." },
      { title: "Parent guidance", text: "Practical home-care tips for parents." },
    ],
    steps: [
      { title: "Friendly introduction", text: "We help your child feel comfortable first." },
      { title: "Gentle check-up", text: "Examine teeth, gums and development." },
      { title: "Preventive care", text: "Cleaning, fluoride or sealants as needed." },
      { title: "Care plan", text: "Advice on diet, brushing and next visit." },
    ],
    faqs: [
      { q: "When should my child first see a dentist?", a: "Dental associations generally recommend a first visit by the first birthday or within six months of the first tooth appearing." },
      { q: "Do milk teeth need treatment if they will fall out?", a: "Yes. Milk teeth hold space for permanent teeth and help with chewing and speech. Untreated decay can cause pain and infection." },
    ],
    keywords: ["kids dentist Sahakarnagar", "pedodontist Bangalore", "children's dentist near me"],
  },
  {
    slug: "gum-care-periodontics",
    title: "Gum Care & Periodontics",
    icon: "gum",
    category: "Preventive",
    short: "Treatment for bleeding gums, gum disease and gum recession.",
    intro:
      "Healthy gums are the foundation of healthy teeth. Our periodontists diagnose and treat gum problems — from bleeding gums and bad breath to advanced periodontitis — with deep cleaning, laser-assisted therapy and gum surgery when needed.",
    idealFor: ["Bleeding gums while brushing", "Persistent bad breath", "Loose teeth", "Receding gums"],
    benefits: [
      { title: "Stops disease progression", text: "Early treatment helps prevent tooth loss." },
      { title: "Fresher breath", text: "Removing bacteria and tartar improves breath." },
      { title: "Specialist care", text: "Treated by experienced periodontists." },
      { title: "Supports overall health", text: "Gum health is linked to general wellbeing." },
    ],
    steps: [
      { title: "Gum evaluation", text: "Pocket depth measurements and X-rays." },
      { title: "Deep cleaning", text: "Scaling and root planing below the gumline." },
      { title: "Advanced therapy", text: "Laser or surgical treatment if required." },
      { title: "Maintenance", text: "Regular reviews to keep gums healthy." },
    ],
    faqs: [
      { q: "Why do my gums bleed when I brush?", a: "Bleeding gums are most often an early sign of gum inflammation (gingivitis) caused by plaque. It is usually reversible with professional cleaning and good home care, so it's worth getting checked." },
    ],
    keywords: ["bleeding gums treatment Bangalore", "periodontist Sahakarnagar", "gum disease treatment"],
  },
  {
    slug: "tooth-extraction-oral-surgery",
    title: "Extractions & Oral Surgery",
    icon: "surgery",
    category: "Surgical",
    short: "Painless extractions, wisdom tooth removal and maxillofacial surgery.",
    intro:
      "Our oral and maxillofacial surgeons perform simple and surgical extractions, impacted wisdom tooth removal, minor oral surgical procedures and facial trauma care in a safe, sterile environment following Apollo protocols.",
    idealFor: ["Impacted or painful wisdom teeth", "Badly broken teeth", "Cysts or minor oral lesions", "Facial or jaw trauma"],
    benefits: [
      { title: "Specialist surgeons", text: "MDS oral & maxillofacial surgeons." },
      { title: "Comfort focused", text: "Effective anaesthesia and gentle technique." },
      { title: "Sterile environment", text: "Strict Apollo sterilisation protocols." },
      { title: "Clear aftercare", text: "Step-by-step recovery guidance." },
    ],
    steps: [
      { title: "Assessment & X-ray", text: "Plan the safest approach for the extraction." },
      { title: "Anaesthesia", text: "The area is numbed for a comfortable procedure." },
      { title: "Procedure", text: "Tooth removed carefully; stitches if needed." },
      { title: "Recovery", text: "Aftercare instructions and a follow-up review." },
    ],
    faqs: [
      { q: "Should all wisdom teeth be removed?", a: "No. Wisdom teeth are usually removed only if they are impacted, causing pain, infection or damage to nearby teeth. An X-ray helps decide." },
    ],
    keywords: ["wisdom tooth removal Bangalore", "tooth extraction Sahakarnagar", "oral surgeon"],
  },
  {
    slug: "dentures-prosthodontics",
    title: "Dentures & Prosthodontics",
    icon: "denture",
    category: "Restorative",
    short: "Comfortable complete, partial and implant-supported dentures.",
    intro:
      "Our prosthodontists restore missing teeth with well-fitting complete dentures, partial dentures and implant-supported overdentures — focused on comfort, chewing ability and a natural appearance.",
    idealFor: ["Multiple missing teeth", "Old, loose dentures", "Difficulty chewing", "Patients not ready for many implants"],
    benefits: [
      { title: "Natural look", text: "Teeth and gums matched to your features." },
      { title: "Better chewing", text: "Restores the ability to eat a range of foods." },
      { title: "Implant options", text: "Implant-retained dentures for extra stability." },
      { title: "Custom fit", text: "Carefully adjusted for comfort." },
    ],
    steps: [
      { title: "Examination", text: "Assess gums, bone and remaining teeth." },
      { title: "Impressions & bite", text: "Accurate records for a precise fit." },
      { title: "Trial", text: "Try-in to check appearance and bite." },
      { title: "Delivery & review", text: "Final denture with follow-up adjustments." },
    ],
    faqs: [
      { q: "How long does it take to get used to dentures?", a: "Most people adapt within a few weeks. Minor adjustments in follow-up visits help improve comfort." },
    ],
    keywords: ["dentures Sahakarnagar", "prosthodontist Bangalore", "implant supported dentures"],
  },
  {
    slug: "laser-dentistry",
    title: "Laser Dentistry",
    icon: "laser",
    category: "Specialty",
    short: "Precise, minimally invasive laser treatments for gums and soft tissue.",
    intro:
      "Dental lasers allow precise treatment of gums and soft tissues with less bleeding and often faster healing. Lasers can be used in gum contouring, gum disease therapy, frenectomy and certain other procedures.",
    idealFor: ["Gum contouring (gummy smile)", "Gum disease therapy", "Tongue-tie / frenectomy", "Minor soft-tissue procedures"],
    benefits: [
      { title: "Minimally invasive", text: "Precise treatment with less tissue trauma." },
      { title: "Less bleeding", text: "Lasers seal small blood vessels as they work." },
      { title: "Faster healing", text: "Often quicker recovery for soft-tissue procedures." },
      { title: "Fewer stitches", text: "Many procedures need no sutures." },
    ],
    steps: [
      { title: "Evaluation", text: "Confirm laser treatment suits your case." },
      { title: "Preparation", text: "Protective eyewear and local anaesthesia as needed." },
      { title: "Laser procedure", text: "Precise, controlled treatment." },
      { title: "Aftercare", text: "Simple instructions for smooth healing." },
    ],
    faqs: [
      { q: "Is laser dentistry safe?", a: "Yes, when performed by trained dentists with proper eye protection and settings. It is widely used for soft-tissue procedures." },
    ],
    keywords: ["laser dentistry Bangalore", "gum contouring Sahakarnagar"],
  },
  {
    slug: "teeth-cleaning-general-dentistry",
    title: "Teeth Cleaning & Check-ups",
    icon: "clean",
    category: "Preventive",
    short: "Scaling, polishing, fillings and routine exams to keep problems away.",
    intro:
      "Preventive care is the most effective — and economical — way to keep your smile healthy. Regular check-ups, professional cleaning (scaling and polishing) and tooth-coloured fillings catch problems early, before they become painful or costly.",
    idealFor: ["Routine 6-monthly check-ups", "Tartar and stains", "Small cavities", "Sensitive teeth"],
    benefits: [
      { title: "Early detection", text: "Find cavities and gum issues early." },
      { title: "Fresh, clean feel", text: "Remove tartar that brushing can't." },
      { title: "Tooth-coloured fillings", text: "Natural-looking composite restorations." },
      { title: "Saves money", text: "Prevention costs less than major treatment." },
    ],
    steps: [
      { title: "Examination", text: "Check teeth, gums, bite and soft tissues." },
      { title: "Scaling", text: "Remove plaque and tartar build-up." },
      { title: "Polishing", text: "Smooth surfaces and remove light stains." },
      { title: "Advice", text: "Personalised home-care recommendations." },
    ],
    faqs: [
      { q: "How often should I get my teeth cleaned?", a: "Most people benefit from a check-up and cleaning every six months, though your dentist may suggest a different interval based on your gum health." },
    ],
    keywords: ["teeth cleaning Sahakarnagar", "dentist near me Sahakarnagar", "dental check-up Bangalore"],
  },
];

// Groups, sub-services and old (.php) URLs from the live site
const SERVICE_META: Record<string, { group: (typeof SERVICE_GROUPS)[number]; subServices: string[]; legacy: string[] }> = {
  "dental-implants": { group: "Dental Implants", subServices: ["Single-tooth implants", "Full-arch restorations", "Same-day implants (selected cases)", "Implant-supported dentures"], legacy: ["dental-implants-in-sahakara-nagar"] },
  "root-canal-treatment": { group: "Endodontics", subServices: ["Root canal treatment", "Endodontic re-treatment", "Post & core"], legacy: ["endodontist-in-sahakara-nagar", "root-canal-treatment-in-sahakara-nagar"] },
  "braces-orthodontics": { group: "Orthodontics", subServices: ["Metal braces", "Ceramic braces", "Dental retainers"], legacy: ["orthodontic-clinic-in-sahakara-nagar", "dental-braces-in-sahakara-nagar", "dental-retainers-in-sahakara-nagar"] },
  "clear-aligners-invisalign": { group: "Orthodontics", subServices: ["Invisalign", "Clear aligners", "Retainers"], legacy: ["invisalign-provider-in-sahakara-nagar"] },
  "teeth-whitening": { group: "Cosmetic Dentistry", subServices: ["In-clinic whitening", "Stain removal & polishing"], legacy: ["teeth-whitening-clinic-in-sahakara-nagar"] },
  "cosmetic-dentistry-veneers": { group: "Cosmetic Dentistry", subServices: ["Dental veneers", "Dental bonding", "Smile makeover"], legacy: ["cosmetic-dentist-in-sahakara-nagar", "dental-veneers-in-sahakara-nagar", "dental-bonding-in-sahakara-nagar", "smile-makeover-in-sahakara-nagar"] },
  "crowns-and-bridges": { group: "Cosmetic Dentistry", subServices: ["Zirconia crowns", "Ceramic crowns", "Dental bridges"], legacy: ["dental-crowns-and-bridges-in-sahakara-nagar"] },
  "pediatric-dentistry": { group: "Pediatric Dentistry", subServices: ["Infant & teething care", "Fluoride & sealants", "Fillings for kids", "Dental trauma care", "Orthodontic evaluation"], legacy: ["pediatric-dentist-in-sahakar-nagar"] },
  "gum-care-periodontics": { group: "Periodontics", subServices: ["Bleeding gums treatment", "Deep cleaning (scaling & root planing)", "Gum surgery"], legacy: ["periodontal-treatments-in-sahakara-nagar", "bleeding-gums-treatment-in-sahakara-nagar"] },
  "tooth-extraction-oral-surgery": { group: "General Dentistry", subServices: ["Painless extraction", "Wisdom tooth removal", "Minor oral surgical procedures", "Oral maxillofacial surgery", "Facial trauma surgery"], legacy: ["painless-tooth-extraction-in-sahakarnagar", "dental-surgeon-in-sahakara-nagar"] },
  "dentures-prosthodontics": { group: "Prosthodontics", subServices: ["Complete dentures", "Partial dentures", "Maxillofacial prosthetics"], legacy: ["prosthodontist-in-sahakara-nagar", "dentures-in-sahakara-nagar", "maxillofacial-prosthetics-in-sahakara-nagar"] },
  "laser-dentistry": { group: "Oral Care", subServices: ["Gum contouring", "Laser gum therapy", "Frenectomy"], legacy: [] },
  "teeth-cleaning-general-dentistry": { group: "General Dentistry", subServices: ["Teeth cleaning", "Dental examination", "Fillings / restorations", "Oral care advice"], legacy: ["general-dentistry-in-sahakaranagar", "teeth-cleaning-in-sahakara-nagar", "dental-examination-in-sahakara-nagar", "dental-fillings-in-sahakara-nagar", "oral-care-in-sahakara-nagar"] },
};

export type FullService = Service & (typeof SERVICE_META)[string];
export const SERVICES: FullService[] = BASE_SERVICES.map((s) => ({ ...s, ...SERVICE_META[s.slug] }));
export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

// ─────────────────────────────────────────────────────────────
// Doctors
// ─────────────────────────────────────────────────────────────
// Photos are downloaded from the live site by `npm run fetch-images` into /public/images/doctors.
// Photo ↔ name mapping follows the order on the live site — please verify (some live alt texts are wrong).
export type Doctor = { name: string; qual: string; role: string; photo?: string; award?: string };
export const DOCTORS: Doctor[] = [
  { name: "Dr. Pranab Kumar Roy", qual: "BDS (Cal), FCIP", role: "Dental Surgeon & Implantologist", photo: "/images/doctors/d1.jpg" },
  { name: "Dr. Siddharth Narayan", qual: "MDS", role: "Periodontist", photo: "/images/doctors/d2.jpg" },
  { name: "Dr. Apoorva Ramchandran", qual: "MDS", role: "Consultant Pedodontist", photo: "/images/doctors/d3.jpg" },
  { name: "Dr. Harsha Puttaraju", qual: "MDS", role: "Orthodontist", photo: "/images/doctors/d5.jpg" },
  { name: "Dr. Akshatha V", qual: "BDS, MDS (Prosthodontics)", role: "Prosthodontist & Implantologist", photo: "/images/doctors/d8.jpg" },
  { name: "Dr. Shraddha Patil", qual: "BDS, MDS", role: "Prosthodontist", photo: "/images/doctors/d10.jpeg" },
  { name: "Dr. Amul Gandhi", qual: "BDS, MDS", role: "Oral & Maxillofacial Surgeon", photo: "/images/doctors/d12.jpeg" },
  { name: "Dr. Somangshu Chakraborty", qual: "MDS, FMFT", role: "Oral & Maxillofacial Surgeon", photo: "/images/doctors/d13.jpeg" },
  { name: "Dr. Chandan K P", qual: "BDS, MDS", role: "Conservative Dentist & Endodontist", photo: "/images/doctors/d15.png" },
  { name: "Dr. Adarsh K", qual: "BDS, MDS", role: "Conservative Dentist & Endodontist", photo: "/images/doctors/d15.jpg" },
  { name: "Dr. Jharna Bharali", qual: "MDS", role: "Periodontist & Oral Implantologist", photo: "/images/doctors/d16.jpeg", award: "Award for Excellence in Periodontal Surgery & Patient Care (2026)" },
];

// Clinic photos (downloaded by `npm run fetch-images` into /public/images/clinic)
export const GALLERY = [
  { src: "/images/clinic/b4.jpg", caption: "Apollo Dental Sahakarnagar", tag: "Clinic" },
  { src: "/images/clinic/b2.jpg", caption: "Our clinic", tag: "Clinic" },
  { src: "/images/clinic/abt1.jpeg", caption: "Inside the clinic", tag: "Clinic" },
  { src: "/images/clinic/ab.jpg", caption: "Apollo Dental", tag: "Clinic" },
  { src: "/images/clinic/ab1.jpeg", caption: "Treatment area", tag: "Facilities" },
  { src: "/images/clinic/ab2.jpeg", caption: "Dental chair & equipment", tag: "Facilities" },
  { src: "/images/clinic/ab3.jpeg", caption: "Sterile environment", tag: "Facilities" },
  { src: "/images/clinic/ab4.jpeg", caption: "Patient care", tag: "Facilities" },
  { src: "/images/clinic/flyer-1.jpg", caption: "Services at Apollo Dental Sahakarnagar", tag: "Brochure" },
  { src: "/images/clinic/flyer-2.jpg", caption: "Our services & EMI options", tag: "Brochure" },
];

export const TESTIMONIALS = [
  { name: "Anjali R.", text: "The staff were friendly and welcoming, and my treatment was completely pain-free. I'd happily recommend Apollo Dental Sahakarnagar.", treatment: "Patient" },
  { name: "Rajesh K.", text: "The doctors explained everything clearly before starting and made me feel comfortable throughout. Very professional clinic.", treatment: "Patient" },
];

export const HOME_FAQS = [
  { q: "Where is Apollo Dental Sahakarnagar located?", a: "We are at 26, 1st Floor, Block G, 60th Main Road, Sahakarnagar, Bengaluru – 560092, next to Big Market." },
  { q: "What are the clinic timings?", a: "Monday to Saturday 9:30 AM – 8:30 PM, and Sunday 9:30 AM – 5:00 PM." },
  { q: "How do I book an appointment?", a: "Call +91 98450 55386 or 080 4150 0111, message us on WhatsApp, or fill in the appointment form on this website and our team will call you back." },
  { q: "Do you offer EMI for dental treatment?", a: "Yes, dental treatments are available on easy EMI options. Terms and conditions apply — ask our front desk for details." },
  { q: "Do you treat children?", a: "Yes. Our consultant pedodontist provides gentle, child-friendly dental care from the first tooth to the teenage years." },
  { q: "Is Apollo Dental Sahakarnagar part of Apollo Hospitals?", a: "Yes. Apollo Dental is the dental care network of The Apollo Hospitals Group, delivering comprehensive dental services in a safe and sterile environment." },
];

// ─────────────────────────────────────────────────────────────
// FAQ page (grouped)
// ─────────────────────────────────────────────────────────────
export const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  { title: "About the clinic", items: HOME_FAQS.filter((f) => !/EMI|book/i.test(f.q)) },
  {
    title: "Appointments & payments",
    items: [
      ...HOME_FAQS.filter((f) => /EMI|book/i.test(f.q)),
      { q: "Can I walk in without an appointment?", a: "Walk-ins are welcome, but booking ahead helps you avoid waiting and ensures the right specialist is available." },
      { q: "Do you see patients on Sundays?", a: "Yes. The clinic is open on Sundays from 9:30 AM to 5:00 PM." },
      { q: "What payment methods do you accept?", a: "Please ask our front desk for current payment options, including EMI plans for treatment (T&C apply)." },
      { q: "What is the 365 Days Oral Health Plan?", a: "It's Apollo Dental's year-round oral health plan. Ask our front desk for the current inclusions and how to enrol." },
      { q: "What should I do in a dental emergency?", a: "Call us immediately on +91 98450 55386. For severe facial swelling, difficulty breathing or heavy bleeding, go to the nearest hospital emergency department." },
    ],
  },
  { title: "Treatments", items: BASE_SERVICES.filter((s) => s.slug !== "pediatric-dentistry").flatMap((s) => s.faqs) },
  { title: "Kids' dentistry", items: BASE_SERVICES.find((s) => s.slug === "pediatric-dentistry")!.faqs },
];

// ─────────────────────────────────────────────────────────────
// Official clinic flyer content (source of truth for timings & service lists)
// ─────────────────────────────────────────────────────────────
export const FLYER = {
  headline: "Making India Smile Through Expert Dental Care",
  sub: "Comprehensive world class dental services in safe and sterile environment from The Apollo Hospitals Group",
  servicesTitle: "Services available at Apollo Dental Clinic, Sahakar Nagar, Bangalore",
  servicesAvailable: [
    { label: "Teeth Cleaning", icon: "clean", href: "/services/teeth-cleaning-general-dentistry" },
    { label: "Dentures", icon: "denture", href: "/services/dentures-prosthodontics" },
    { label: "Implants", icon: "implant", href: "/services/dental-implants" },
    { label: "Teeth Whitening", icon: "sparkle", href: "/services/teeth-whitening" },
    { label: "Braces / Invisalign", icon: "braces", href: "/services/braces-orthodontics" },
    { label: "Minor Oral Surgical Procedures", icon: "surgery", href: "/services/tooth-extraction-oral-surgery" },
    { label: "Root Canal", icon: "rootcanal", href: "/services/root-canal-treatment" },
    { label: "Fillings / Restorations", icon: "clean", href: "/services/teeth-cleaning-general-dentistry" },
    { label: "Extractions", icon: "surgery", href: "/services/tooth-extraction-oral-surgery" },
    { label: "Veneers / Crowns", icon: "crown", href: "/services/crowns-and-bridges" },
    { label: "Cosmetic / Aesthetic Dentistry", icon: "smile", href: "/services/cosmetic-dentistry-veneers" },
    { label: "Facial Trauma Surgery", icon: "surgery", href: "/services/tooth-extraction-oral-surgery" },
  ],
  ourServices: [
    { label: "Paediatric Dentistry", icon: "kids", href: "/services/pediatric-dentistry" },
    { label: "Braces", icon: "braces", href: "/services/braces-orthodontics" },
    { label: "Aligners", icon: "aligner", href: "/services/clear-aligners-invisalign" },
    { label: "Root Canal", icon: "rootcanal", href: "/services/root-canal-treatment" },
    { label: "Extractions", icon: "surgery", href: "/services/tooth-extraction-oral-surgery" },
    { label: "Implants", icon: "implant", href: "/services/dental-implants" },
    { label: "Crowns & Bridges", icon: "crown", href: "/services/crowns-and-bridges" },
    { label: "Oral Maxillofacial Surgery", icon: "surgery", href: "/services/tooth-extraction-oral-surgery" },
    { label: "Gum Care", icon: "gum", href: "/services/gum-care-periodontics" },
    { label: "Lasers", icon: "laser", href: "/services/laser-dentistry" },
    { label: "Cosmetic Dentistry", icon: "smile", href: "/services/cosmetic-dentistry-veneers" },
    { label: "Oral Health Plan (365 Days)", icon: "clean", href: "/patient-guide" },
  ],
  emi: "Dental Treatments are now available in easy EMI* Options",
  emiNote: "*T&C Apply",
  parentWebsite: { label: "www.apollodental.in", href: "https://www.apollodental.in" },
  // Flyer also lists Twitter, LinkedIn and YouTube — add URLs to CLINIC.social when available
};

// ─────────────────────────────────────────────────────────────
// Google reviews (5-star, from the clinic's Google Business profile).
// Text kept as written; only obvious typos fixed and truncated reviews cut at a sentence end.
// ─────────────────────────────────────────────────────────────
export type Review = { name: string; text: string; tag: string };
export const REVIEWS: Review[] = [
  { name: "Samaali N.", tag: "Gum cleaning", text: "I had a gum cleaning procedure at Apollo clinic Sahakar Nagar and the doctor Puneet was extremely gentle and professional. He made me feel comfortable throughout the treatment and took great care during the procedure. Highly recommended!" },
  { name: "Vishnu V. A.", tag: "Consultation", text: "Dr. Puneet and Dr. Akhila were very professional, explained the medical relevance, procedures and costs associated very much in detail and transparently. The staff were friendly and very helpful!" },
  { name: "Rashmi H.", tag: "Treatment", text: "Dr Jharna Bharali is excellent and she was very patient in explaining the process and she took real good care of me. She did not rush with the process and she made sure that I understood everything." },
  { name: "Priyanjali M.", tag: "Treatment", text: "I had a great experience with Dr. Shraddha and Dr. Jharna. They were professional, kind, and made me feel comfortable throughout my treatment. They explained everything clearly and took excellent care of me." },
  { name: "Srinivas R.", tag: "Kids' check-up", text: "We had a great experience with Dr. Sweety and Dr. Shraddha. They took wonderful care of my children during their dental check-up and cleaning." },
  { name: "Vibha V.", tag: "Root canal & cap", text: "They did an excellent job with my grandmother's root canal and cap, making her feel comfortable and well cared for throughout the process. The treatment was smooth, professional, and handled with great patience." },
  { name: "Praveen G. K.", tag: "Scaling", text: "Very professional and clean setup. Great experience with Dr. Jharna and Bhargavi who did a great job during the scaling procedure and detailed consultation afterwards." },
  { name: "Nuha M.", tag: "Cleaning", text: "The doctor and nurse were very polite, professional, and made the whole process comfortable. The clinic is well maintained and spotlessly clean. All the staff were extremely kind and helpful from start to finish." },
  { name: "Sudeep", tag: "Patient", text: "Docs here made me feel super comfortable. I strongly recommend this place. Staff and doctors put patients first." },
  { name: "Kanika S.", tag: "Teeth cleaning", text: "I got my teeth cleaning done from Dr Shraddha Patil. It was a very smooth experience with meagre amount of pain. She was very cooperative and patient during the procedure." },
  { name: "Geetha T.", tag: "Prosthodontics", text: "Excellent treatment experience. Dr Shraddha, the prosthodontist, made me feel comfortable throughout and paid great attention to detail. The results were natural and exceeded my expectations." },
  { name: "Vinay S.", tag: "Scaling & fillings", text: "I had a good experience, scaling and fillings were done with minimal pain. Dr Jharna explained everything patiently." },
  { name: "Aditi M.", tag: "Consultation", text: "Dr. Shraddha takes time to explain the problem and treatment options in detail. Her approach is honest and reassuring. I felt confident and well cared for." },
  { name: "Raksha H.", tag: "First visit", text: "Dr Mohamed Imran was super skilled & caring. Dr Prashant made me feel comfortable although it was my first visit to this clinic. Seeing their reasonable prices, I am going to be their regular customer." },
  { name: "Srinivasan K.", tag: "Cleaning", text: "The doctor explained the process in detail. Dr Shraddha's cleaning procedure was very professional. I quite liked the shining part that was done at the end. Feel fresh and clean." },
  { name: "Ravi N.", tag: "Cleaning & cavity", text: "Consulted Dr Shraddha for cleaning and cavity issues. She was very patient and careful throughout the procedure. Recommend 100% for all dental problems." },
  { name: "Swapna R.", tag: "Kids' dentistry", text: "Dr. Shraddha is very co-operative and treated my kid well. Thank you! I recommend her for anyone who requires dental treatment." },
  { name: "Sudhir J.", tag: "Consultation", text: "Had a very good explanation on the condition of the teeth and the treatment that would be done. Once we are inside, we feel we are not connected to the outside world. It is calm and the hygiene is good." },
  { name: "Anirudh S.", tag: "Patient", text: "Had a great experience with Dr. Puneet. He was very helpful and kind." },
  { name: "Aditi", tag: "Dental cleaning", text: "My visit for a dental cleaning was excellent. The dentist and assistant were very professional, making the procedure smooth and comfortable. The entire team was friendly and supportive throughout the visit." },
];
