import type { MetadataRoute } from "next";
import { getContent } from "@/content/store";
import { navigation, siteUrl } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courses, lectures } = await getContent();
  return [
    ...navigation.map((n) => ({
      url: `${siteUrl}${n.href}`,
      changeFrequency: "monthly" as const,
      priority: n.href === "/" ? 1 : 0.7,
    })),
    ...courses.map((c) => ({ url: `${siteUrl}/teaching/${c.slug}/`, priority: 0.6 })),
    ...lectures.map((l) => ({ url: `${siteUrl}/teaching/${l.course}/${l.slug}/`, priority: 0.5 })),
  ];
}
