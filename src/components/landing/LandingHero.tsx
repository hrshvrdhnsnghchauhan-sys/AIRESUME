import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { container, fadeUp } from '@/lib/motion';

const stats = [
  { value: '500K+', label: 'Resumes Built' },
  { value: '92%',   label: 'ATS Pass Rate' },
  { value: '3.4×',  label: 'More Interviews' },
  { value: '4.9★',  label: 'User Rating' },
];

const highlights = [
  'AI Resume Builder',
  'ATS Optimization',
  'Interview Coach',
  'Job Match Engine',
];

export default function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-44">
      {/* ── Animated Background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Main hero gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--theme-hero-bg, linear-gradient(135deg, #eff6ff 0%, #f1f5f9 60%, #ffffff 100%))' }}
        />
        {/* Orb 1 */}
        <div
          className="absolute -top-32 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full blur-[100px] animate-blob"
          style={{ background: `radial-gradient(circle, var(--theme-hero-orb1, rgba(59,130,246,0.25)), transparent 65%)` }}
        />
        {/* Orb 2 */}
        <div
          className="absolute top-1/3 -right-32 h-[35rem] w-[35rem] rounded-full blur-[100px] animate-blob animation-delay-2000"
          style={{ background: `radial-gradient(circle, var(--theme-hero-orb2, rgba(99,102,241,0.15)), transparent 65%)` }}
        />
        {/* Orb 3 */}
        <div
          className="absolute bottom-0 -left-20 h-[30rem] w-[30rem] rounded-full blur-[100px] animate-blob animation-delay-4000"
          style={{ background: `radial-gradient(circle, var(--theme-hero-orb1, rgba(59,130,246,0.1)), transparent 65%)` }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(var(--theme-200, #bfdbfe) 1px, transparent 1px), linear-gradient(90deg, var(--theme-200, #bfdbfe) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-60" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
      >
        {/* ── Badge ── */}
        <motion.div variants={fadeUp}>
          <span
            className="inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-xs font-semibold shadow-sm border"
            style={{
              background: 'var(--theme-50, #eff6ff)',
              borderColor: 'var(--theme-200, #bfdbfe)',
              color: 'var(--theme-700, #1d4ed8)',
            }}
          >
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))` }}
            >
              <Sparkles className="h-3 w-3" />
              NEW
            </span>
            AI Career OS 3.0 — Gemini-powered Intelligence
            <ArrowRight className="h-3 w-3" />
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          variants={fadeUp}
          className="mt-8 max-w-4xl text-balance font-bold leading-[1.08] tracking-tight text-ink-900"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          Land Your{' '}
          <span
            className="relative inline-block"
            style={{
              background: `linear-gradient(135deg, var(--theme-gradient-from, #3b82f6) 0%, var(--theme-gradient-to, #6366f1) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dream Job
          </span>
          <br />
          with AI-Powered Precision
        </motion.h1>

        {/* ── Subheadline ── */}
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-500 sm:text-xl"
        >
          Build stunning resumes, ace ATS systems, generate cover letters,
          prep for interviews, and track every application — all powered by
          Google Gemini AI.
        </motion.p>

        {/* ── Feature Pills ── */}
        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {highlights.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                background: 'var(--theme-50, #eff6ff)',
                borderColor: 'var(--theme-200, #bfdbfe)',
                color: 'var(--theme-700, #1d4ed8)',
              }}
            >
              <CheckCircle className="h-3 w-3" style={{ color: 'var(--theme-500, #3b82f6)' }} />
              {h}
            </span>
          ))}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/signup')}
            className="group relative inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-white overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, var(--theme-gradient-from, #3b82f6) 0%, var(--theme-gradient-to, #6366f1) 100%)`,
              boxShadow: `0 8px 30px var(--theme-hero-orb1, rgba(59,130,246,0.4))`,
            }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Zap className="h-4 w-4 relative z-10" />
            <span className="relative z-10">Start Building Free</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-300 bg-white px-6 py-3.5 text-sm font-semibold text-ink-700 shadow-sm transition-all duration-300 hover:border-ink-400 hover:shadow-md hover:-translate-y-0.5"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* ── Trust Signals ── */}
        <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            Free forever plan
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            Cancel anytime
          </span>
        </motion.div>

        {/* ── Stats Strip ── */}
        <motion.div
          variants={fadeUp}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-3xl"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderColor: 'var(--theme-200, #bfdbfe)',
              }}
            >
              <span
                className="text-3xl font-black"
                style={{
                  background: `linear-gradient(135deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                }}
              >
                {s.value}
              </span>
              <span className="text-xs font-semibold text-ink-500">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── App Preview Card ── */}
        <motion.div
          variants={fadeUp}
          className="mt-16 w-full max-w-4xl"
        >
          <div
            className="relative rounded-3xl border p-1 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              borderColor: 'var(--theme-200, #bfdbfe)',
              boxShadow: `0 40px 100px var(--theme-hero-orb1, rgba(59,130,246,0.2)), 0 0 0 1px var(--theme-200, #bfdbfe)`,
            }}
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 rounded-2xl px-4 py-3 border-b" style={{ borderColor: 'var(--theme-100, #dbeafe)', background: 'var(--theme-50, #eff6ff)' }}>
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-6 rounded-lg bg-white border border-ink-200 flex items-center px-3">
                <span className="text-xs text-ink-400">app.vanitrai.com/dashboard</span>
              </div>
            </div>
            {/* Dashboard preview content */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Sidebar preview */}
              <div className="col-span-1 space-y-2">
                <div className="h-8 rounded-xl" style={{ background: `linear-gradient(135deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))` }} />
                {['Overview','Resume Builder','ATS Simulator','Job Match','AI Copilot'].map((item, i) => (
                  <div
                    key={item}
                    className="h-8 rounded-xl flex items-center px-3 gap-2"
                    style={{
                      background: i === 0 ? 'var(--theme-50, #eff6ff)' : 'transparent',
                      border: i === 0 ? `1px solid var(--theme-200, #bfdbfe)` : 'none',
                    }}
                  >
                    <span className="h-3 w-3 rounded" style={{ background: i === 0 ? 'var(--theme-500, #3b82f6)' : '#e2e8f0' }} />
                    <span className="h-2 rounded flex-1" style={{ background: i === 0 ? 'var(--theme-200, #bfdbfe)' : '#e2e8f0', maxWidth: '70%' }} />
                  </div>
                ))}
              </div>
              {/* Main area preview */}
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[{ w: 'from-blue-400 to-blue-600' }, { w: 'from-purple-400 to-purple-600' }, { w: 'from-emerald-400 to-emerald-600' }, { w: 'from-amber-400 to-orange-500' }].map((c, i) => (
                    <div key={i} className="rounded-xl p-4 bg-white border border-ink-100 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="h-2.5 w-16 rounded bg-ink-100" />
                        <span className={`h-7 w-7 rounded-lg bg-gradient-to-br ${c.w}`} />
                      </div>
                      <span className="text-2xl font-black text-ink-900">{['24', '93%', '8', '4.9'][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 bg-white border border-ink-100 shadow-sm">
                  <div className="h-2.5 w-32 rounded bg-ink-100 mb-4" />
                  {[85, 72, 91, 68].map((w, i) => (
                    <div key={i} className="mb-2.5 flex items-center gap-3">
                      <span className="h-2 w-14 rounded bg-ink-100" />
                      <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${w}%`, background: `linear-gradient(90deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-ink-600">{w}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-8 top-1/3 hidden lg:block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-xl"
              style={{ borderColor: 'var(--theme-200, #bfdbfe)' }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: 'var(--theme-50, #eff6ff)' }}>
                <Star className="h-4 w-4" style={{ color: 'var(--theme-500, #3b82f6)' }} />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-900">ATS Score</p>
                <p className="text-lg font-black" style={{ color: 'var(--theme-600, #2563eb)' }}>94/100</p>
              </div>
            </motion.div>
          </div>

          <div className="absolute -right-8 top-1/4 hidden lg:block">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="rounded-2xl border bg-white px-4 py-3 shadow-xl"
              style={{ borderColor: 'var(--theme-200, #bfdbfe)' }}
            >
              <p className="text-xs font-bold text-ink-900 mb-1">AI Generating…</p>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="h-2.5 rounded-full"
                    style={{ width: `${[40, 56, 32][i-1]}px`, background: `linear-gradient(90deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))` }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
