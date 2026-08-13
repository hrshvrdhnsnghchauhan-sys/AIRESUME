import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { container, fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started',
    features: [
      '1 resume',
      'Basic ATS analysis',
      '3 AI Copilot messages/day',
      'PDF export',
      'Application tracker',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 1499, yearly: 1199 },
    description: 'For serious job seekers',
    features: [
      'Unlimited resumes',
      'Full ATS analysis + simulator',
      'Unlimited AI Copilot',
      'All export formats',
      'Job match + tailoring',
      'Cover letter generator',
      'Interview coach',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Teams',
    price: { monthly: 3999, yearly: 2999 },
    description: 'For career services & bootcamps',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared templates',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Dedicated manager',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function LandingPricing() {
  const [yearly, setYearly] = useState(true);
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
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
            Pricing
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl"
          >
            Simple, transparent pricing
          </motion.h2>

          {/* Toggle */}
          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-3">
            <span className={cn('text-sm font-medium', !yearly ? 'text-ink-900' : 'text-ink-400')}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors duration-200',
                yearly ? 'bg-brand-600' : 'bg-ink-300',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform duration-200',
                  yearly ? 'translate-x-6' : 'translate-x-1',
                )}
              />
            </button>
            <span className={cn('text-sm font-medium', yearly ? 'text-ink-900' : 'text-ink-400')}>
              Yearly
              <span className="ml-1.5 text-xs text-success-600">Save 20%</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={cn(
                'relative rounded-2xl border p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl',
                plan.highlight
                  ? 'border-brand-600 bg-surface ring-2 ring-brand-600/20'
                  : 'border-ink-200 bg-surface',
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-ink-900">
                  ₹{yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="text-sm text-ink-500">/mo</span>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className={cn(
                  'mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200',
                  plan.highlight
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700'
                    : 'border border-ink-300 text-ink-800 hover:bg-ink-50',
                )}
              >
                {plan.cta}
              </button>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-700">
                    <Check
                      className={cn(
                        'mt-0.5 h-5 w-5 shrink-0',
                        plan.highlight ? 'text-brand-600' : 'text-success-600',
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
