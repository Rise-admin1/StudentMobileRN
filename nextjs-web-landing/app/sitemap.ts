import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo/site";
import { getAllCurriculumSlugs } from "@/lib/curricula/get-curriculum";
import { getAllSubjectSlugs } from "@/lib/subjects/get-subject";
import { getAllExamPreparationSlugs } from "@/lib/resources/exam-preparation";
import { getAllParentGuideSlugs } from "@/lib/resources/parent-guides";

const routes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms-of-use", changeFrequency: "monthly", priority: 0.5 },
  {
    path: "/child-safeguarding-policy",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  { path: "/exam-preparation", changeFrequency: "weekly", priority: 0.7 },
  ...getAllExamPreparationSlugs().map((slug) => ({
    path: `/exam-preparation/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/parent-guides", changeFrequency: "weekly", priority: 0.7 },
  ...getAllParentGuideSlugs().map((slug) => ({
    path: `/parent-guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  ...getAllSubjectSlugs().map((slug) => ({
    path: `/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
  ...getAllCurriculumSlugs().map((slug) => ({
    path: `/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
