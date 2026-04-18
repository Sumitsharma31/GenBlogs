import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-20 rounded-[2.5rem] border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-12">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div key={index} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              <span className="mr-2 text-indigo-600">Q.</span>
              {faq.question}
            </h3>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              <span className="mr-2 font-bold text-indigo-600">A.</span>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
