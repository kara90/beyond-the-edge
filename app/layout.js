import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/site/smooth-scroll";
import Intro from "@/components/site/intro";
import ScrollProgress from "@/components/site/scroll-progress";
import Cursor from "@/components/site/cursor";
import JsonLd from "@/components/site/json-ld";

// Body: clean, highly readable.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Technical labels and eyebrows.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display: confident, modern sans with presence. No serifs.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://beyondtheedgestudio.com"),
  title: {
    default: "Beyond the Edge Studio · Premium websites and cinematic video",
    template: "%s · Beyond the Edge Studio",
  },
  description:
    "Premium websites and cinematic video for businesses ready to look like the leader in their market. Major-brand quality, without the agency price.",
  applicationName: "Beyond the Edge Studio",
  authors: [{ name: "Beyond the Edge Studio", url: "https://beyondtheedgestudio.com" }],
  creator: "Beyond the Edge Studio",
  publisher: "Beyond the Edge Studio",
  category: "Creative studio",
  keywords: [
    "creative studio",
    "premium web design",
    "cinematic video production",
    "brand films",
    "high-end websites",
    "video marketing",
    "conversion focused websites",
    "small business branding",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Beyond the Edge Studio",
    description:
      "Premium websites and cinematic video for businesses ready to look like the leader in their market.",
    url: "https://beyondtheedgestudio.com",
    siteName: "Beyond the Edge Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond the Edge Studio",
    description:
      "Premium websites and cinematic video for businesses ready to look like the leader in their market.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  // Match mobile browser chrome to the deep-space background.
  themeColor: "#0a0e17",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd />
        <SmoothScroll />
        <Intro />
        <ScrollProgress />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
