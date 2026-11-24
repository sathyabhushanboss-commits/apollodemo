import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "adsn_admin";
const secret = () => process.env.ADMIN_SECRET || "dev-secret-change-me";
export const adminPassword = () => process.env.ADMIN_PASSWORD || "apollo@admin123";

export const sessionToken = () =>
  crypto.createHmac("sha256", secret()).update(`admin:${adminPassword()}`).digest("hex");

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export async function isAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!c && safeEqual(c, sessionToken());
}
