import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Notification } from '@/types';
import { relativeTime, initials } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profile?.user_id) return;
      try {
        const q = query(collection(db, 'notifications'), where('user_id', '==', profile.user_id));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
        data.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        setNotifications(data.slice(0, 10));
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
    };
    fetchNotifications();
  }, [profile]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) batch.update(doc(db, 'notifications', n.id), { read: true });
    });
    await batch.commit();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 sm:px-6"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 2px 20px rgba(99, 102, 241, 0.06)',
      }}
    >
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-all lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="h-10 w-full max-w-sm rounded-xl border border-ink-200 bg-ink-50 pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        {/* New Resume */}
        <button
          onClick={() => navigate('/app/resumes')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 btn-glow"
          style={{ background: 'linear-gradient(135deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))' }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Resume</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-xl p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xl shadow-ink-900/10"
              >
                <div className="flex items-center justify-between border-b border-ink-100 p-3 bg-ink-50">
                  <span className="text-sm font-semibold text-ink-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-ink-500">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 border-b border-ink-50 p-3 hover:bg-ink-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-brand-500' : 'bg-ink-300'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                          {n.body && <p className="text-xs text-ink-500 mt-0.5">{n.body}</p>}
                          <p className="mt-1 text-[11px] font-medium text-ink-400">{relativeTime(n.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/app/settings')}
          className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white ring-2 ring-white shadow-sm hover:shadow-md transition-all hover:scale-105"
        >
          {initials(profile?.full_name || 'User')}
        </button>
      </div>
    </header>
  );
}
