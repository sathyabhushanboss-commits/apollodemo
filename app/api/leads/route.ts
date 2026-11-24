import { NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

// naive in-memory rate limit: 5 submissions / 10 min per IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (limited(ip)) return NextResponse.json({ error: "Too many requests. Please call us directly." }, { status: 429 });

    const body = await req.json();
    if (clean(body.website)) return NextResponse.json({ ok: true }); // honeypot → silently accept

    const name = clean(body.name, 80);
    const phone = clean(body.phone, 20).replace(/\D/g, "").slice(-10);
    const email = clean(body.email, 120);
    if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

    const id = createLead({
      name, phone, email: email || null,
      service: clean(body.service, 80) || null,
      preferred_date: clean(body.preferred_date, 20) || null,
      preferred_time: clean(body.preferred_time, 20) || null,
      message: clean(body.message, 1000) || null,
      source: clean(body.source, 80) || "website",
      page: clean(body.page, 200) || null,
      utm: clean(body.utm, 600) || null,
    });
    // Hook: send email / WhatsApp notification to clinic here (Nodemailer, WhatsApp Cloud API, etc.)
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please call us." }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ leads: listLeads() });
}
