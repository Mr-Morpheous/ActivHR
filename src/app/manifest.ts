import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * The site shipped `favicon.ico` and nothing else: no apple-touch-icon, no
 * 192/512 PNGs, no manifest. On iOS a bookmarked page fell back to a screenshot
 * of the page, and on Android there was no maskable icon at all — which reads
 * as an unfinished product at exactly the moment someone is deciding whether to
 * trust it.
 *
 * The PNGs in public/icons were rasterised from public/brand/favicon.svg onto
 * the ink background, rather than left transparent, so Android's mask crops into
 * a field instead of into nothing.
 *
 * `display: browser` is deliberate. This is a marketing site with an app behind
 * a login, not an installable app — claiming `standalone` would strip the URL
 * bar from a page whose whole job is to be linked and shared.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ActivHR — Africa's Adaptive HR and Talent Platform",
    short_name: "ActivHR",
    description:
      "HR and attendance software for teams that work on-site and in the field.",
    start_url: "/",
    display: "browser",
    background_color: "#0e1116",
    theme_color: "#0e1116",
    lang: "en-KE",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
