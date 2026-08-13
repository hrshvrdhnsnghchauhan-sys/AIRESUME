import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  DollarSign,
  Briefcase,
  Star,
  ArrowRight,
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { ResumeAnalysis, Application } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { container, fadeUp } from '@/lib/motion';

const skillGaps = [
  { skill: 'Kubernetes', demand: 92, have: false },
  { skill: 'GraphQL', demand: 78, have: false },
  { skill: 'Microservices', demand: 85, have: true },
  { skill: 'Terraform', demand: 71, have: false },
  { skill: 'Redis', demand: 65, have: true },
];

const careerRoadmap = [
  { phase: 'Current', title: 'Mid-level Engineer', status: 'active' },
  { phase: '3-6 months', title: 'Senior Engineer', status: 'upcoming' },
  { phase: '6-12 months', title: 'Tech Lead', status: 'upcoming' },
  { phase: '1-2 years', title: 'Staff Engineer', status: 'future' },
];

const salaryData = [
  { role: 'Software Engineer', min: 110, max: 165, avg: 135 },
  { role: 'Senior Engineer', min: 155, max: 230, avg: 190 },
  { role: 'Staff Engineer', min: 210, max: 320, avg: 265 },
  { role: 'Tech Lead', min: 190, max: 280, avg: 235 },
];

const achievements = [
  { title: 'First Interview', description: 'Landed your first interview', icon: Target },
  { title: 'Resume Pro', description: 'Created 5+ resume versions', icon: Award },
  { title: 'ATS Master', description: 'Achieved 90+ ATS score', icon: Star },
  { title: 'Active Tracker', description: 'Tracked 10+ applications', icon: Briefcase },
];

export default function CareerDashboard() {
  const { profile } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.user_id) return;
      try {
        const analysesQuery = query(collection(db, 'resume_analyses'), where('user_id', '==', profile.user_id));
        const applicationsQuery = query(collection(db, 'applications'), where('user_id', '==', profile.user_id));

        const [aRes, appRes] = await Promise.all([
          getDocs(analysesQuery),
          getDocs(applicationsQuery),
        ]);
        
        const analysesData = aRes.docs.map(d => ({ id: d.id, ...d.data() } as ResumeAnalysis));
        const appsData = appRes.docs.map(d => ({ id: d.id, ...d.data() } as Application));
        analysesData.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
        appsData.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));

        setAnalyses(analysesData);
        setApplications(appsData);
      } catch (error) {
        console.error('Error fetching career data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

  const scoreHistory = analyses
    .filter((a) => a.scores)
    .map((a) => ({ date: a.created_at, score: a.scores.overall }))
    .slice(-10);

  const avgScore = scoreHistory.length > 0
    ? Math.round(scoreHistory.reduce((a, s) => a + s.score, 0) / scoreHistory.length)
    : null;

  const interviewRate = applications.length > 0
    ? Math.round((applications.filter((a) => ['interview', 'offer', 'accepted'].includes(a.status)).length / applications.length) * 100)
    : 0;

  const offerCount = applications.filter((a) => ['offer', 'accepted'].includes(a.status)).length;

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Career Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">Your career growth, analytics, and roadmap</p>
      </div>

      {/* Top metrics */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Avg Resume Score</span>
              <Target className="h-4 w-4 text-brand-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink-900">{avgScore ?? '—'}</p>
            {scoreHistory.length > 1 && (
              <p className="mt-1 flex items-center gap-1 text-xs text-success-600">
                <TrendingUp className="h-3 w-3" />
                {scoreHistory[scoreHistory.length - 1].score - scoreHistory[0].score > 0 ? '+' : ''}
                {scoreHistory[scoreHistory.length - 1].score - scoreHistory[0].score} pts
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Applications</span>
              <Briefcase className="h-4 w-4 text-accent-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink-900">{applications.length}</p>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Interview Rate</span>
              <TrendingUp className="h-4 w-4 text-brand-700" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink-900">{interviewRate}%</p>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Offers</span>
              <Award className="h-4 w-4 text-success-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink-900">{offerCount}</p>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Score history chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-ink-900">Resume Score History</h3>
          <p className="mt-1 text-xs text-ink-500">Track your improvement over time</p>
          {loading ? (
            <div className="mt-4 h-40 animate-pulse rounded-lg bg-ink-100" />
          ) : scoreHistory.length > 0 ? (
            <div className="mt-4">
              <div className="flex h-40 items-end gap-2">
                {scoreHistory.map((point, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${point.score}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400"
                      style={{ minHeight: '4px' }}
                    />
                    <span className="text-[10px] text-ink-400">{point.score}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 flex h-40 items-center justify-center text-sm text-ink-400">
              No analysis history yet
            </div>
          )}
        </Card>

        {/* Career roadmap */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-ink-900">Career Roadmap</h3>
          <p className="mt-1 text-xs text-ink-500">Your projected career path</p>
          <div className="mt-4 space-y-3">
            {careerRoadmap.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex flex-col items-center ${i < careerRoadmap.length - 1 ? 'flex-1' : ''}`}>
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full ${
                      step.status === 'active'
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : step.status === 'upcoming'
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-ink-100 text-ink-400'
                    }`}
                  >
                    {step.status === 'active' ? (
                      <Star className="h-5 w-5 fill-white" />
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </div>
                  {i < careerRoadmap.length - 1 && <div className="mt-1 h-8 w-0.5 bg-ink-200" />}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-xs font-medium text-ink-500">{step.phase}</p>
                  <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                  {step.status === 'active' && <Badge variant="brand" className="mt-1">Current</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill gap analysis */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <BookOpen className="h-4 w-4 text-brand-600" />
            Skill Gap Analysis
          </h3>
          <p className="mt-1 text-xs text-ink-500">High-demand skills to learn</p>
          <div className="mt-4 space-y-3">
            {skillGaps.map((skill) => (
              <div key={skill.skill}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink-700">
                    {skill.skill}
                    {skill.have && <Badge variant="success" className="text-[10px]">Have</Badge>}
                  </span>
                  <span className="text-xs text-ink-500">{skill.demand}% demand</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.demand}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${skill.have ? 'bg-success-500' : 'bg-warning-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Salary insights */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <DollarSign className="h-4 w-4 text-success-600" />
            Salary Insights
          </h3>
          <p className="mt-1 text-xs text-ink-500">Average salary ranges (USD, thousands)</p>
          <div className="mt-4 space-y-3">
            {salaryData.map((s) => (
              <div key={s.role}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-700">{s.role}</span>
                  <span className="text-xs text-ink-500">${s.min}K - ${s.max}K</span>
                </div>
                <div className="relative h-6 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.max / 320) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="absolute h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                  />
                  <div
                    className="absolute h-full w-1 bg-ink-900"
                    style={{ left: `${(s.avg / 320) * 100}%` }}
                    title={`Avg: $${s.avg}K`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="mt-6 p-6">
        <h3 className="text-sm font-semibold text-ink-900">Achievements</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="flex flex-col items-center rounded-xl border border-ink-200 bg-ink-50/50 p-4 text-center"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md">
                <a.icon className="h-5 w-5 text-white" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink-900">{a.title}</p>
              <p className="mt-1 text-xs text-ink-500">{a.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
