import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { container, fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How does the ATS analysis work?',
    a: 'Our AI analyzes your resume against the same criteria that Applicant Tracking Systems use — formatting, keywords, parsing compatibility, and structure. You get a detailed score breakdown with actionable recommendations.',
  },
  {
    q: 'Can I export my resume to different formats?',
    a: 'Yes. You can export to PDF, DOCX, and Markdown formats. PDF is optimized for ATS parsing while maintaining professional formatting.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All data is encrypted in transit and at rest. We never share your information with third parties. You can delete your account and all associated data at any time.',
  },
  {
    q: 'How accurate is the job match feature?',
    a: 'Our AI compares your resume against the job description using semantic analysis to identify matching skills, missing keywords, and experience gaps. The match score has been validated against real hiring outcomes.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. You can cancel at any time from your account settings. You will keep access until the end of your billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 14-day money-back guarantee on all Pro plans. If you are not satisfied, contact support for a full refund.',
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ink-50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-wide text-brand-600"
          >
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl"
          >
            Questions? Answered.
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="overflow-hidden rounded-xl border border-ink-200 bg-surface"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-semibold text-ink-900">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300',
                    open === i && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink-600">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
