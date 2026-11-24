import { NextResponse } from "next/server";
import { updateLeadStatus, deleteLead } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
const STATUSES = ["new", "contacted", "booked", "closed", "spam"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status } = await req.json();
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  updateLeadStatus(Number((await params).id), status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteLead(Number((await params).id));
  return NextResponse.json({ ok: true });
}
