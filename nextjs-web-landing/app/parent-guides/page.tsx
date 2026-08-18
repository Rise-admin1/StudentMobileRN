import Link from 'next/link';
import { definePageSeo } from '@/lib/seo/create-metadata';
import { getAllParentGuideArticles } from '@/lib/resources/parent-guides';

export const metadata = definePageSeo({
  title: 'Parent Guides for UAE Families | Coach Academ',
  description:
    'Clear, UAE-specific parent guides on choosing between IGCSE, A-Level and IB, and what each path means for learning style and university options.',
  primaryKeywords: [
    'IGCSE vs A-Level vs IB UAE',
    'parent guides UAE',
    'A-Level or IB Dubai',
  ],
  path: '/parent-guides',
  titleAbsolute: true,
});

export default function ParentGuidesHubPage() {
  const articles = getAllParentGuideArticles();

  return (
    <section className="home-section home-section-spacing bg-gradient-to-b from-indigo-50 to-white min-h-[60vh]">
      <div className="home-section-inner max-w-3xl">
        <header className="mb-10 sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-3">
            Resources
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
            Parent Guides
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Practical, UAE-focused guidance for parents choosing curricula,
            exam pathways, and next steps after IGCSE.
          </p>
        </header>

        <ul className="space-y-6">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/parent-guides/${article.slug}`}
                className="block rounded-xl border border-gray-200 bg-white p-6 sm:p-8 hover:border-[#24bcc7] transition-colors"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-2">
                  {article.category}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 leading-snug">
                  {article.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
