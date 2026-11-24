import { NextResponse } from "next/server";
import { logConsent } from "@/lib/db";

export const runtime = "nodejs";

// Stores an anonymous record of the visitor's cookie choice (proof of consent)
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (typeof b.id === "string" && b.id.length <= 64) logConsent(b.id, !!b.analytics, !!b.marketing);
  } catch {}
  return NextResponse.json({ ok: true });
}
