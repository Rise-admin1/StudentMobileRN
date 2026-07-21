import LegalDocument from '@/components/legal/LegalDocument';
import { definePageSeo } from '@/lib/seo/create-metadata';
import {
  termsOfUseMeta,
  termsOfUseSections,
  termsOfUseToc,
} from '@/lib/legal/terms-of-use-content';

export const metadata = definePageSeo({
  title: 'Terms of Use',
  description:
    'CoachAcadem Terms and Conditions for parents, students, and tutors. Read the terms governing use of our online tutoring platform.',
  primaryKeywords: [
    'CoachAcadem terms of use',
    'online tutoring terms UAE',
    'CoachAcadem terms and conditions',
  ],
  path: '/terms-of-use',
  titleAbsolute: true,
});

export default function TermsOfUsePage() {
  return (
    <article className="home-section home-section-spacing bg-white">
      <div className="home-section-inner max-w-4xl">
        <header className="mb-10 sm:mb-12 border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-2">
            COACHACADEM
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {termsOfUseMeta.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4">
            {termsOfUseMeta.subtitle}
          </p>
          <p className="text-base text-gray-600 mb-2">
            Effective Date: {termsOfUseMeta.effectiveDate}
          </p>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            {termsOfUseMeta.intro}
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            {termsOfUseMeta.supplemental}
          </p>
        </header>

        <nav
          aria-label="Table of contents"
          className="mb-10 sm:mb-12 rounded-xl bg-gray-50 border border-gray-200 p-6 sm:p-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-base sm:text-lg">
            {termsOfUseToc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[#205072] hover:text-[#24bcc7] hover:underline transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <LegalDocument sections={termsOfUseSections} />
      </div>
    </article>
  );
}
