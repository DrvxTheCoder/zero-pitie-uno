import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Zéro Pitié League",
    short_name: "Zéro Pitié",
    description: "Classement de vos parties d'UNO No Mercy : chrono de 5 minutes, saisons de 30 jours.",
    lang: "fr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#d41e24",
    theme_color: "#d41e24",
    categories: ["games", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Classement", url: "/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Historique", url: "/history", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
