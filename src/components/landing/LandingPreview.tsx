import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ScanSearch, MessageSquare, CheckCircle2, Zap } from 'lucide-react';
import { fadeUp } from '@/lib/motion';

const tabs = [
  {
    id: 'builder',
    label: 'Resume Builder',
    icon: FileText,
    title: 'Build a stunning resume in minutes',
    description: 'Drag-and-drop sections, choose from professional templates, and see changes live as you type.',
  },
  {
    id: 'analyzer',
    label: 'ATS Analysis',
    icon: ScanSearch,
    title: 'See your resume through recruiter eyes',
    description: 'Get detailed scores across ATS compatibility, formatting, keywords, grammar, and impact.',
  },
  {
    id: 'copilot',
    label: 'AI Copilot',
    icon: MessageSquare,
    title: 'Your AI writing partner',
    description: 'Chat with AI to rewrite bullets, generate summaries, and improve every section instantly.',
  },
];

export default function LandingPreview() {
  const [active, setActive] = useState(0);

  return (
    <section id="preview" className="relative bg-ink-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            See it in action
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            A preview of what's inside
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                active === i
                  ? 'bg-ink-900 text-white shadow-lg'
                  : 'bg-surface text-ink-600 ring-1 ring-inset ring-ink-200 hover:text-ink-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preview content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
                {tabs[active].title}
              </h3>
              <p className="mt-3 text-lg text-ink-600">{tabs[active].description}</p>
              <ul className="mt-6 space-y-3">
                {[
                  'Real-time preview as you edit',
                  'Professional templates included',
                  'Export to PDF, DOCX, or Markdown',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ink-700">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-surface p-6 shadow-xl">
              {active === 0 && <BuilderPreview />}
              {active === 1 && <AnalyzerPreview />}
              {active === 2 && <CopilotPreview />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function BuilderPreview() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['Personal', 'Experience', 'Skills', 'Education'].map((s, i) => (
          <span
            key={s}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              i === 1 ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100' : 'bg-ink-100 text-ink-500'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-ink-200 p-4">
        <div className="h-4 w-32 rounded bg-ink-900" />
        <div className="mt-1 h-3 w-48 rounded bg-ink-300" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-ink-100" />
          <div className="h-3 w-5/6 rounded bg-ink-100" />
          <div className="h-3 w-4/6 rounded bg-ink-100" />
        </div>
        <div className="mt-4 h-px bg-ink-200" />
        <div className="mt-4 h-3 w-24 rounded bg-brand-600" />
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <div className="h-2.5 w-3/4 rounded bg-ink-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <div className="h-2.5 w-2/3 rounded bg-ink-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyzerPreview() {
  const scores = [
    { label: 'ATS Compatible', value: 94, color: 'bg-success-500' },
    { label: 'Formatting', value: 88, color: 'bg-brand-500' },
    { label: 'Keywords', value: 76, color: 'bg-warning-500' },
    { label: 'Impact', value: 82, color: 'bg-accent-500' },
  ];
  return (
    <div className="space-y-4">
      {scores.map((s) => (
        <div key={s.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-700">{s.label}</span>
            <span className="font-bold text-ink-900">{s.value}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.value}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${s.color}`}
            />
          </div>
        </div>
      ))}
      <div className="rounded-lg bg-warning-500/10 p-3 text-xs text-warning-600">
        Missing keywords: Kubernetes, CI/CD, Microservices
      </div>
    </div>
  );
}

function CopilotPreview() {
  return (
    <div className="space-y-3">
      <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
        Make my bullet points more impactful
      </div>
      <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-ink-100 px-4 py-2.5 text-sm text-ink-800">
        <p className="font-medium">Here's an improved version:</p>
        <p className="mt-1 text-ink-600">
          "Spearheaded a microservices migration that reduced latency by 40% and served 2M+ daily requests."
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-600">
          <Zap className="h-3 w-3" />
          Powered by Gemini AI
        </div>
      </div>
    </div>
  );
}
