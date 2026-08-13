import { Link } from 'react-router-dom';
import { Sparkles, Share2, Code, Globe } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Templates', href: '#templates' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-ink-200 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-600/30">
                <Sparkles className="h-5 w-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-ink-900">
                Vanitra<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-500">
              The AI Career Operating System. Build, analyze, and optimize your career with AI.
            </p>
            <div className="mt-5 flex gap-3">
              {[Share2, Code, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:border-ink-300 hover:text-ink-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-500 transition-colors hover:text-ink-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-8 sm:flex-row">
          <p className="text-sm text-ink-500">
            (c) 2026 VanitraAI. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">Made with AI for job seekers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
