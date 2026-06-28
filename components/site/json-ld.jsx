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
      email: "sebastien@beyondtheedgestudio.com",
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
        email: "sebastien@beyondtheedgestudio.com",
        contactType: "sales",
        availableLanguage: "English",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium website design and development",
            description:
              "Custom, conversion-focused websites that make a business look like the leader in its market.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cinematic video production",
            description:
              "Brand films and social cuts produced with real direction, enhanced by AI to keep the cost below a traditional agency.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ongoing marketing and growth",
            description:
              "Content, marketing funnels, and campaign work that keep a brand visible and converting after launch.",
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Beyond the Edge Studio",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: "Beyond the Edge Studio · Premium websites and cinematic video",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
      primaryImageOfPage: `${SITE}/opengraph-image`,
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
