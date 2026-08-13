import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  FileText,
  Target,
} from 'lucide-react';
import { scaleIn } from '@/lib/motion';

const metrics = [
  { label: 'ATS Score', value: '94', delta: '+8', icon: Target },
  { label: 'Applications', value: '23', delta: '+5', icon: FileText },
  { label: 'Interview Rate', value: '41%', delta: '+12%', icon: TrendingUp },
  { label: 'Resume Score', value: 'A+', delta: '+2', icon: Zap },
];

export default function LandingDashboard() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="relative mx-auto mt-20 w-full max-w-6xl px-4"
    >
      {/* Glow */}
      <div
        className="absolute inset-x-10 top-8 -z-10 h-72 rounded-[3rem] opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(59,109,245,0.3), transparent 70%)' }}
      />

      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-surface shadow-2xl shadow-ink-900/10">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-surface px-3 py-1 text-[11px] text-ink-400 ring-1 ring-inset ring-ink-200">
            app.vanitraai.com/dashboard
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 hidden border-r border-ink-100 p-4 lg:flex lg:col-span-2">
            <div className="flex w-full flex-col gap-1">
              <div className="mb-4 flex items-center gap-2 px-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm font-semibold text-ink-900">Dashboard</span>
              </div>
              {['Overview', 'Resumes', 'Analyzer', 'Job Match', 'Copilot', 'Tracker', 'Settings'].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                      i === 0
                        ? 'bg-brand-50 font-medium text-brand-700 ring-1 ring-inset ring-brand-100'
                        : 'text-ink-500'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-brand-500' : 'bg-ink-300'}`} />
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="col-span-12 p-5 sm:col-span-9 sm:p-6 lg:col-span-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink-900">Welcome back, Alex</h3>
                <p className="text-sm text-ink-500">Your career at a glance</p>
              </div>
              <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
                Last 30 days
              </span>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-ink-200 bg-ink-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
                      {m.label}
                    </span>
                    <m.icon className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="text-2xl font-bold text-ink-900">{m.value}</span>
                    <span className="text-[11px] font-semibold text-success-600">{m.delta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-ink-200 bg-surface p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-900">Application Activity</span>
                  <span className="text-xs text-ink-500">last 12 weeks</span>
                </div>
                <div className="flex h-28 items-end gap-1.5">
                  {[40, 55, 48, 70, 62, 85, 72, 90, 68, 82, 78, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400"
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-ink-200 bg-surface p-4 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-900">Pipeline</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Wishlist', count: 8, color: 'bg-ink-300' },
                    { label: 'Applied', count: 12, color: 'bg-brand-500' },
                    { label: 'Interview', count: 5, color: 'bg-accent-500' },
                    { label: 'Offer', count: 2, color: 'bg-success-500' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-xs text-ink-600">{s.label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className={`h-full rounded-full ${s.color}`}
                          style={{ width: `${(s.count / 12) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-ink-900">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="mt-3 rounded-xl border border-ink-200 bg-surface p-4">
              <span className="text-sm font-medium text-ink-900">Recent Activity</span>
              <div className="mt-3 space-y-1">
                {[
                  { text: 'Resume analyzed — ATS score improved to 94', icon: CheckCircle2, color: 'text-success-600', time: '2m ago' },
                  { text: 'Applied to Senior PM at Linear', icon: FileText, color: 'text-brand-600', time: '1h ago' },
                  { text: 'Interview scheduled at Mercury', icon: Clock, color: 'text-accent-600', time: '3h ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
                    <a.icon className={`h-4 w-4 ${a.color}`} />
                    <span className="flex-1 text-[13px] text-ink-700">{a.text}</span>
                    <span className="text-[11px] text-ink-400">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
