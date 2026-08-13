import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  ScanSearch,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { ResumeAnalysis, AnalysisScores, FeedbackItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// Initialize PDF.js worker using Vite's ?url syntax
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Local analysis engine — evaluates resume text without external AI
function analyzeResume(text: string): { scores: AnalysisScores; feedback: FeedbackItem[]; missingKeywords: string[]; missingSections: string[]; weakBullets: string[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const wordCount = text.split(/\s+/).length;
  const lowerText = text.toLowerCase();

  // ATS: check for standard sections, contact info, clean formatting
  const hasEmail = /\S+@\S+\.\S+/.test(text);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasExperience = /experience|work|employment/i.test(text);
  const hasEducation = /education|degree|university|bachelor|master/i.test(text);
  const hasSkills = /skills|technologies|tools/i.test(text);
  const atsChecks = [hasEmail, hasPhone, hasExperience, hasEducation, hasSkills];
  const ats = Math.round((atsChecks.filter(Boolean).length / atsChecks.length) * 100);

  // Formatting: check line length, consistency
  const avgLineLength = lines.reduce((a, l) => a + l.length, 0) / (lines.length || 1);
  const formatting = avgLineLength > 120 ? 60 : avgLineLength > 80 ? 75 : 85;

  // Grammar: basic checks
  const hasPassive = /\b(was|were|been|being)\b/i.test(text);
  const grammar = hasPassive ? 72 : 88;

  // Keywords: check for action verbs and industry terms
  const actionVerbs = ['led', 'built', 'created', 'developed', 'managed', 'designed', 'implemented', 'launched', 'improved', 'increased', 'reduced', 'optimized', 'spearheaded', 'architected'];
  const foundVerbs = actionVerbs.filter((v) => lowerText.includes(v));
  const keyword = Math.min(100, Math.round((foundVerbs.length / 6) * 100));

  // Impact: check for quantified results
  const hasNumbers = /\d+%|\$\d+|\d+,\d+|\d+k|\d+m/i.test(text);
  const impact = hasNumbers ? 85 : 55;

  // Readability
  const readability = wordCount > 500 ? 70 : wordCount > 200 ? 85 : 80;

  // Action verb score
  const actionVerb = Math.min(100, Math.round((foundVerbs.length / 5) * 100));

  const overall = Math.round((ats + formatting + grammar + keyword + impact + readability + actionVerb) / 7);

  const feedback: FeedbackItem[] = [];
  if (!hasEmail) feedback.push({ type: 'critical', section: 'Contact', message: 'No email address found', suggestion: 'Add a professional email address' });
  if (!hasPhone) feedback.push({ type: 'warning', section: 'Contact', message: 'No phone number found', suggestion: 'Add a phone number for recruiters' });
  if (!hasNumbers) feedback.push({ type: 'warning', section: 'Impact', message: 'No quantified results found', suggestion: 'Add metrics like "increased revenue by 25%"' });
  if (foundVerbs.length < 3) feedback.push({ type: 'warning', section: 'Language', message: 'Not enough action verbs', suggestion: 'Start bullets with strong verbs like "Led", "Built", "Optimized"' });
  if (hasPassive) feedback.push({ type: 'warning', section: 'Language', message: 'Passive voice detected', suggestion: 'Use active voice for stronger impact' });
  if (hasExperience && hasEducation && hasSkills) feedback.push({ type: 'positive', section: 'Structure', message: 'All essential sections present' });
  if (hasNumbers) feedback.push({ type: 'positive', section: 'Impact', message: 'Good use of quantified results' });

  const commonKeywords = ['python', 'javascript', 'react', 'node', 'aws', 'docker', 'kubernetes', 'sql', 'git', 'agile', 'ci/cd', 'microservices'];
  const missingKeywords = commonKeywords.filter((k) => !lowerText.includes(k));

  const requiredSections = ['experience', 'education', 'skills'];
  const missingSections = requiredSections.filter((s) => !lowerText.includes(s));

  const weakBullets = lines.filter((l) => l.startsWith('-') || l.startsWith('•')).filter((l) => !/\d/.test(l) && !actionVerbs.some((v) => l.toLowerCase().includes(v))).slice(0, 5);

  return { scores: { ats, formatting, grammar, keyword, impact, readability, actionVerb, overall }, feedback, missingKeywords, missingSections, weakBullets };
}

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setLoadingStep('Extracting document context...');

    // Simulate smooth AI thinking process for better UX
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep('Scanning for ATS compatibility...');
    
    await new Promise(r => setTimeout(r, 700));
    setLoadingStep('Evaluating impact and grammar...');

    await new Promise(r => setTimeout(r, 600));
    const result = analyzeResume(text);

    try {
      if (user) {
        const payload = {
          user_id: user.uid,
          raw_text: text,
          scores: result.scores,
          feedback: result.feedback,
          missing_keywords: result.missingKeywords,
          missing_sections: result.missingSections,
          weak_bullets: result.weakBullets,
          created_at: new Date().toISOString(),
        };
        // Set local state immediately for snappy UX, even if db save fails
        const optimisticAnalysis = { id: 'pending', ...payload } as ResumeAnalysis;
        setAnalysis(optimisticAnalysis);
        setHistory([optimisticAnalysis, ...history]);
        
        try {
          const docRef = await addDoc(collection(db, 'resume_analyses'), payload);
          setAnalysis({ ...optimisticAnalysis, id: docRef.id });
        } catch (dbError) {
          console.warn('Could not save to database, but showing results locally:', dbError);
        }
      } else {
        setAnalysis({
          id: 'temp',
          user_id: '',
          resume_id: null,
          raw_text: text,
          scores: result.scores,
          feedback: result.feedback,
          missing_keywords: result.missingKeywords,
          missing_sections: result.missingSections,
          weak_bullets: result.weakBullets,
          created_at: new Date().toISOString(),
        } as ResumeAnalysis);
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
    }

    setAnalyzing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setText(fullText);
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } else {
        // Fallback for txt
        const reader = new FileReader();
        reader.onload = (event) => {
          setText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Failed to parse the file. Please ensure it is a valid PDF, DOCX, or TXT file.');
    }
  };

  const scoreData = analysis?.scores
    ? [
        { label: 'ATS Compatible', value: analysis.scores.ats, color: 'bg-brand-500' },
        { label: 'Formatting', value: analysis.scores.formatting, color: 'bg-accent-500' },
        { label: 'Grammar', value: analysis.scores.grammar, color: 'bg-brand-600' },
        { label: 'Keywords', value: analysis.scores.keyword, color: 'bg-accent-600' },
        { label: 'Impact', value: analysis.scores.impact, color: 'bg-success-500' },
        { label: 'Readability', value: analysis.scores.readability, color: 'bg-brand-700' },
        { label: 'Action Verbs', value: analysis.scores.actionVerb, color: 'bg-accent-700' },
      ]
    : [];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Resume Analyzer</h1>
        <p className="mt-1 text-sm text-ink-500">Upload or paste your resume to get instant ATS analysis</p>
      </div>

      {!analysis ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-300 py-12">
            <Upload className="h-12 w-12 text-ink-300" />
            <p className="mt-4 text-sm font-medium text-ink-900">Upload your resume (PDF/DOCX/TXT)</p>
            <p className="mt-1 text-xs text-ink-500">or paste text below</p>
            <label className="mt-4 cursor-pointer">
              <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileUpload} />
              <span className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
                <Upload className="h-4 w-4" />
                Choose File
              </span>
            </label>
          </div>

          <div className="mt-6">
            <Textarea
              label="Or paste your resume text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="min-h-[200px]"
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAnalyze} disabled={!text.trim() || analyzing}>
                {analyzing ? (
                  <>
                    <Zap className="h-4 w-4 animate-pulse text-brand-300" />
                    {loadingStep}
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overall score */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-6">
              <p className="text-sm font-medium text-ink-500">Overall Score</p>
              <div className="relative mt-3 grid h-32 w-32 place-items-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
                  <motion.circle
                    cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                    className={analysis.scores.overall >= 80 ? 'text-success-500' : analysis.scores.overall >= 60 ? 'text-warning-500' : 'text-error-500'}
                    initial={{ strokeDasharray: '0 277' }}
                    animate={{ strokeDasharray: `${(analysis.scores.overall / 100) * 277} 277` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-ink-900">{analysis.scores.overall}</span>
              </div>
              <Badge variant={analysis.scores.overall >= 80 ? 'success' : analysis.scores.overall >= 60 ? 'warning' : 'error'} className="mt-3">
                {analysis.scores.overall >= 80 ? 'Excellent' : analysis.scores.overall >= 60 ? 'Needs Work' : 'Poor'}
              </Badge>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-ink-900">Score Breakdown</h3>
              <div className="mt-4 space-y-3">
                {scoreData.map((s) => (
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
              </div>
            </Card>
          </div>

          {/* Feedback */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-ink-900">Recruiter Feedback</h3>
              <div className="mt-4 space-y-3">
                {analysis.feedback.map((f, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 rounded-lg p-3 ${
                      f.type === 'positive' ? 'bg-success-500/10' : f.type === 'warning' ? 'bg-warning-500/10' : 'bg-error-500/10'
                    }`}
                  >
                    {f.type === 'positive' ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" />
                    ) : f.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 shrink-0 text-warning-600" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 text-error-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink-900">{f.section}: {f.message}</p>
                      {f.suggestion && <p className="mt-0.5 text-xs text-ink-600">{f.suggestion}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              {/* Missing keywords */}
              <Card className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <Target className="h-4 w-4 text-brand-600" />
                  Missing Keywords
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.missing_keywords.length > 0 ? (
                    analysis.missing_keywords.map((kw) => (
                      <span key={kw} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-ink-500">All common keywords found!</p>
                  )}
                </div>
              </Card>

              {/* Weak bullets */}
              {analysis.weak_bullets.length > 0 && (
                <Card className="p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Zap className="h-4 w-4 text-warning-600" />
                    Weak Bullet Points
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {analysis.weak_bullets.map((b, i) => (
                      <li key={i} className="rounded-lg bg-warning-500/10 p-2.5 text-xs text-ink-700">{b}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setAnalysis(null); setText(''); }}>
              Analyze Another
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
