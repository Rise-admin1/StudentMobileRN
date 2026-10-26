import type { Metadata } from 'next';
import HelpGuide from '@/components/help/HelpGuide';
import { definePageSeo } from '@/lib/seo/create-metadata';
import { getRequestLocale } from '@/lib/i18n/get-request-locale';
import { withLocale } from '@/lib/i18n/locale';
import { t } from '@/lib/i18n/messages';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = t(locale);
  return definePageSeo({
    title:
      locale === 'ar'
        ? 'دليل استخدام كوتش أكاديم | كوتش أكاديم'
        : 'Coach Academ Help Guide | Coach Academ',
    description: copy.resources.helpLead,
    primaryKeywords:
      locale === 'ar'
        ? ['دليل كوتش أكاديم', 'كيفية حجز درس', 'حساب ولي الأمر']
        : [
            'Coach Academ help',
            'how to book a tutor',
            'parent account Coach Academ',
            'create a course',
          ],
    path: withLocale('/help', locale),
    locale,
    titleAbsolute: true,
  });
}

export default async function HelpPage() {
  const locale = await getRequestLocale();
  return <HelpGuide locale={locale} />;
}
