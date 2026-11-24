import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apollo Dental Sahakarnagar", short_name: "Apollo Dental", start_url: "/", display: "standalone",
    background_color: "#ffffff", theme_color: "#0e6f8f",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
