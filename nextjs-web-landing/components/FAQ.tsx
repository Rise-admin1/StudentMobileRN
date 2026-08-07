'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FaqItem } from '@/lib/subjects/types';
import { homeFaqs } from '@/lib/seo/pages/home-faqs';

type FAQProps = {
  title?: string;
  faqs?: FaqItem[];
};

export default function FAQ({
  title = 'Q&A for the curious',
  faqs = homeFaqs,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="home-section home-section-spacing max-md:!py-12 bg-white">
      <div className="home-section-inner">
        <h2 className="home-section-title max-md:text-3xl max-md:!mb-6 max-md:leading-tight max-md:px-1">
          {title}
        </h2>

        <div className="max-md:-mx-1">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}
            >
              <button
                type="button"
                className="w-full max-md:py-4 md:py-6 text-left flex justify-between max-md:items-start md:items-center gap-3 focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-[1.5rem] max-md:text-lg font-medium text-gray-900 max-md:leading-snug min-w-0 flex-1">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp
                    className="flex-shrink-0 max-md:ml-0 md:ml-4 max-md:mt-0.5 text-indigo-600 max-md:!h-4 max-md:!w-4"
                    size={20}
                  />
                ) : (
                  <ChevronDown
                    className="flex-shrink-0 max-md:ml-0 md:ml-4 max-md:mt-0.5 text-gray-400 max-md:!h-4 max-md:!w-4"
                    size={20}
                  />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'max-h-96 max-md:pb-4 pb-6'
                    : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed text-[1.3rem] max-md:text-base max-md:leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
