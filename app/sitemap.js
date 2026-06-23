// Static sitemap. Single-page site, so one canonical entry.
export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: "https://beyondtheedgestudio.com",
      lastModified: "2026-06-22",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
