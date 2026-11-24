"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogOut, Download, Search, Trash2, Users, FileText, Phone, Plus, ExternalLink, Loader2, Inbox, CalendarCheck, PhoneCall } from "lucide-react";
import type { Lead, Post } from "@/lib/db";

const STATUS: Record<string, string> = {
  new: "bg-accent-100 text-accent-700", contacted: "bg-sky-100 text-sky-700", booked: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-600", spam: "bg-red-100 text-red-600",
};
const COVERS = [
  "from-sky-700 via-cyan-600 to-teal-500", "from-orange-600 via-orange-500 to-amber-400", "from-indigo-700 via-blue-600 to-sky-500",
  "from-emerald-700 via-teal-600 to-cyan-500", "from-pink-600 via-rose-500 to-orange-400", "from-slate-800 via-sky-800 to-cyan-600",
];

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setLoading(false);
    if (r.ok) router.refresh(); else setErr("Incorrect password");
  }
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-gradient-to-br from-brand-900 to-brand-950 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/logo.png" alt="Apollo Dental" width={90} height={65} className="h-12 w-auto" />
        <h1 className="mt-6 text-2xl font-extrabold text-ink">Clinic admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage leads and blog posts.</p>
        <label className="mt-6 block"><span className="sr-only">Password</span>
          <div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="input pl-11" autoFocus /></div>
        </label>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button className="btn-primary mt-5 w-full" disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}</button>
        <Link href="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-brand-700">← Back to website</Link>
      </form>
    </div>
  );
}

