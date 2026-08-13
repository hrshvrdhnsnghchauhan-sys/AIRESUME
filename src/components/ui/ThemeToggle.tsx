import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type ColorTheme } from '@/context/useTheme';
import { Palette } from 'lucide-react';

const themes: { id: ColorTheme; label: string; gradient: string; ring: string }[] = [
  { id: 'blue',    label: 'Ocean Blue',      gradient: 'from-blue-500 to-indigo-600',    ring: '#3b82f6' },
  { id: 'purple',  label: 'Royal Purple',    gradient: 'from-purple-500 to-pink-500',    ring: '#a855f7' },
  { id: 'emerald', label: 'Forest Green',    gradient: 'from-emerald-500 to-cyan-500',   ring: '#10b981' },
  { id: 'sunset',  label: 'Sunset Orange',   gradient: 'from-orange-500 to-rose-500',    ring: '#f97316' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 shadow-sm hover:border-ink-300 hover:shadow-md transition-all duration-200"
        title="Change Theme"
      >
        <span className={`h-4 w-4 rounded-full bg-gradient-to-br ${current.gradient} flex-shrink-0`} />
        <Palette className="h-4 w-4 text-ink-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-ink-200 bg-white p-2 shadow-xl shadow-ink-900/10"
            >
              <p className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-400">Pick a Theme</p>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    theme === t.id
                      ? 'bg-ink-50 text-ink-900'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-xl bg-gradient-to-br ${t.gradient} flex-shrink-0 shadow-sm`}
                    style={{ boxShadow: theme === t.id ? `0 0 0 3px ${t.ring}40` : 'none' }}
                  />
                  <span>{t.label}</span>
                  {theme === t.id && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: t.ring }} />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
