import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles, Copy, CheckCircle2, Lightbulb, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';

type Analysis = {
  headlineSuggestions: string[];
  aboutSuggestion: string;
  suggestedKeywords: string[];
  scoreBreakdown: { section: string; score: number; suggestion: string }[];
};

import { optimizeLinkedInProfile } from '@/lib/gemini';

export default function LinkedInOptimizer() {
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [result, setResult] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await optimizeLinkedInProfile(headline, about, skills, experience);
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to optimize profile');
    }
    setAnalyzing(false);
  };

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">LinkedIn Optimizer</h1>
        <p className="mt-1 text-sm text-ink-500">Optimize your LinkedIn profile for recruiter discovery</p>
      </div>

      {!result ? (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#0a66c2] to-[#004182] shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink-900">Enter your LinkedIn profile content</h3>
              <p className="text-sm text-ink-500">Paste your current headline, about section, and skills</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Current Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Software Engineer at Google" />
            <Textarea label="About Section" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Paste your current About section..." className="min-h-[120px]" />
            <Input label="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, React, AWS, Leadership" />
            <Textarea label="Experience Summary" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Brief summary of your work experience..." className="min-h-[100px]" />

            <Button onClick={handleAnalyze} loading={analyzing} disabled={!headline && !about} fullWidth size="lg">
              <Sparkles className="h-4 w-4" />
              Analyze & Optimize
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Score breakdown */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.scoreBreakdown.map((s) => (
              <Card key={s.section} className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{s.section}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-2xl font-bold text-ink-900">{s.score}</span>
                  <span className="text-xs text-ink-500">/100</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${s.score >= 80 ? 'bg-success-500' : s.score >= 60 ? 'bg-warning-500' : 'bg-error-500'}`}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-600">{s.suggestion}</p>
              </Card>
            ))}
          </div>

          {/* Headline suggestions */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Lightbulb className="h-4 w-4 text-brand-600" />
              Headline Suggestions
            </h3>
            <div className="mt-4 space-y-3">
              {result.headlineSuggestions.map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-ink-50 p-3">
                  <p className="flex-1 text-sm text-ink-800">{s}</p>
                  <button
                    onClick={() => copyText(s, `headline-${i}`)}
                    className="shrink-0 rounded-lg p-2 text-ink-400 hover:bg-ink-200 hover:text-ink-700"
                  >
                    {copiedField === `headline-${i}` ? <CheckCircle2 className="h-4 w-4 text-success-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* About suggestion */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Lightbulb className="h-4 w-4 text-brand-600" />
                Improved About Section
              </h3>
              <button
                onClick={() => copyText(result.aboutSuggestion, 'about')}
                className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
              >
                {copiedField === 'about' ? <CheckCircle2 className="h-4 w-4 text-success-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-ink-50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-800">
                {result.aboutSuggestion}
              </pre>
            </div>
          </Card>

          {/* Suggested keywords */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              Suggested Keywords to Add
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.suggestedKeywords.map((kw) => (
                <span key={kw} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {kw}
                </span>
              ))}
            </div>
          </Card>

          <Button variant="outline" onClick={() => setResult(null)}>
            Analyze Another Profile
          </Button>
        </div>
      )}
    </div>
  );
}
