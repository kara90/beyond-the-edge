// Scaffold a private signing page config:
//   npm run new-agreement -- --slug=joes-roofing --name="Joes Roofing"
//
// An unguessable random suffix is appended to the slug automatically
// (joes-roofing -> joes-roofing-x7k2), the JSON stub is created under
// data/agreements/, and the agreements data module is re-synced so the
// signing API knows the deal. Fill in the stub, run a build, and the page
// is live at /agree/<slug>.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function arg(name) {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split("=").slice(1).join("=");
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return "";
}

const baseSlug = arg("slug")
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");
const name = arg("name").trim();

if (!baseSlug || !name) {
  console.error(
    'Usage: npm run new-agreement -- --slug=joes-roofing --name="Joes Roofing"'
  );
  process.exit(1);
}

// Unguessable suffix so signing links cannot be enumerated.
const suffix = randomBytes(3).toString("base64url").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4) ||
  randomBytes(2).toString("hex");
const slug = `${baseSlug}-${suffix}`;

const file = join(root, "data", "agreements", `${slug}.json`);
if (existsSync(file)) {
  console.error(`Refusing to overwrite existing config: ${file}`);
  process.exit(1);
}

const stub = {
  slug,
  businessName: name,
  contactName: "",
  email: "",
  agreementType: "complimentary-build",
  offerName: `Complimentary landing page with the Care plan for ${name}`,
  price: 300,
  billing: "monthly",
  minimumTermMonths: 6,
  buyoutPrice: 1500,
  includes: [
    "Custom landing page, designed and built for your brand",
    "Hosting, security, SSL, and backups",
    "Up to 4 small updates a month",
  ],
  startDate: "",
  paymentUrl: "",
  expiresAt: "",
};

writeFileSync(file, JSON.stringify(stub, null, 2) + "\n");
console.log(`Created ${file}`);

// Keep the signing API in lockstep with the new config.
execFileSync(process.execPath, [join(root, "scripts", "sync-agreements.mjs")], {
  stdio: "inherit",
});

console.log(`\nSigning page (after the next build/deploy): /agree/${slug}`);
console.log(
  "Fill in email, contactName, prices, includes, and paymentUrl before sending."
);
