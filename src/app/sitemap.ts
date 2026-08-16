import { MetadataRoute } from "next";

const SITE_URL = "https://activhr.africa";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/#features",
    "/#pillars",
    "/#pricing",
    "/#contact",
    "/demo",
    "/whatsapp-ess",
    "/cookie-policy",
    "/privacy-policy",
    "/terms-of-service",
    "/login",
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }));
}
