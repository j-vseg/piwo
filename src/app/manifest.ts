export const dynamic = "force-static";

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Piwo",
    short_name: "Piwo",
    description:
      "In deze app kun je je aanwezigheid opgeven voor de Pivo's van Scouting Mierlo",
    start_url: "/",
    display: "standalone",
    background_color: "#ffd9ad",
    theme_color: "#ffd9ad",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
