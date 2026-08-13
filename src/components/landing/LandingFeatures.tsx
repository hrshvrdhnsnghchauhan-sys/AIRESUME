import { motion } from 'framer-motion';
import {
  FileText,
  ScanSearch,
  Target,
  MessageSquare,
  Mail,
  Briefcase,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { container, fadeUp } from '@/lib/motion';

const features = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Drag-and-drop sections, live preview, multiple templates, and instant PDF export.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: ScanSearch,
    title: 'Resume Analyzer',
    description: 'Upload your resume and get ATS, formatting, grammar, keyword, and impact scores.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: Target,
    title: 'ATS Simulator',
    description: 'See exactly what recruiters see. Find missing keywords and predict rejection reasons.',
    color: 'from-brand-600 to-accent-600',
  },
  {
    icon: Briefcase,
    title: 'Job Match',
    description: 'Paste a job description and get an instant match score with tailored recommendations.',
    color: 'from-accent-600 to-brand-600',
  },
  {
    icon: MessageSquare,
    title: 'AI Copilot',
    description: 'Chat with AI to rewrite bullets, generate summaries, and improve your resume instantly.',
    color: 'from-brand-500 to-brand-600',
  },
  {
    icon: Mail,
    title: 'Cover Letters',
    description: 'Generate personalized cover letters tailored to each job description in seconds.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: GraduationCap,
    title: 'Interview Coach',
    description: 'Practice with AI-generated questions, STAR answers, and real-time feedback.',
    color: 'from-brand-600 to-brand-800',
  },
  {
    icon: TrendingUp,
    title: 'Application Tracker',
    description: 'Track every application from wishlist to offer with notes, reminders, and timeline.',
    color: 'from-accent-600 to-accent-700',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-wide text-brand-600"
          >
            Everything you need
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl"
          >
            One platform for your entire career
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-ink-600"
          >
            From building your first resume to landing your dream job — VanitraAI handles it all.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-ink-200 bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink-900/5"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
