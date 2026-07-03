/*
  Preview data helpers, node-side only. These read data/previews/*.json with
  fs at build time; they are imported exclusively by server components that
  render during `next build` (static export), never in the browser.
*/
import fs from "node:fs";
import path from "node:path";

const PREVIEWS_DIR = path.join(process.cwd(), "data", "previews");

/** Every preview JSON in data/previews, parsed. */
export function getAllPreviews() {
  if (!fs.existsSync(PREVIEWS_DIR)) return [];
  return fs
    .readdirSync(PREVIEWS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) =>
      JSON.parse(fs.readFileSync(path.join(PREVIEWS_DIR, file), "utf8"))
    );
}

/** One preview by slug, or null when no matching JSON exists. */
export function getPreview(slug) {
  // Only accept simple slugs so a path can never escape the previews dir.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
  const file = path.join(PREVIEWS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
