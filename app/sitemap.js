export const dynamic = "force-static";

const BASE = "https://beyondtheedgestudio.com";
const lastModified = "2026-06-26";

export default function sitemap() {
  return [
    { url: BASE, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