export function AdminDashboard({ leads: initialLeads, posts: initialPosts }: { leads: Lead[]; posts: Post[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "posts">("leads");
  const [leads, setLeads] = useState(initialLeads);
  const [posts, setPosts] = useState(initialPosts);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => leads.filter((l) =>
    (filter === "all" || l.status === filter) &&
    (!q || [l.name, l.phone, l.email, l.service, l.source].join(" ").toLowerCase().includes(q.toLowerCase()))
  ), [leads, q, filter]);

  const stats = [
    { l: "Total leads", v: leads.length, I: Inbox },
    { l: "New", v: leads.filter((l) => l.status === "new").length, I: Users },
    { l: "Contacted", v: leads.filter((l) => l.status === "contacted").length, I: PhoneCall },
    { l: "Booked", v: leads.filter((l) => l.status === "booked").length, I: CalendarCheck },
  ];

  async function setStatus(id: number, status: string) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }
  async function removeLead(id: number) {
    if (!confirm("Delete this lead?")) return;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
  }
  async function removePost(id: number) {
    if (!confirm("Delete this post?")) return;
    setPosts((ps) => ps.filter((p) => p.id !== id));
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
  }
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }
  function exportCsv() {
    const cols: (keyof Lead)[] = ["id", "created_at", "name", "phone", "email", "service", "preferred_date", "preferred_time", "message", "source", "page", "utm", "status"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `apollo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Apollo Dental" width={60} height={43} className="h-9 w-auto" />
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="btn-ghost py-2 text-xs"><ExternalLink size={14} /> View site</Link>
            <button onClick={logout} className="btn-ghost py-2 text-xs"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ l, v, I }) => (
            <div key={l} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-slate-500"><span className="text-sm">{l}</span><I size={18} /></div>
              <p className="mt-2 text-3xl font-extrabold text-ink">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2">
          {[{ k: "leads", l: "Leads", I: Users }, { k: "posts", l: "Blog posts", I: FileText }].map(({ k, l, I }) => (
            <button key={k} onClick={() => setTab(k as "leads" | "posts")} className={`btn py-2.5 ${tab === k ? "bg-brand-800 text-white" : "border border-slate-200 bg-white text-slate-600"}`}><I size={16} /> {l}</button>
          ))}
        </div>

        {tab === "leads" ? (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
              <div className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, treatment…" className="input py-2.5 pl-10" /></div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto py-2.5">
                <option value="all">All statuses</option>{Object.keys(STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={exportCsv} className="btn-dark py-2.5"><Download size={15} /> Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr><th className="p-4">Received</th><th className="p-4">Patient</th><th className="p-4">Treatment</th><th className="p-4">Source</th><th className="p-4">Message</th><th className="p-4">Status</th><th className="p-4" /></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((l) => (
                    <tr key={l.id} className="align-top hover:bg-slate-50/60">
                      <td className="whitespace-nowrap p-4 text-xs text-slate-500">{new Date(l.created_at.replace(" ", "T") + "Z").toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                      <td className="p-4">
                        <p className="font-semibold text-ink">{l.name}</p>
                        <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-brand-700"><Phone size={12} /> {l.phone}</a>
                        <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noopener" className="text-xs text-emerald-600">WhatsApp ↗</a>
                        {l.email && <p className="text-xs text-slate-500">{l.email}</p>}
                      </td>
                      <td className="p-4">{l.service || "—"}{l.preferred_date && <p className="text-xs text-slate-500">Pref: {l.preferred_date} {l.preferred_time || ""}</p>}</td>
                      <td className="p-4"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium">{l.source}</span><p className="mt-1 text-xs text-slate-400">{l.page}</p>{l.utm && <p className="mt-1 max-w-[160px] truncate text-[10px] text-slate-400" title={l.utm}>{l.utm}</p>}</td>
                      <td className="max-w-[220px] p-4 text-xs text-slate-600">{l.message || "—"}</td>
                      <td className="p-4">
                        <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className={`rounded-full border-0 px-3 py-1 text-xs font-bold capitalize ${STATUS[l.status]}`}>
                          {Object.keys(STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="p-4"><button onClick={() => removeLead(l.id)} className="text-slate-400 hover:text-red-600" aria-label="Delete lead"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="p-10 text-center text-slate-500">No leads yet. Submit a form on the site to test.</p>}
            </div>
          </section>
        ) : (
          <PostsPanel posts={posts} onCreated={() => router.refresh()} onDelete={removePost} setPosts={setPosts} />
        )}
      </main>
    </div>
  );
}

function PostsPanel({ posts, onDelete, setPosts }: { posts: Post[]; onCreated: () => void; onDelete: (id: number) => void; setPosts: React.Dispatch<React.SetStateAction<Post[]>> }) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState(COVERS[0]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setSaving(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const r = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, cover }) });
    const j = await r.json(); setSaving(false);
    if (!r.ok) return setErr(j.error);
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    setPosts((ps) => [{ id: j.id, slug: j.slug, title: String(data.title), excerpt: String(data.excerpt || ""), content: "", category: String(data.category || "Oral Care"), author: String(data.author || "Apollo Dental Team"), cover, tags: String(data.tags || ""), published: 1, created_at: now, updated_at: now }, ...ps]);
    form.reset(); setOpen(false);
  }

  return (
    <section className="mt-6 space-y-6">
      <button onClick={() => setOpen(!open)} className="btn-primary"><Plus size={16} /> New blog post</button>
      {open && (
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
          <input name="title" placeholder="Title *" className="input md:col-span-2" required />
          <input name="category" placeholder="Category (e.g. Implants)" className="input" />
          <input name="author" placeholder="Author (e.g. Dr. Akshatha V)" className="input" />
          <input name="tags" placeholder="SEO tags, comma separated" className="input" />
          <input name="slug" placeholder="Custom URL slug (optional)" className="input" />
          <textarea name="excerpt" rows={2} placeholder="Short excerpt / meta description (≈155 chars)" className="input md:col-span-2" maxLength={180} />
          <textarea name="content" rows={12} required placeholder={"Content *\n\nUse:\n## Heading\n### Sub heading\n- bullet point\n**bold text**\n\nBlank line = new paragraph"} className="input font-mono text-xs md:col-span-2" />
          <div className="md:col-span-2">
            <p className="mb-2 text-xs font-semibold text-slate-500">Cover colour</p>
            <div className="flex gap-2">{COVERS.map((c) => <button type="button" key={c} onClick={() => setCover(c)} className={`h-10 w-16 rounded-lg bg-gradient-to-br ${c} ${cover === c ? "ring-4 ring-accent-400" : ""}`} aria-label="Choose cover" />)}</div>
          </div>
          {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}
          <div className="md:col-span-2"><button className="btn-dark" disabled={saving}>{saving ? <Loader2 size={16} className="animate-spin" /> : "Publish post"}</button></div>
        </form>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-0">
            <span className={`h-12 w-16 shrink-0 rounded-lg bg-gradient-to-br ${p.cover}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{p.title}</p>
              <p className="text-xs text-slate-500">{p.category} · {p.author} · {p.created_at.slice(0, 10)}</p>
            </div>
            <Link href={`/blog/${p.slug}`} target="_blank" className="text-slate-400 hover:text-brand-700" aria-label="View"><ExternalLink size={16} /></Link>
            <button onClick={() => onDelete(p.id)} className="text-slate-400 hover:text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}
