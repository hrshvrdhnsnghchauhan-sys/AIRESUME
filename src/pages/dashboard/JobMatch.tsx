import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { JobMatch as JobMatchType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

import { analyzeJobMatch } from '@/lib/gemini';

export default function JobMatch() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState<JobMatchType | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setAnalyzing(true);

    try {
      const analysis = await analyzeJobMatch(resumeText, company, role, jobDescription);
      const mappedPayload = {
        overall_match: analysis.matchScore,
        missing_keywords: analysis.keywordsMissing,
        missing_skills: [], // merged into missing keywords by AI
        gaps: analysis.gaps,
        interview_chance: analysis.interviewChance, // string now
      };

      if (user) {
        const payload = {
          user_id: user.uid,
          job_description: jobDescription,
          company,
          role,
          ...mappedPayload,
          created_at: new Date().toISOString(),
        };
        const optimisticResult = { id: 'pending', ...payload } as any;
        setResult(optimisticResult);
        
        try {
          const docRef = await addDoc(collection(db, 'job_matches'), payload);
          setResult({ ...optimisticResult, id: docRef.id });
        } catch (dbError) {
          console.warn('Could not save to database, but showing results locally:', dbError);
        }
      } else {
        setResult({
          id: 'temp',
          user_id: '',
          resume_id: null,
          job_description: jobDescription,
          company,
          role,
          ...mappedPayload,
          created_at: new Date().toISOString(),
        } as any);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to analyze job match');
      console.error('Error saving job match:', error);
    }

    setAnalyzing(false);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Job Match</h1>
        <p className="mt-1 text-sm text-ink-500">See how well your resume matches a job description</p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-ink-900">Your Resume</h3>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[240px]"
            />
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-ink-900">Job Description</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" />
              <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Engineer" />
            </div>
            <div className="mt-3">
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[180px]"
              />
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Button onClick={handleAnalyze} loading={analyzing} disabled={!resumeText.trim() || !jobDescription.trim()} size="lg" fullWidth>
              <Target className="h-4 w-4" />
              Analyze Match
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Match score */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-6">
              <p className="text-sm font-medium text-ink-500">Overall Match</p>
              <div className="relative mt-3 grid h-32 w-32 place-items-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
                  <motion.circle
                    cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                    className={result.overall_match >= 70 ? 'text-success-500' : result.overall_match >= 50 ? 'text-warning-500' : 'text-error-500'}
                    initial={{ strokeDasharray: '0 277' }}
                    animate={{ strokeDasharray: `${(result.overall_match / 100) * 277} 277` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-ink-900">{result.overall_match}%</span>
              </div>
              <Badge variant={result.overall_match >= 70 ? 'success' : result.overall_match >= 50 ? 'warning' : 'error'} className="mt-3">
                {result.overall_match >= 70 ? 'Strong Match' : result.overall_match >= 50 ? 'Partial Match' : 'Weak Match'}
              </Badge>
            </Card>

            <Card className="flex flex-col items-center justify-center p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-50">
                <TrendingUp className="h-6 w-6 text-accent-600" />
              </div>
              <p className="mt-3 text-sm font-medium text-ink-500">Interview Chance</p>
              <p className="text-3xl font-bold text-ink-900">{result.interview_chance as any}</p>
              <p className="mt-1 text-xs text-ink-500">Based on AI evaluation</p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <AlertTriangle className="h-4 w-4 text-warning-600" />
                Resume Gaps
              </h3>
              <ul className="mt-3 space-y-2">
                {result.gaps.length > 0 ? (
                  result.gaps.map((gap, i) => (
                    <li key={i} className="flex gap-2 text-xs text-ink-700">
                      <span className="text-warning-600">•</span> {gap}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-sm text-success-600">
                    <CheckCircle2 className="h-4 w-4" /> No major gaps detected
                  </li>
                )}
              </ul>
            </Card>
          </div>

          {/* Missing keywords & skills */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Zap className="h-4 w-4 text-brand-600" />
                Missing Keywords
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.missing_keywords.length > 0 ? (
                  result.missing_keywords.map((kw) => (
                    <span key={kw} className="rounded-full bg-warning-500/10 px-3 py-1 text-xs font-medium text-warning-600">
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-success-600">All keywords matched!</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Target className="h-4 w-4 text-brand-600" />
                Missing Skills
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.missing_skills.length > 0 ? (
                  result.missing_skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-error-500/10 px-3 py-1 text-xs font-medium text-error-600">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-success-600">All skills matched!</p>
                )}
              </div>
            </Card>
          </div>

          {result.company && result.role && (
            <Card className="p-4">
              <p className="text-sm text-ink-600">
                Match analysis for <span className="font-semibold text-ink-900">{result.role}</span> at{' '}
                <span className="font-semibold text-ink-900">{result.company}</span>
              </p>
            </Card>
          )}

          <Button variant="outline" onClick={() => { setResult(null); setResumeText(''); setJobDescription(''); setCompany(''); setRole(''); }}>
            Analyze Another Job
          </Button>
        </div>
      )}
    </div>
  );
}
