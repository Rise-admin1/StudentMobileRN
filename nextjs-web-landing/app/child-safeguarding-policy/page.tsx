import LegalDocument from '@/components/legal/LegalDocument';
import { definePageSeo } from '@/lib/seo/create-metadata';
import {
  childSafeguardingPolicyMeta,
  childSafeguardingPolicySections,
  childSafeguardingPolicyToc,
} from '@/lib/legal/child-safeguarding-policy-content';

export const metadata = definePageSeo({
  title: 'Child Safeguarding Policy',
  description:
    'CoachAcadem Child Safeguarding Policy. Learn how we protect students, vet tutors, and respond to child-safety concerns on our platform.',
  primaryKeywords: [
    'CoachAcadem child safeguarding policy',
    'online tutoring child safety UAE',
    'student protection policy',
  ],
  path: '/child-safeguarding-policy',
  titleAbsolute: true,
});

export default function ChildSafeguardingPolicyPage() {
  return (
    <article className="home-section home-section-spacing bg-white">
      <div className="home-section-inner max-w-4xl">
        <header className="mb-10 sm:mb-12 border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#24bcc7] mb-2">
            COACHACADEM
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {childSafeguardingPolicyMeta.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4">
            {childSafeguardingPolicyMeta.subtitle}
          </p>
          <p className="text-base text-gray-600 mb-2">
            Effective Date: {childSafeguardingPolicyMeta.effectiveDate}
          </p>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            {childSafeguardingPolicyMeta.intro}
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            {childSafeguardingPolicyMeta.supplemental}
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
            {childSafeguardingPolicyToc.map((item) => (
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

        <LegalDocument sections={childSafeguardingPolicySections} />
      </div>
    </article>
  );
}
