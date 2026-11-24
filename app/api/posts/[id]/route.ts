import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePost } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deletePost(Number((await params).id));
  revalidatePath("/blog"); revalidatePath("/");
  return NextResponse.json({ ok: true });
}
