import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Briefcase, Target, TrendingUp, Plus,
  ArrowRight, Mail, MessageSquare, Star, Activity, BarChart3,
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { relativeTime } from '@/lib/utils';
import { container, fadeUp } from '@/lib/motion';

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  wishlist: { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
  applied:  { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  interview:{ bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  rejected: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  offer:    { bg: '#fefce8', text: '#ca8a04', dot: '#eab308' },
  accepted: { bg: '#f0fdf4', text: '#15803d', dot: '#16a34a' },
};

export default function DashboardOverview() {
  const { stats, resumes, applications, loading } = useDashboardData();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { label: 'New Resume',   icon: FileText,      href: '/app/resumes',      bg: 'from-blue-500 to-blue-700',     shadow: 'rgba(37,99,235,0.3)' },
    { label: 'Analyze',      icon: Target,         href: '/app/analyzer',     bg: 'from-indigo-500 to-indigo-700', shadow: 'rgba(79,70,229,0.3)' },
    { label: 'AI Copilot',   icon: MessageSquare,  href: '/app/copilot',      bg: 'from-violet-500 to-purple-600', shadow: 'rgba(124,58,237,0.3)' },
    { label: 'Cover Letter', icon: Mail,           href: '/app/cover-letter', bg: 'from-sky-500 to-cyan-600',      shadow: 'rgba(8,145,178,0.3)' },
  ];

  const metrics = [
    { label: 'Total Resumes', value: stats.totalResumes,      icon: FileText,   bg: 'bg-blue-50',   icon_color: 'text-blue-600',   border: '#bfdbfe' },
    { label: 'Applications',  value: stats.totalApplications,  icon: Briefcase,  bg: 'bg-indigo-50', icon_color: 'text-indigo-600', border: '#c7d2fe' },
    { label: 'Interviews',    value: stats.interviews,          icon: Activity,   bg: 'bg-emerald-50',icon_color: 'text-emerald-600',border: '#a7f3d0' },
    { label: 'Offers',        value: stats.offers,              icon: Star,       bg: 'bg-amber-50',  icon_color: 'text-amber-600',  border: '#fde68a' },
  ];

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-ink-900">
          Welcome back, <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'there'} 👋</span>
        </h1>
        <p className="mt-1 text-sm text-ink-500">Here's your career overview at a glance.</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {quickActions.map((a) => (
          <motion.button
            key={a.label}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(a.href)}
            className="quick-action-card group flex items-center gap-3 p-4 text-left"
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${a.bg} flex-shrink-0 shadow-sm`}
              style={{ boxShadow: `0 4px 14px ${a.shadow}` }}
            >
              <a.icon className="h-5 w-5 text-white" strokeWidth={2} />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink-800">{a.label}</span>
            <ArrowRight className="h-4 w-4 text-ink-400 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>
        ))}
      </motion.div>

      {/* Metrics */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        {metrics.map((m, idx) => (
          <motion.div key={m.label} variants={fadeUp} custom={idx}>
            <div className="stat-card p-5" style={{ borderTop: `3px solid ${m.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">{m.label}</span>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${m.bg}`}>
                  <m.icon className={`h-4 w-4 ${m.icon_color}`} strokeWidth={2.2} />
                </span>
              </div>
              <p className="text-4xl font-black text-ink-900" style={{ letterSpacing: '-0.04em' }}>
                {loading ? <span className="inline-block w-10 h-8 rounded-lg shimmer" /> : m.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Interview Rate + Recent Resumes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-6">
        {/* Interview Rate */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-ink-900">Interview Rate</h3>
          </div>
          <p className="text-xs text-ink-500 mb-5">Based on your applications</p>
          <div className="flex items-center gap-6">
            <div className="relative grid h-28 w-28 place-items-center flex-shrink-0">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#blueGrad)" strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: '0 264' }}
                  animate={{ strokeDasharray: `${(stats.interviewRate / 100) * 264} 264` }}
                  transition={{ duration: 1.2, ease: [0.22,1,0.36,1] }}
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-2xl font-black text-ink-900">{stats.interviewRate}%</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Applied',     value: stats.appliedCount, color: '#3b82f6' },
                { label: 'Interviews',  value: stats.interviews,   color: '#6366f1' },
                { label: 'Offers',      value: stats.offers,       color: '#10b981' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-ink-500">{s.label}</span>
                  <span className="ml-auto text-sm font-bold text-ink-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Resumes */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-ink-900">Recent Resumes</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/resumes')}>View all</Button>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl shimmer" />)}
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 drop-zone">
              <FileText className="h-10 w-10 text-blue-200 mb-3" />
              <p className="text-sm text-ink-500 mb-3">No resumes yet</p>
              <Button size="sm" onClick={() => navigate('/app/resumes')}><Plus className="h-4 w-4" />Create Resume</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {resumes.slice(0, 5).map(r => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 flex-shrink-0">
                    <FileText className="h-4.5 w-4.5 text-brand-600" style={{ width: 18, height: 18 }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{r.title}</p>
                    <p className="text-xs text-ink-400">Updated {relativeTime(r.updated_at)}</p>
                  </div>
                  <span className="rounded-lg bg-ink-100 px-2.5 py-0.5 text-xs font-medium capitalize text-ink-600">{r.template}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-ink-900">Recent Applications</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/app/applications')}>View all</Button>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl shimmer" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 drop-zone">
            <Briefcase className="h-10 w-10 text-blue-200 mb-3" />
            <p className="text-sm text-ink-500 mb-3">No applications tracked yet</p>
            <Button size="sm" onClick={() => navigate('/app/applications')}><Plus className="h-4 w-4" />Track Application</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  {['Company','Role','Status','Updated'].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-ink-400 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 6).map(app => {
                  const sc = statusStyles[app.status] || statusStyles.wishlist;
                  return (
                    <tr key={app.id} className="border-b border-ink-50 hover:bg-ink-50/70 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-ink-900">{app.company}</td>
                      <td className="py-3.5 pr-4 text-ink-600">{app.role}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-ink-400 text-xs">{relativeTime(app.updated_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
