import type { Metadata } from "next";
import { CLINIC } from "@/lib/site";
import { PageHero } from "@/components/shared";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Apollo Dental Sahakarnagar collects, uses and protects your personal information.", alternates: { canonical: "/privacy-policy" } };

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" crumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
      <section className="container-x max-w-3xl py-16">
        <div className="prose-blog">
          <p>This policy explains how {CLINIC.name} (&quot;we&quot;, &quot;us&quot;) handles personal information collected through this website, in line with India&apos;s Digital Personal Data Protection Act, 2023.</p>
          <h2>Information we collect</h2>
          <ul>
            <li><strong>Details you submit</strong> — name, mobile number, email, preferred treatment, preferred date and any message you send through our forms.</li>
            <li><strong>Technical data</strong> — the page you submitted a form from and, if present, campaign parameters (such as utm_source) to understand how you found us.</li>
            <li><strong>Cookies</strong> — see our Cookie Policy for details.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To contact you about your appointment request by call, SMS or WhatsApp.</li>
            <li>To improve our website and services.</li>
            <li>We do not sell your personal information.</li>
          </ul>
          <h2>Retention & security</h2>
          <p>We keep enquiry data only as long as needed for the purpose it was collected, and protect it with reasonable technical and organisational safeguards.</p>
          <h2>Your rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data, and withdraw consent at any time, by emailing {CLINIC.email} or calling {CLINIC.phones[0].display}.</p>
          <h2>Medical disclaimer</h2>
          <p>Content on this website is for general information only and is not a substitute for professional diagnosis or treatment.</p>
          <p>Questions about this policy? Contact us at {CLINIC.email}.</p>
        </div>
      </section>
    </>
  );
}
