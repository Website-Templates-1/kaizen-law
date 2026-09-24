import type { MetadataRoute } from "next";
import { absoluteUrl, practices, staticRoutes } from "@/lib/site.config";
import { getSitemapPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const practiceEntries: MetadataRoute.Sitemap = practices.map((practice) => ({
    url: absoluteUrl(`/practice/${practice.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = getSitemapPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...practiceEntries, ...postEntries];
}
