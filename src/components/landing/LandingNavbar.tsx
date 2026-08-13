import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'Templates', href: '#templates' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <nav
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 sm:px-5',
          scrolled
            ? 'border-ink-200/80 bg-surface/80 py-2.5 shadow-lg shadow-ink-900/5 backdrop-blur-xl'
            : 'border-transparent bg-surface/40 py-3 backdrop-blur-md',
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl shadow-md"
            style={{
              background: 'linear-gradient(135deg, var(--theme-gradient-from, #3b82f6), var(--theme-gradient-to, #6366f1))',
              boxShadow: '0 4px 14px var(--theme-hero-orb1, rgba(59,130,246,0.3))'
            }}
          >
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-ink-900">
            Vanitra<span style={{ color: 'var(--theme-600, #2563eb)' }}>AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors duration-200 hover:text-ink-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign in
          </Button>
          <Button size="sm" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-lg p-2 text-ink-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-4 top-16 rounded-2xl border border-ink-200 bg-surface p-4 shadow-xl md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-ink-200 pt-3">
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button size="sm" fullWidth onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
