#!/usr/bin/env node
/*
  Create a new prospect preview from the example template.

  Usage:
    npm run new-preview -- --slug acme-plumbing --name "Acme Plumbing"

  Writes data/previews/<slug>.json (never overwrites) and prints the file
  path plus the /p/<slug> URL. Rebuild and deploy to publish the page.
*/
import fs from "node:fs";
import path from "node:path";

function getArg(name) {
  const argv = process.argv.slice(2);
  const flag = `--${name}`;
  const index = argv.indexOf(flag);
  if (index !== -1 && argv[index + 1] && !argv[index + 1].startsWith("--")) {
    return argv[index + 1];
  }
  const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1);
  return "";
}

const slug = getArg("slug").trim().toLowerCase();
const name = getArg("name").trim();

if (!slug || !name) {
  console.error(
    'Usage: npm run new-preview -- --slug <slug> --name "<Business Name>"'
  );
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(
    `Invalid slug "${slug}". Use lowercase letters, numbers, and hyphens only.`
  );
  process.exit(1);
}

const previewsDir = path.join(process.cwd(), "data", "previews");
const templatePath = path.join(previewsDir, "example-business.json");
const targetPath = path.join(previewsDir, `${slug}.json`);

if (!fs.existsSync(templatePath)) {
  console.error(`Template not found: ${templatePath}`);
  process.exit(1);
}

if (fs.existsSync(targetPath)) {
  console.error(`Refusing to overwrite existing preview: ${targetPath}`);
  process.exit(1);
}

const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
template.slug = slug;
template.name = name;

fs.writeFileSync(targetPath, `${JSON.stringify(template, null, 2)}\n`, "utf8");

console.log(`Created ${targetPath}`);
console.log(`Preview URL after next deploy: /p/${slug}`);
