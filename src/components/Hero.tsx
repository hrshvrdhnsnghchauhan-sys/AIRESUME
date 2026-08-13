import { motion } from 'framer-motion';
import { Play, Calendar, Sparkles } from 'lucide-react';
import { container, fadeUp } from '@/lib/motion';

export default function Hero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-36 text-center sm:pt-44 lg:pt-52"
    >
      {/* Badge */}
      <motion.div variants={fadeUp}>
        <span className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/[0.04] py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-ink-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_4px_24px_-8px_rgba(37,83,235,0.5)] backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/15">
            <Sparkles className="h-3 w-3 text-accent-400" />
            New
          </span>
          <span className="tracking-tight">Introducing Nexus AI 3.0</span>
          <span className="text-ink-400 transition-colors group-hover:text-ink-200">→</span>
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp}
        className="mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
      >
        The Future of{' '}
        <span className="relative inline-block font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-br from-white via-primary-200 to-accent-400">
          Smarter
        </span>{' '}
        Automation
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={fadeUp}
        className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg lg:text-xl"
      >
        Automate complex workflows with an AI platform that thinks ahead.
        Ship faster, scale effortlessly, and let intelligent agents handle
        the work — so your team can focus on what matters.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
      >
        <a
          href="#demo"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-surface px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_8px_30px_-8px_rgba(37,83,235,0.5)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(37,83,235,0.7)] hover:-translate-y-0.5"
        >
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary-100 via-white to-primary-100 transition-transform duration-600 group-hover:translate-x-full"
            aria-hidden
          />
          <Calendar className="relative h-4 w-4" />
          <span className="relative">Book a Demo</span>
        </a>

        <button
          type="button"
          className="group inline-flex items-center gap-3 rounded-xl border border-white/12 bg-surface/[0.04] px-5 py-3.5 text-sm font-medium text-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-surface/[0.08] hover:-translate-y-0.5"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-surface/10 ring-1 ring-inset ring-white/15 transition-colors group-hover:bg-primary-500/30">
            <Play className="h-3 w-3 translate-x-px fill-white text-white" />
            <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-ping opacity-0 group-hover:opacity-100" />
          </span>
          <span>Watch the film</span>
          <span className="text-xs text-ink-400">2:14</span>
        </button>
      </motion.div>

      {/* Trust line */}
      <motion.div
        variants={fadeUp}
        className="mt-12 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-500"
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-ink-600" />
        Trusted by teams at
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-ink-600" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold tracking-tight text-ink-400"
      >
        {['Vercel', 'Linear', 'Notion', 'Mercury', 'Arc'].map((name) => (
          <span key={name} className="opacity-70 transition-opacity hover:opacity-100">
            {name}
          </span>
        ))}
      </motion.div>
    </motion.section>
  );
}
