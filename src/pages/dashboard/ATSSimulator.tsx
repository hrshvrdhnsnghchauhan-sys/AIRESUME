import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  Lightbulb,
  Wrench,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type RejectionReason = {
  reason: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
};

type ATSResult = {
  passRate: number;
  parsedSections: string[];
  rejectedReasons: RejectionReason[];
  recommendedFixes: string[];
  foundKeywords: string[];
  missingKeywords: string[];
};

import { simulateATS } from '@/lib/gemini';

export default function ATSSimulator() {
  const [text, setText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSimulate = async () => {
    if (!text.trim() || !jobDescription.trim()) return;
    setAnalyzing(true);
    try {
      const res = await simulateATS(text, jobDescription);

      // Compute keyword overlap locally so the UI always has data
      const stopWords = new Set(['the','and','for','you','will','with','that','this','have','from','your','are','our','team','role','job','work','must','can','who','what','all','one','may','not','but','its','has','had','was','were','been','being','per','etc','able','also','into','than','then','they','them','their','there','these','those','about','across','after','again','against','before','between','both','each','other','some','such','through','under','while','during','using','well','like','make','made','use','used','new','good','great','best','more','most','over','only','any','many','much','very','just','because','should','could','would','where','when','which','why','how','out','own','same','so','too','up','down','off','on','at','by','in','to','of','or','as','is','it','be','do','if','no','we','an','am','e','s']);
      const lowerResume = text.toLowerCase();
      const lowerJd = jobDescription.toLowerCase();
      const jdKeywords = Array.from(new Set(
        lowerJd.replace(/[^a-z0-9+#.\- ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w))
      ));
      const foundKeywords = jdKeywords.filter((kw) => lowerResume.includes(kw));
      const missingKeywords = jdKeywords.filter((kw) => !lowerResume.includes(kw));

      const severityFor = (reason: string): 'high' | 'medium' | 'low' =>
        /email|phone|contact/.test(reason) ? 'high' :
        /missing|no |not parse/.test(reason) ? 'medium' : 'low';

      const rejectedReasons = res.rejectionReasons.map((r) => ({
        reason: r,
        severity: severityFor(r),
        fix: /email|phone|contact/.test(r)
          ? 'Add your email and phone number at the top of the resume.'
          : /experience|education|skills/.test(r)
            ? 'Use the standard section header so the ATS can parse it.'
            : 'Mirror the exact keywords from the job description in your resume.'
      }));

      const recommendedFixes = [
        ...missingKeywords.slice(0, 3).map((kw) => `Add the keyword "${kw}" — it appears in the job description but not in your resume.`),
        ...rejectedReasons.map((r) => r.fix),
      ].slice(0, 5);

      // Format response to match previous expected structure roughly for the UI
      setResult({
        passRate: res.passRate,
        parsedSections: Object.keys(res.parsedSections).filter((k) => (res.parsedSections as any)[k]),
        rejectedReasons,
        recommendedFixes,
        foundKeywords,
        missingKeywords
      });
    } catch (err: any) {
      alert(err.message || 'Failed to simulate ATS');
    }
    setAnalyzing(false);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">ATS Simulator</h1>
        <p className="mt-1 text-sm text-ink-500">
          See your resume through an Applicant Tracking System — find what gets you rejected
        </p>
      </div>

      {!result ? (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
              <FileSearch className="h-6 w-6 text-white" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink-900">Paste your resume & JD</h3>
              <p className="text-sm text-ink-500">We'll simulate how an ATS parses and scores it</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Resume Content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="min-h-[280px]"
            />
            <Textarea
              label="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[280px]"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSimulate} loading={analyzing} disabled={!text.trim() || !jobDescription.trim()} size="lg">
              <Target className="h-4 w-4" />
              Run ATS Simulation
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pass rate */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-6">
              <p className="text-sm font-medium text-ink-500">ATS Pass Rate</p>
              <div className="relative mt-3 grid h-32 w-32 place-items-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
                  <motion.circle
                    cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                    className={result.passRate >= 70 ? 'text-success-500' : result.passRate >= 50 ? 'text-warning-500' : 'text-error-500'}
                    initial={{ strokeDasharray: '0 277' }}
                    animate={{ strokeDasharray: `${(result.passRate / 100) * 277} 277` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-ink-900">{result.passRate}%</span>
              </div>
              <Badge variant={result.passRate >= 70 ? 'success' : result.passRate >= 50 ? 'warning' : 'error'} className="mt-3">
                {result.passRate >= 70 ? 'Likely to Pass' : result.passRate >= 50 ? 'At Risk' : 'Likely Rejected'}
              </Badge>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <CheckCircle2 className="h-4 w-4 text-success-600" />
                Parsed Sections
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {['experience', 'education', 'skills', 'summary', 'projects', 'certifications'].map((s) => (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      result.parsedSections.includes(s)
                        ? 'bg-success-500/10 text-success-600'
                        : 'bg-error-500/10 text-error-600'
                    }`}
                  >
                    {result.parsedSections.includes(s) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Rejection reasons */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <AlertTriangle className="h-4 w-4 text-warning-600" />
              Predicted Rejection Reasons
            </h3>
            <div className="mt-4 space-y-3">
              {result.rejectedReasons.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg bg-success-500/10 p-3 text-sm text-success-600">
                  <CheckCircle2 className="h-5 w-5" /> No major rejection risks detected — your resume looks ATS-friendly!
                </div>
              ) : (
                result.rejectedReasons.map((r: any, i: number) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded-lg p-3 ${
                      r.severity === 'high' ? 'bg-error-500/10' : r.severity === 'medium' ? 'bg-warning-500/10' : 'bg-ink-100'
                    }`}
                  >
                    <span
                      className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        r.severity === 'high' ? 'bg-error-500 text-white' : r.severity === 'medium' ? 'bg-warning-500 text-white' : 'bg-ink-400 text-white'
                      }`}
                    >
                      {r.severity}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{r.reason}</p>
                      <p className="mt-0.5 text-xs text-ink-600">
                        <Wrench className="mr-1 inline h-3 w-3" />
                        {r.fix}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Keywords */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <CheckCircle2 className="h-4 w-4 text-success-600" />
                Keywords Found
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.foundKeywords.length > 0 ? (
                  result.foundKeywords.map((kw: string) => (
                    <span key={kw} className="rounded-full bg-success-500/10 px-3 py-1 text-xs font-medium text-success-600">
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-ink-500">No technical keywords found</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <AlertTriangle className="h-4 w-4 text-warning-600" />
                Missing Keywords
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.missingKeywords.map((kw: string) => (
                  <span key={kw} className="rounded-full bg-warning-500/10 px-3 py-1 text-xs font-medium text-warning-600">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommended fixes */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Lightbulb className="h-4 w-4 text-brand-600" />
              Recommended Fixes
            </h3>
            <ul className="mt-3 space-y-2">
              {result.recommendedFixes.map((fix: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  {fix}
                </li>
              ))}
            </ul>
          </Card>

          <Button variant="outline" onClick={() => { setResult(null); setText(''); }}>
            Run Another Simulation
          </Button>
        </div>
      )}
    </div>
  );
}
