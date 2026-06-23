/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export → runs on any static host (Cloudflare Pages, etc.)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
