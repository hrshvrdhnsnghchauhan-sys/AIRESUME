import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  Lightbulb,
  Globe,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type Question = {
  id: string;
  category: string;
  question: string;
  starGuide: { situation: string; task: string; action: string; result: string };
  modelAnswer: string;
};

const questionBank: Omit<Question, 'id'>[] = [
  {
    category: 'Behavioral',
    question: 'Tell me about a time you faced a significant challenge at work.',
    starGuide: {
      situation: 'Describe the specific challenge and context',
      task: 'Explain your responsibility in addressing it',
      action: 'Detail the steps you took to solve it',
      result: 'Share the positive outcome and what you learned',
    },
    modelAnswer: 'At my previous company, we faced a critical performance issue causing 30% of users to experience timeouts. As the lead engineer, I was responsible for diagnosing and fixing the issue within 48 hours. I conducted a systematic analysis, identified a database query bottleneck, and implemented a caching layer that reduced response times by 60%. The fix was deployed in under 24 hours, and we retained all affected users.',
  },
  {
    category: 'Technical',
    question: 'Walk me through how you would design a URL shortening service.',
    starGuide: {
      situation: 'Understand the scale and requirements',
      task: 'Design the architecture and components',
      action: 'Explain your technical decisions',
      result: 'Address scalability and trade-offs',
    },
    modelAnswer: 'I would start by clarifying requirements: expected traffic, URL lifetime, and analytics needs. For the architecture, I would use a REST API with a unique ID generator (base62 encoding), a database like PostgreSQL for persistence with Redis for caching hot URLs, and a CDN for redirect performance. For scalability, I would shard the database by URL hash and use read replicas.',
  },
  {
    category: 'Leadership',
    question: 'Describe a situation where you had to influence a team without authority.',
    starGuide: {
      situation: 'Set up the context and stakeholders',
      task: 'Explain what you needed to achieve',
      action: 'Describe how you built consensus',
      result: 'Share the outcome and team impact',
    },
    modelAnswer: 'When our team needed to adopt a new testing framework, there was resistance from senior engineers. I organized a demo showing the time savings, created documentation, and offered to pair-program with anyone who wanted help. Within a month, the entire team had adopted the framework, and our test coverage increased by 40%.',
  },
  {
    category: 'Problem Solving',
    question: 'Tell me about a time you made a mistake at work. How did you handle it?',
    starGuide: {
      situation: 'Own the mistake honestly',
      task: 'Explain the impact and your responsibility',
      action: 'Describe how you fixed it and prevented recurrence',
      result: 'Share the lesson learned',
    },
    modelAnswer: 'I once deployed a change that caused a brief outage for 5% of users. I immediately rolled back the deployment, notified stakeholders, and investigated the root cause. I then implemented additional automated tests to catch similar issues and shared a postmortem with the team to prevent future occurrences.',
  },
  {
    category: 'Behavioral',
    question: 'Why do you want to work at this company?',
    starGuide: {
      situation: 'Research the company mission and values',
      task: 'Connect your goals to the company',
      action: 'Be specific about what excites you',
      result: 'Show genuine enthusiasm',
    },
    modelAnswer: 'I have been following your company\'s work in AI-driven career tools, and I am inspired by how you are democratizing access to career opportunities. My background in building user-centric products aligns perfectly with your mission, and I am excited about the opportunity to contribute to products that help millions of job seekers.',
  },
];

import { evaluateInterviewAnswer } from '@/lib/gemini';

type Feedback = {
  strengths: string[];
  improvements: string[];
  score: number;
};

