import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { BLOG_SEED } from "./blog-seed";

// ─────────────────────────────────────────────────────────────
// SQLite (demo) via Node's built-in node:sqlite (Node 22.5+) — no native build needed.
// Swap for Postgres/MySQL in production.
// DB file: /data/apollo.db (auto-created + seeded on first run)
// ─────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "apollo.db");

declare global {
  // eslint-disable-next-line no-var
  var __apolloDb: DatabaseSync | undefined;
}

function init(): DatabaseSync {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service TEXT,
      preferred_date TEXT,
      message TEXT,
      source TEXT,
      page TEXT,
      utm TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      author TEXT NOT NULL DEFAULT 'Apollo Dental Team',
      cover TEXT NOT NULL DEFAULT 'from-sky-700 via-cyan-600 to-teal-500',
      tags TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consent_id TEXT NOT NULL,
      analytics INTEGER NOT NULL,
      marketing INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // migration: preferred_time
  const cols = db.prepare("PRAGMA table_info(leads)").all() as unknown as { name: string }[];
  if (!cols.some((c) => c.name === "preferred_time")) db.exec("ALTER TABLE leads ADD COLUMN preferred_time TEXT");

  const count = Number((db.prepare("SELECT COUNT(*) as c FROM posts").get() as { c: number }).c);
  if (count === 0) {
    const ins = db.prepare(
      `INSERT INTO posts (slug,title,excerpt,content,category,author,cover,tags,created_at,updated_at)
       VALUES (@slug,@title,@excerpt,@content,@category,@author,@cover,@tags,@date,@date)`
    );
    db.exec("BEGIN");
    try {
      BLOG_SEED.forEach((p) => ins.run(p));
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  return db;
}

export function getDb() {
  if (!global.__apolloDb) global.__apolloDb = init();
  return global.__apolloDb;
}

// node:sqlite returns null-prototype rows — copy to plain objects (needed for Client Components)
const plain = <T,>(rows: unknown[]) => rows.map((r) => ({ ...(r as object) })) as T[];
const plainOne = <T,>(row: unknown) => (row ? ({ ...(row as object) } as T) : undefined);

// ── Types ─────────────────────────────────────────────────────
export type Lead = {
  id: number; name: string; phone: string; email: string | null; service: string | null;
  preferred_date: string | null; preferred_time: string | null; message: string | null; source: string | null; page: string | null;
  utm: string | null; status: string; created_at: string;
};
export type Post = {
  id: number; slug: string; title: string; excerpt: string; content: string; category: string;
  author: string; cover: string; tags: string; published: number; created_at: string; updated_at: string;
};

// ── Leads ─────────────────────────────────────────────────────
export function createLead(l: Omit<Lead, "id" | "status" | "created_at">) {
  const params = Object.fromEntries(Object.entries(l).map(([k, v]) => [k, v ?? null])) as Record<string, string | null>;
  const r = getDb()
    .prepare(
      `INSERT INTO leads (name,phone,email,service,preferred_date,preferred_time,message,source,page,utm)
       VALUES (@name,@phone,@email,@service,@preferred_date,@preferred_time,@message,@source,@page,@utm)`
    )
    .run(params);
  return Number(r.lastInsertRowid);
}
export const listLeads = () => plain<Lead>(getDb().prepare("SELECT * FROM leads ORDER BY id DESC").all());
export const updateLeadStatus = (id: number, status: string) =>
  getDb().prepare("UPDATE leads SET status=? WHERE id=?").run(status, id);
export const deleteLead = (id: number) => getDb().prepare("DELETE FROM leads WHERE id=?").run(id);

// ── Posts ─────────────────────────────────────────────────────
export const listPosts = (includeDrafts = false) =>
  plain<Post>(
    getDb()
      .prepare(`SELECT * FROM posts ${includeDrafts ? "" : "WHERE published=1"} ORDER BY created_at DESC, id DESC`)
      .all()
  );
export const getPost = (slug: string) =>
  plainOne<Post>(getDb().prepare("SELECT * FROM posts WHERE slug=? AND published=1").get(slug));
export function createPost(p: Pick<Post, "slug" | "title" | "excerpt" | "content" | "category" | "author" | "cover" | "tags">) {
  const r = getDb()
    .prepare(
      `INSERT INTO posts (slug,title,excerpt,content,category,author,cover,tags)
       VALUES (@slug,@title,@excerpt,@content,@category,@author,@cover,@tags)`
    )
    .run(p);
  return Number(r.lastInsertRowid);
}
export const deletePost = (id: number) => getDb().prepare("DELETE FROM posts WHERE id=?").run(id);

// ── Consent log (proof of consent) ───────────────────────────
export const logConsent = (consent_id: string, analytics: boolean, marketing: boolean) =>
  getDb()
    .prepare("INSERT INTO consents (consent_id,analytics,marketing) VALUES (?,?,?)")
    .run(consent_id, analytics ? 1 : 0, marketing ? 1 : 0);

// ── Helpers ───────────────────────────────────────────────────
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90);

export const readingTime = (text: string) => Math.max(2, Math.round(text.split(/\s+/).length / 220));

// Minimal, safe markdown → HTML (escapes HTML first)
export function renderMarkdown(md: string) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2">$1</a>');
  const blocks = md.replace(/\r/g, "").split(/\n{2,}/);
  const toc: { id: string; text: string }[] = [];
  const html = blocks
    .map((b) => {
      const t = b.trim();
      if (t.startsWith("### ")) return `<h3>${inline(t.slice(4).split("\n")[0])}</h3>${t.includes("\n") ? `<p>${inline(t.split("\n").slice(1).join(" "))}</p>` : ""}`;
      if (t.startsWith("## ")) {
        const text = t.slice(3);
        const id = slugify(text);
        toc.push({ id, text });
        return `<h2 id="${id}">${inline(text)}</h2>`;
      }
      if (t.split("\n").every((l) => l.trim().startsWith("- ")))
        return `<ul>${t.split("\n").map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join("")}</ul>`;
      return `<p>${inline(t.replace(/\n/g, " "))}</p>`;
    })
    .join("\n");
  return { html, toc };
}
