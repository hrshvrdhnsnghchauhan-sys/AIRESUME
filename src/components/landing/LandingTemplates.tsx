import { motion } from 'framer-motion';
import { container, fadeUp } from '@/lib/motion';

const templates = [
  { name: 'Modern', color: 'bg-surface', accent: 'bg-brand-600', text: 'text-ink-900' },
  { name: 'Minimal', color: 'bg-surface', accent: 'bg-ink-900', text: 'text-ink-900' },
  { name: 'Creative', color: 'bg-ink-900', accent: 'bg-accent-500', text: 'text-white' },
  { name: 'Executive', color: 'bg-surface', accent: 'bg-brand-800', text: 'text-ink-900' },
  { name: 'Classic', color: 'bg-surface', accent: 'bg-ink-700', text: 'text-ink-900' },
  { name: 'Bold', color: 'bg-brand-600', accent: 'bg-surface', text: 'text-white' },
];

export default function LandingTemplates() {
  return (
    <section id="templates" className="relative py-24 sm:py-32">
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
            Templates
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl"
          >
            Professional templates that get noticed
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-ink-600">
            Choose from recruiter-approved designs. Customize colors, fonts, and spacing.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {templates.map((tpl) => (
            <motion.div
              key={tpl.name}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className={`aspect-[3/4] overflow-hidden rounded-xl border border-ink-200 ${tpl.color} shadow-sm transition-shadow duration-300 group-hover:shadow-xl`}>
                <div className="flex h-full flex-col p-3">
                  <div className={`h-2 w-1/2 rounded ${tpl.accent}`} />
                  <div className={`mt-1 h-1.5 w-3/4 rounded ${tpl.text} opacity-20`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} />
                  <div className={`mt-3 h-1 w-full rounded ${tpl.text} opacity-10`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                  <div className={`mt-1.5 h-1 w-5/6 rounded ${tpl.text} opacity-10`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                  <div className={`mt-3 h-1.5 w-1/3 rounded ${tpl.accent}`} />
                  <div className={`mt-2 h-1 w-full rounded ${tpl.text} opacity-10`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                  <div className={`mt-1.5 h-1 w-4/6 rounded ${tpl.text} opacity-10`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                  <div className={`mt-1.5 h-1 w-3/6 rounded ${tpl.text} opacity-10`} style={{ backgroundColor: tpl.text === 'text-white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                </div>
              </div>
              <p className="mt-2.5 text-center text-sm font-medium text-ink-700">{tpl.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
