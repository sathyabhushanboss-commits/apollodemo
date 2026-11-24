import type { Metadata } from "next";
import { PageHero } from "@/components/shared";
import { CookieSettingsButton } from "@/components/client";

export const metadata: Metadata = { title: "Cookie Policy", description: "The cookies used on the Apollo Dental Sahakarnagar website and how to manage your preferences.", alternates: { canonical: "/cookie-policy" } };

const rows = [
  ["adsn_consent", "Necessary", "Stores your cookie preferences", "6 months"],
  ["adsn_popup_dismissed", "Necessary", "Stops the appointment popup reappearing after you close it", "24 hours"],
  ["adsn_lead_done", "Necessary", "Remembers you've already submitted an enquiry", "30 days"],
  ["adsn_admin", "Necessary", "Keeps clinic staff signed in to the admin panel", "Session / 7 days"],
  ["_ga, _ga_*", "Analytics (optional)", "Google Analytics — anonymous usage statistics", "Up to 2 years"],
];

export default function CookiePolicy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" crumbs={[{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }]} />
      <section className="container-x max-w-4xl py-16">
        <div className="prose-blog">
          <p>Cookies are small text files stored on your device. We use them to make this website work, remember your choices and — only with your consent — understand how the site is used.</p>
          <h2>Cookies we use</h2>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Cookie</th><th className="p-4">Category</th><th className="p-4">Purpose</th><th className="p-4">Duration</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`p-4 ${i === 0 ? "font-mono text-xs font-semibold text-ink" : "text-slate-600"}`}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <div className="prose-blog mt-8">
          <h2>Managing your preferences</h2>
          <p>You can change your choice at any time using the button below or the &quot;Cookie settings&quot; link in the footer. You can also block or delete cookies in your browser settings.</p>
        </div>
        <CookieSettingsButton className="btn-primary mt-6" />
      </section>
    </>
  );
}
