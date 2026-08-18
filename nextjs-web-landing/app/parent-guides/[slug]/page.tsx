import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleJsonLd from '@/components/resources/ArticleJsonLd';
import ResourceArticleView from '@/components/resources/ResourceArticleView';
import { definePageSeo } from '@/lib/seo/create-metadata';
import {
  getAllParentGuideSlugs,
  getParentGuideArticleBySlug,
} from '@/lib/resources/parent-guides';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllParentGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getParentGuideArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return definePageSeo({
    title: article.title,
    description: article.description,
    primaryKeywords: article.primaryKeywords,
    secondaryKeywords: article.secondaryKeywords,
    path: `/parent-guides/${article.slug}`,
    titleAbsolute: true,
  });
}

export default async function ParentGuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getParentGuideArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd article={article} />
      <ResourceArticleView article={article} />
    </>
  );
}
