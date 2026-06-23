export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "Beyond the Edge Studio",
    short_name: "Beyond the Edge",
    description:
      "Premium websites and cinematic video for businesses ready to look like the leader in their market.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e17",
    theme_color: "#0a0e17",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
