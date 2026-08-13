import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Cpu,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { scaleIn } from '@/lib/motion';

const metrics = [
  { label: 'Active Workflows', value: '1,284', delta: '+12.4%', icon: Zap },
  { label: 'Tasks Automated', value: '48.2K', delta: '+8.1%', icon: Cpu },
  { label: 'Avg. Response', value: '128ms', delta: '-3.2%', icon: TrendingUp, positive: false },
];

const workflowRuns = [
  { name: 'Invoice Batch Processing', status: 'Completed', time: '2m ago', pct: 100 },
  { name: 'Customer Onboarding Flow', status: 'Running', time: 'just now', pct: 64 },
  { name: 'Data Sync — Warehouse', status: 'Completed', time: '6m ago', pct: 100 },
  { name: 'Lead Scoring Engine', status: 'Queued', time: 'in 1m', pct: 0 },
];

function Sparkline() {
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,109,245,0.35)" />
          <stop offset="100%" stopColor="rgba(59,109,245,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,30 L15,26 L30,28 L45,18 L60,21 L75,10 L90,14 L105,6 L120,9 L120,40 L0,40 Z"
        fill="url(#sparkFill)"
      />
      <path
        d="M0,30 L15,26 L30,28 L45,18 L60,21 L75,10 L90,14 L105,6 L120,9"
        fill="none"
        stroke="rgba(96,144,250,0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bars() {
  const heights = [40, 65, 52, 78, 60, 88, 72, 95, 68, 82, 58, 90];
  return (
    <div className="flex h-24 items-end gap-1.5">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-primary-700/40 to-primary-400/80"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="relative mx-auto mt-20 w-full max-w-6xl px-4 sm:mt-24"
    >
      {/* Glow under dashboard */}
      <div
        className="absolute inset-x-10 top-8 -z-10 h-72 rounded-[3rem] opacity-60 blur-[90px]"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(37,83,235,0.5), transparent 70%)',
        }}
      />

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-surface/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-ink-800/60 px-3 py-1 text-[11px] text-ink-400 ring-1 ring-inset ring-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            app.nexus.ai/dashboard
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 hidden flex-col gap-1 border-r border-white/[0.06] p-4 sm:flex lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </span>
              <span className="text-sm font-semibold text-white">Nexus</span>
            </div>
            {['Overview', 'Workflows', 'Agents', 'Analytics', 'Team', 'Settings'].map(
              (item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                    i === 0
                      ? 'bg-surface/[0.06] font-medium text-white ring-1 ring-inset ring-white/10'
                      : 'text-ink-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-primary-400' : 'bg-ink-600'}`} />
                  {item}
                </div>
              ),
            )}
          </aside>

          {/* Main */}
          <div className="col-span-12 p-5 sm:col-span-9 sm:p-6 lg:col-span-10">
            {/* Top row */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white sm:text-lg">Overview</h3>
                <p className="text-xs text-ink-400">Real-time automation health</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-surface/[0.05] px-2.5 py-1 text-[11px] text-ink-300 ring-1 ring-inset ring-white/10">
                  Last 24h
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/20">
                  JD
                </span>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/[0.06] bg-surface/[0.03] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wide text-ink-400">
                      {m.label}
                    </span>
                    <m.icon className="h-4 w-4 text-ink-500" />
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="text-xl font-semibold text-white sm:text-2xl">
                      {m.value}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        m.positive === false ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {m.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-white/[0.06] bg-surface/[0.03] p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-white">Throughput</span>
                  <span className="text-[11px] text-ink-400">events / sec</span>
                </div>
                <Bars />
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-surface/[0.03] p-4 lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-white">Latency</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <Sparkline />
                <div className="mt-1 text-[11px] text-ink-400">128ms avg · -3.2%</div>
              </div>
            </div>

            {/* Workflow list */}
            <div className="mt-3 rounded-xl border border-white/[0.06] bg-surface/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-white">Recent Workflow Runs</span>
                <a className="flex items-center gap-1 text-[11px] text-primary-300 hover:text-primary-200">
                  View all <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div className="space-y-1">
                {workflowRuns.map((w) => (
                  <div
                    key={w.name}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface/[0.03]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface/[0.05]">
                      {w.status === 'Completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : w.status === 'Running' ? (
                        <Zap className="h-4 w-4 text-primary-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-ink-500" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink-100">
                      {w.name}
                    </span>
                    <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-ink-800 sm:block">
                      <div
                        className={`h-full rounded-full ${
                          w.status === 'Running'
                            ? 'bg-gradient-to-r from-primary-500 to-accent-400'
                            : w.status === 'Completed'
                              ? 'bg-emerald-500'
                              : 'bg-ink-700'
                        }`}
                        style={{ width: `${w.pct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right text-[11px] text-ink-500">{w.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-4 top-24 hidden rounded-xl border border-white/10 bg-ink-900/70 p-3 shadow-2xl backdrop-blur-xl lg:block"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 ring-1 ring-inset ring-emerald-400/30">
            <Users className="h-4 w-4 text-emerald-400" />
          </span>
          <div>
            <div className="text-[11px] text-ink-400">Active users</div>
            <div className="text-sm font-semibold text-white">3,418 online</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-4 top-40 hidden rounded-xl border border-white/10 bg-ink-900/70 p-3 shadow-2xl backdrop-blur-xl lg:block"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-500/15 ring-1 ring-inset ring-primary-400/30">
            <Cpu className="h-4 w-4 text-primary-300" />
          </span>
          <div>
            <div className="text-[11px] text-ink-400">Agents online</div>
            <div className="text-sm font-semibold text-white">42 running</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
