import { igcseALevelIbUaeComparison } from '@/lib/resources/parent-guides/igcse-a-level-ib-uae-comparison';
import type { ResourceArticle } from '@/lib/resources/types';

const parentGuideArticles: ResourceArticle[] = [igcseALevelIbUaeComparison];

const parentGuidesBySlug = Object.fromEntries(
  parentGuideArticles.map((article) => [article.slug, article])
) as Record<string, ResourceArticle>;

export function getAllParentGuideArticles(): ResourceArticle[] {
  return parentGuideArticles;
}

export function getParentGuideArticleBySlug(
  slug: string
): ResourceArticle | undefined {
  return parentGuidesBySlug[slug];
}

export function getAllParentGuideSlugs(): string[] {
  return parentGuideArticles.map((article) => article.slug);
}
