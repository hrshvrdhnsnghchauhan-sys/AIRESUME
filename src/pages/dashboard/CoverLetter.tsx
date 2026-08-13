import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Copy, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';

import { generateAICoverLetter } from '@/lib/gemini';

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'startup', label: 'Startup' },
];

export default function CoverLetter() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [tone, setTone] = useState('professional');
  const [generated, setGenerated] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateAICoverLetter({ name, role, company, experience, skills, achievements, tone });
      setGenerated(result);
    } catch (error: any) {
      alert(error.message || 'Failed to generate cover letter');
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${company || 'letter'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">AI Cover Letter</h1>
        <p className="mt-1 text-sm text-ink-500">Generate a personalized cover letter in seconds</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md">
              <Mail className="h-5 w-5 text-white" />
            </span>
            <h3 className="text-base font-semibold text-ink-900">Cover Letter Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              <Input label="Target Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Manager" />
            </div>
            <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" />
            <Input label="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="5 years" />
            <Input label="Key Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="product strategy, roadmapping, analytics" />
            <Textarea label="Key Achievements" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="Describe a notable achievement..." className="min-h-[80px]" />

            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">Tone</p>
              <div className="flex gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      tone === t.id ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerate} loading={generating} fullWidth size="lg">
              <Sparkles className="h-4 w-4" />
              Generate Cover Letter
            </Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink-900">Generated Letter</h3>
            {generated && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {generated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto rounded-xl border border-ink-200 bg-ink-50/50 p-4"
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-800">
                {generated}
              </pre>
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-ink-300 py-16">
              <FileText className="h-12 w-12 text-ink-300" />
              <p className="mt-4 text-sm text-ink-500">Your cover letter will appear here</p>
              <p className="mt-1 text-xs text-ink-400">Fill in the form and click Generate</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
