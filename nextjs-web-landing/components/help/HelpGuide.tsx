import type { Locale } from '@/lib/i18n/locale';
import { t } from '@/lib/i18n/messages';
import { helpCategories } from '@/lib/help/guide';

const paragraphsFor = (content: string) =>
  content.split('\n').map((line) => line.trim()).filter(Boolean);

const categoryId = (title: string) =>
  `category-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export default function HelpGuide({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <article className="home-section home-section-spacing bg-gradient-to-b from-indigo-50 to-white">
      <div className="home-section-inner max-w-3xl">
        <header className="mb-10 sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-3">
            {copy.resources.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
            {copy.resources.helpTitle}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {copy.resources.helpLead}
          </p>
          {locale === 'ar' ? (
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              {copy.resources.englishBodyNote}
            </p>
          ) : null}
        </header>

        <nav
          aria-label={copy.legal.toc}
          className="mb-12 rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
            {copy.legal.toc}
          </h2>
          <div className="space-y-6">
            {helpCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <ol className="space-y-1.5">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-[#205072] hover:text-[#24bcc7] hover:underline transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </nav>

        <div className="space-y-14">
          {helpCategories.map((category) => (
            <section key={category.title} aria-labelledby={categoryId(category.title)}>
              <h2
                id={categoryId(category.title)}
                className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              >
                {category.title}
              </h2>
              <div className="space-y-8">
                {category.items.map((item) => (
                  <section
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
                  >
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 leading-snug">
                      {item.title}
                    </h3>
                    <div className="space-y-3">
                      {paragraphsFor(item.content).map((paragraph, index) => (
                        <p
                          key={`${item.id}-${index}`}
                          className="text-base sm:text-lg text-gray-700 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
