import Link from 'next/link';
import type {
  InlinePart,
  ResourceArticle,
  ResourceBlock,
} from '@/lib/resources/types';

function renderParts(parts: InlinePart[], keyPrefix: string) {
  return parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={`${keyPrefix}-${index}`}>{part}</span>;
    }

    return (
      <Link
        key={`${keyPrefix}-${index}`}
        href={part.href}
        className="text-[#205072] font-medium underline underline-offset-2 hover:text-[#24bcc7] transition-colors"
      >
        {part.text}
      </Link>
    );
  });
}

function renderBlock(block: ResourceBlock, index: number) {
  if (block.type === 'paragraph') {
    return (
      <p
        key={index}
        className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4 last:mb-0"
      >
        {renderParts(block.parts, `p-${index}`)}
      </p>
    );
  }

  return (
    <ul
      key={index}
      className="list-disc pl-6 space-y-2 mb-4 text-gray-700 text-base sm:text-lg leading-relaxed"
    >
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

type ResourceArticleViewProps = {
  article: ResourceArticle;
};

export default function ResourceArticleView({
  article,
}: ResourceArticleViewProps) {
  const publishedLabel = new Date(`${article.publishedAt}T00:00:00`).toLocaleDateString(
    'en-AE',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <article className="home-section home-section-spacing bg-white">
      <div className="home-section-inner max-w-3xl">
        <header className="mb-10 sm:mb-12 border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-3">
            <Link
              href={article.categoryPath}
              className="hover:underline underline-offset-2"
            >
              {article.category}
            </Link>
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-base text-gray-500 mb-6">
            Published {publishedLabel}
          </p>
          <div className="space-y-4">
            {article.intro.map((parts, index) => (
              <p
                key={`intro-${index}`}
                className="text-lg sm:text-xl text-gray-700 leading-relaxed"
              >
                {renderParts(parts, `intro-${index}`)}
              </p>
            ))}
          </div>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {article.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5">
                {section.title}
              </h2>
              <div>{section.blocks.map(renderBlock)}</div>
            </section>
          ))}
        </div>

        <footer className="mt-12 sm:mt-14 pt-8 border-t border-gray-200 space-y-4">
          {article.closing.map((parts, index) => (
            <p
              key={`closing-${index}`}
              className="text-base sm:text-lg text-gray-700 leading-relaxed"
            >
              {renderParts(parts, `closing-${index}`)}
            </p>
          ))}
        </footer>
      </div>
    </article>
  );
}
