import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/site/smooth-scroll";
import Intro from "@/components/site/intro";
import ScrollProgress from "@/components/site/scroll-progress";
import Cursor from "@/components/site/cursor";

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
    default:
      "Beyond the Edge Studio — Websites and cinematic video for brands that refuse average",
    template: "%s · Beyond the Edge Studio",
  },
  description:
    "We build premium websites and cinematic video for ambitious businesses. Major-brand quality, made accessible. We go beyond the edge of what people think is possible for their brand.",
  keywords: [
    "creative studio",
    "premium web design",
    "cinematic video production",
    "brand films",
    "high-end websites",
    "video marketing",
  ],
  openGraph: {
    title: "Beyond the Edge Studio",
    description:
      "Premium websites and cinematic video for businesses that refuse to look average.",
    url: "https://beyondtheedgestudio.com",
    siteName: "Beyond the Edge Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond the Edge Studio",
    description:
      "Premium websites and cinematic video for businesses that refuse to look average.",
  },
  robots: { index: true, follow: true },
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
        <SmoothScroll />
        <Intro />
        <ScrollProgress />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
