import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#030712] p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(80% 60% at 30% 20%, rgba(59,109,245,0.25), transparent 70%), radial-gradient(60% 50% at 80% 80%, rgba(6,212,168,0.15), transparent 70%)',
          }}
        />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-white">
            Vanitra<span className="text-brand-400">AI</span>
          </span>
        </Link>
        <div className="relative">
          <h2 className="font-serif text-4xl italic text-white">
            Your career, powered by AI.
          </h2>
          <p className="mt-4 max-w-md text-lg text-[#d1d5db]">
            Join thousands of professionals who landed their dream jobs with VanitraAI.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-white">12K+</p>
              <p className="text-sm text-[#9ca3af]">Users</p>
            </div>
            <div className="h-12 w-px bg-[#374151]" />
            <div>
              <p className="text-3xl font-bold text-white">85%</p>
              <p className="text-sm text-[#9ca3af]">Interview rate</p>
            </div>
            <div className="h-12 w-px bg-[#374151]" />
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-sm text-[#9ca3af]">Rating</p>
            </div>
          </div>
        </div>
        <p className="relative text-sm text-[#6b7280]">(c) 2026 VanitraAI</p>
      </div>

      {/* Right side — form */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="text-[17px] font-bold tracking-tight text-ink-900">
              Vanitra<span className="text-brand-600">AI</span>
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
