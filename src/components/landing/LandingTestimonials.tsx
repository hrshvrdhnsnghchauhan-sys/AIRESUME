import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { container, fadeUp } from '@/lib/motion';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Stripe',
    quote: 'VanitraAI landed me 3 interviews in my first week. The ATS analyzer alone is worth every penny.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer at Vercel',
    quote: 'The AI Copilot rewrote my bullet points and my response rate jumped from 5% to 28%. Insane.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'UX Designer at Linear',
    quote: 'I went from 0 callbacks to 4 offers in a month. The job match feature is incredibly accurate.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Data Scientist at Notion',
    quote: 'The interview coach prepared me for every question. I walked in confident and got the offer.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Lead at Mercury',
    quote: 'Best career tool I have ever used. It feels like having a personal recruiter on demand.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Backend Engineer at Arc',
    quote: 'The resume templates are gorgeous and ATS-friendly. Got past every screening system.',
    rating: 5,
  },
];

export default function LandingTestimonials() {
  return (
    <section className="relative bg-ink-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-wide text-brand-600"
          >
            Loved by job seekers
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl"
          >
            Thousands have landed their dream job
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-4 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warning-500 text-warning-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-ink-600">4.9/5 from 12,000+ users</span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-ink-200 bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning-500 text-warning-500" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-700">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                  <p className="text-xs text-ink-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
