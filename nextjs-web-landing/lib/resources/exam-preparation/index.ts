import { igcseOctoberNovember2026Retakes } from '@/lib/resources/exam-preparation/igcse-october-november-2026-retakes';
import type { ResourceArticle } from '@/lib/resources/types';

const examPreparationArticles: ResourceArticle[] = [
  igcseOctoberNovember2026Retakes,
];

const examPreparationBySlug = Object.fromEntries(
  examPreparationArticles.map((article) => [article.slug, article])
) as Record<string, ResourceArticle>;

export function getAllExamPreparationArticles(): ResourceArticle[] {
  return examPreparationArticles;
}

export function getExamPreparationArticleBySlug(
  slug: string
): ResourceArticle | undefined {
  return examPreparationBySlug[slug];
}

export function getAllExamPreparationSlugs(): string[] {
  return examPreparationArticles.map((article) => article.slug);
}
