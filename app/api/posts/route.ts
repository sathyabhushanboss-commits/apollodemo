import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPost, listPosts, slugify } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ posts: listPosts().map(({ content, ...p }) => p) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const title = String(b.title || "").trim();
  const content = String(b.content || "").trim();
  if (title.length < 5 || content.length < 50) return NextResponse.json({ error: "Title (5+ chars) and content (50+ chars) are required." }, { status: 400 });
  const slug = slugify(b.slug || title);
  try {
    const id = createPost({
      slug, title, content,
      excerpt: String(b.excerpt || content.replace(/[#*\-\n]/g, " ").replace(/\s+/g, " ").slice(0, 155)).trim(),
      category: String(b.category || "Oral Care").trim(),
      author: String(b.author || "Apollo Dental Team").trim(),
      cover: String(b.cover || "from-sky-700 via-cyan-600 to-teal-500"),
      tags: String(b.tags || ""),
    });
    revalidatePath("/blog"); revalidatePath("/"); revalidatePath("/sitemap.xml");
    return NextResponse.json({ ok: true, id, slug });
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("UNIQUE") ? "A post with this slug already exists." : "Could not create post.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
