import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Resume, Application, ResumeAnalysis } from '@/types';

export function useDashboardData() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      try {
        const qResumes = query(collection(db, 'resumes'), where('user_id', '==', user.uid));
        const qApps = query(collection(db, 'applications'), where('user_id', '==', user.uid));
        const qAnalyses = query(collection(db, 'resume_analyses'), where('user_id', '==', user.uid));

        const [resumesRes, appsRes, analysesRes] = await Promise.all([
          getDocs(qResumes),
          getDocs(qApps),
          getDocs(qAnalyses),
        ]);

        const resumesData = resumesRes.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume));
        const appsData = appsRes.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        const analysesData = analysesRes.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResumeAnalysis));

        // Sort client-side (avoids requiring composite indexes in Firestore)
        resumesData.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
        appsData.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
        analysesData.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

        setResumes(resumesData);
        setApplications(appsData);
        setAnalyses(analysesData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const stats = {
    totalResumes: resumes.length,
    totalApplications: applications.length,
    interviews: applications.filter((a) => a.status === 'interview' || a.status === 'offer' || a.status === 'accepted').length,
    offers: applications.filter((a) => a.status === 'offer' || a.status === 'accepted').length,
    interviewRate:
      applications.length > 0
        ? Math.round(
            (applications.filter((a) => ['interview', 'offer', 'accepted'].includes(a.status)).length /
              applications.length) *
              100,
          )
        : 0,
    latestAtsScore:
      analyses.length > 0 && analyses[0].scores ? analyses[0].scores.ats : null,
    appliedCount: applications.filter((a) => a.status === 'applied').length,
    wishlistCount: applications.filter((a) => a.status === 'wishlist').length,
  };

  return { resumes, applications, analyses, stats, loading, setResumes, setApplications };
}