export default function InterviewCoach() {
  const [role, setRole] = useState('');
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showModel, setShowModel] = useState(false);

  const questions = questionBank.map((q, i) => ({ ...q, id: `q${i}` }));
  const current = questions[currentIdx];

  const handleStart = () => {
    setStarted(true);
    setCurrentIdx(0);
    setAnswers({});
    setFeedback(null);
  };

  const handleSubmit = async () => {
    const answer = answers[current.id] || '';
    if (!answer.trim()) return;
    try {
      const fb = await evaluateInterviewAnswer(current.question, answer, current.category);
      setFeedback(fb);
    } catch (err: any) {
      alert(err.message || 'Failed to evaluate answer');
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setShowGuide(false);
    setShowModel(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStarted(false);
    }
  };

  const handlePrev = () => {
    setFeedback(null);
    setShowGuide(false);
    setShowModel(false);
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  if (!started) {
    return (
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Interview Coach</h1>
          <p className="mt-1 text-sm text-ink-500">Practice with AI-generated questions and get instant feedback</p>
        </div>

        <Card className="mx-auto max-w-2xl p-8">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-ink-900">Ready to practice?</h2>
            <p className="mt-2 max-w-md text-sm text-ink-500">
              You'll get {questions.length} interview questions across behavioral, technical, and leadership categories.
              Answer each one and receive AI-powered feedback using the STAR method.
            </p>

            <div className="mt-6 w-full max-w-sm">
              <Input
                label="Target Role (optional)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <Button className="mt-6" size="lg" onClick={handleStart}>
              <Sparkles className="h-4 w-4" />
              Start Mock Interview
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {['Behavioral', 'Technical', 'Leadership'].map((cat) => (
              <div key={cat} className="rounded-xl border border-ink-200 bg-ink-50 p-4 text-center">
                <p className="text-sm font-semibold text-ink-900">{cat}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {questions.filter((q) => q.category === cat).length} questions
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Mock Interview</h1>
          <p className="mt-1 text-sm text-ink-500">
            Question {currentIdx + 1} of {questions.length}
            {role && ` · ${role}`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setStarted(false)}>
          <RotateCcw className="h-4 w-4" />
          Exit
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <motion.div
          className="h-full rounded-full bg-brand-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Question */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50">
              <MessageSquare className="h-5 w-5 text-brand-600" />
            </span>
            <div className="flex-1">
              <Badge variant="brand" className="mb-2">{current.category}</Badge>
              <h2 className="text-lg font-semibold text-ink-900">{current.question}</h2>
            </div>
          </div>
        </Card>

        {/* Answer area */}
        <Card className="p-6">
          <Textarea
            label="Your Answer"
            value={answers[current.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
            placeholder="Type your answer here. Use the STAR method: Situation, Task, Action, Result..."
            className="min-h-[160px]"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)}>
              <Star className="h-4 w-4" />
              STAR Guide
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowModel(!showModel)}>
              <Lightbulb className="h-4 w-4" />
              Model Answer
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!(answers[current.id] || '').trim()}>
              <Sparkles className="h-4 w-4" />
              Get Feedback
            </Button>
          </div>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-xl bg-ink-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-ink-900">STAR Method Guide</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(current.starGuide).map(([key, val]) => (
                      <div key={key} className="rounded-lg bg-surface p-3">
                        <p className="text-xs font-bold uppercase text-brand-600">{key}</p>
                        <p className="mt-1 text-sm text-ink-700">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {showModel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-xl bg-brand-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-ink-900">Model Answer</p>
                  <p className="text-sm leading-relaxed text-ink-700">{current.modelAnswer}</p>
                </div>
              </motion.div>
            )}

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="flex items-center gap-4 rounded-xl border border-ink-200 p-4">
                  <div className="relative grid h-16 w-16 place-items-center">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                        className={feedback.score >= 80 ? 'text-success-500' : feedback.score >= 60 ? 'text-warning-500' : 'text-error-500'}
                        initial={{ strokeDasharray: '0 264' }}
                        animate={{ strokeDasharray: `${(feedback.score / 100) * 264} 264` }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <span className="absolute text-lg font-bold text-ink-900">{feedback.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">Answer Score</p>
                    <p className="text-xs text-ink-500">
                      {feedback.score >= 80 ? 'Excellent answer!' : feedback.score >= 60 ? 'Good — some room for improvement' : 'Needs work — see suggestions below'}
                    </p>
                  </div>
                </div>

                {feedback.strengths.length > 0 && (
                  <div className="rounded-xl bg-success-500/10 p-4">
                    <p className="mb-2 text-sm font-semibold text-success-600">Strengths</p>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-600" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.improvements.length > 0 && (
                  <div className="rounded-xl bg-warning-500/10 p-4">
                    <p className="mb-2 text-sm font-semibold text-warning-600">Areas to Improve</p>
                    <ul className="space-y-1.5">
                      {feedback.improvements.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                          <span className="mt-0.5 text-warning-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button size="sm" onClick={handleNext}>
              {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
