import "server-only";
import fs from "node:fs";
import path from "node:path";

/** Returns the public path if the file exists in /public, otherwise null (so UI can fall back). */
export function localImage(src?: string | null) {
  if (!src) return null;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : null;
  } catch {
    return null;
  }
}
