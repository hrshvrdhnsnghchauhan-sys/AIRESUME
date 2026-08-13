import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Hexagon, ArrowRight } from 'lucide-react';
import { fadeUp, easeOut } from '@/lib/motion';

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-5"
    >
      <motion.nav
        animate={{
          backgroundColor: scrolled ? 'rgba(12,15,22,0.72)' : 'rgba(12,15,22,0.30)',
          borderColor: scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
          boxShadow: scrolled
            ? '0 10px 40px -12px rgba(0,0,0,0.55), inset 0 1px 0 0 rgba(255,255,255,0.06)'
            : '0 0 0 rgba(0,0,0,0)',
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.45, ease: easeOut }}
        style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
        className="flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 sm:px-5"
      >
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/40">
            <Hexagon className="h-5 w-5 text-white" strokeWidth={2.4} />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">
            Nexus
          </span>
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-ink-300 transition-colors duration-200 hover:text-white"
              >
                {item.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#signin"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-ink-200 transition-colors duration-200 hover:text-white sm:block"
          >
            Sign in
          </a>
          <a
            href="#demo"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-ink-950 shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20"
          >
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary-100 via-white to-primary-100 transition-transform duration-500 group-hover:translate-x-full"
              aria-hidden
            />
            <span className="relative">Get started</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.nav>
    </motion.header>
  );
}
