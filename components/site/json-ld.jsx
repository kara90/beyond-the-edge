/*
  JSON-LD structured data (Organization + WebSite). Helps search engines
  understand the business and can power richer results. Server component, so
  the script ships in the static HTML.
*/
const SITE = "https://beyondtheedgestudio.com";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Beyond the Edge Studio",
      url: SITE,
      image: `${SITE}/opengraph-image`,
      logo: `${SITE}/opengraph-image`,
      slogan: "We go beyond the edge.",
      description:
        "Premium websites and cinematic video for businesses ready to look like the leader in their market.",
      email: "hello@beyondtheedgestudio.com",
      areaServed: "Worldwide",
      knowsAbout: [
        "Web design",
        "Web development",
        "Cinematic video production",
        "Brand films",
        "Conversion optimization",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@beyondtheedgestudio.com",
        contactType: "sales",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Beyond the Edge Studio",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
