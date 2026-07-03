// Regenerates functions/_lib/agreements-data.js from legal/*.md and
// data/agreements/*.json so the signing API validates and hashes the EXACT
// text and deal terms the /agree pages display. Run after any change to
// legal sources or deal configs (new-agreement runs it automatically):
//
//   npm run sync-agreements
//
// The generated module is committed, because Cloudflare Pages Functions
// cannot read repo files at runtime.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Agreement registry: which markdown file is the CURRENT version per id.
// When contract text changes, add the new file and bump the version here;
// past acceptance records keep the hash of whatever version they signed.
const AGREEMENTS = {
  csa: {
    name: "Client Services Agreement",
    version: "v1",
    file: "legal/client-services-agreement.v1.md",
  },
  cpra: {
    name: "Care Plan and Retainer Agreement",
    version: "v1",
    file: "legal/care-plan-retainer-agreement.v1.md",
  },
};

const agreements = {};
for (const [id, def] of Object.entries(AGREEMENTS)) {
  agreements[id] = { ...def, text: readFileSync(join(root, def.file), "utf8") };
}

const deals = {};
const dealsDir = join(root, "data", "agreements");
for (const f of readdirSync(dealsDir)) {
  if (!f.endsWith(".json")) continue;
  const deal = JSON.parse(readFileSync(join(dealsDir, f), "utf8"));
  deals[deal.slug] = deal;
}

const out = `// GENERATED FILE. Do not edit by hand.
// Regenerate with: npm run sync-agreements
// Source of truth: legal/*.md and data/agreements/*.json
export const AGREEMENTS = ${JSON.stringify(agreements, null, 2)};

export const DEALS = ${JSON.stringify(deals, null, 2)};
`;

writeFileSync(join(root, "functions", "_lib", "agreements-data.js"), out);
console.log(
  `Synced ${Object.keys(agreements).length} agreements and ${
    Object.keys(deals).length
  } deals into functions/_lib/agreements-data.js`
);
