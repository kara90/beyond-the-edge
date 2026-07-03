import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/*
  Build-time helpers for the /agree/[slug] signing pages. Reads the SAME
  sources scripts/sync-agreements.mjs embeds into the signing API, so the text
  a client sees is byte-identical to the text the server hashes.
*/

// Keep in lockstep with scripts/sync-agreements.mjs.
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

const TYPE_AGREEMENTS = {
  build: ["csa"],
  plan: ["cpra"],
  "complimentary-build": ["csa", "cpra"],
};

const dealsDir = join(process.cwd(), "data", "agreements");

export function getAllDeals() {
  return readdirSync(dealsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dealsDir, f), "utf8")));
}

export function getDeal(slug) {
  return getAllDeals().find((d) => d.slug === slug) || null;
}

export function getAgreementsForDeal(deal) {
  const ids = TYPE_AGREEMENTS[deal.agreementType] || ["csa"];
  return ids.map((id) => ({
    id,
    ...AGREEMENTS[id],
    text: readFileSync(join(process.cwd(), AGREEMENTS[id].file), "utf8"),
  }));
}
