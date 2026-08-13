import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Target,
  MessageSquare,
  Mail,
  Globe,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Settings,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/lib/utils';

const navItems = [
  { label: 'Overview', href: '/app', icon: LayoutDashboard, end: true },
  { label: 'Resume Builder', href: '/app/resumes', icon: FileText },
  { label: 'Analyzer', href: '/app/analyzer', icon: ScanSearch },
  { label: 'ATS Simulator', href: '/app/ats', icon: Target },
  { label: 'Job Match', href: '/app/job-match', icon: Target },
  { label: 'AI Copilot', href: '/app/copilot', icon: MessageSquare },
  { label: 'Cover Letter', href: '/app/cover-letter', icon: Mail },
  { label: 'LinkedIn', href: '/app/linkedin', icon: Globe },
  { label: 'Interview Coach', href: '/app/interview', icon: GraduationCap },
  { label: 'Applications', href: '/app/applications', icon: Briefcase },
  { label: 'Career Dashboard', href: '/app/career', icon: TrendingUp },
];

export default function DashboardSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0) }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r',
          'lg:static lg:z-0 lg:translate-x-0',
          !open && '-translate-x-full lg:translate-x-0',
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '4px 0 24px rgba(99, 102, 241, 0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-ink-900">
            Vanitra<span className="text-brand-600">AI</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-50 text-brand-700 border-r-[3px] border-brand-500'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    style={{ width: 17, height: 17 }}
                    className={cn(
                      'shrink-0 transition-colors duration-200',
                      isActive ? 'text-brand-600' : 'text-ink-400',
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-dot"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-ink-100 p-3 space-y-1">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Settings style={{ width: 17, height: 17 }} className={cn('shrink-0', isActive ? 'text-brand-600' : 'text-ink-400')} />
                <span>Settings</span>
              </>
            )}
          </NavLink>

          {/* User card */}
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 border border-ink-100 px-3 py-2.5 mt-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
              {initials(profile?.full_name || 'User')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {profile?.full_name || 'User'}
              </p>
              <p className="truncate text-xs text-ink-500">{profile?.headline || 'No headline'}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-1.5 text-ink-400 transition-all hover:bg-red-50 hover:text-red-500"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
