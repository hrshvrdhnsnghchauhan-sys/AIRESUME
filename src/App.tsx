import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const DashboardLayout = lazy(() => import('@/components/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'));
const ResumeList = lazy(() => import('@/pages/dashboard/ResumeList'));
const ResumeBuilder = lazy(() => import('@/pages/dashboard/ResumeBuilder'));
const ResumeAnalyzer = lazy(() => import('@/pages/dashboard/ResumeAnalyzer'));
const ATSSimulator = lazy(() => import('@/pages/dashboard/ATSSimulator'));
const JobMatch = lazy(() => import('@/pages/dashboard/JobMatch'));
const AICopilot = lazy(() => import('@/pages/dashboard/AICopilot'));
const CoverLetter = lazy(() => import('@/pages/dashboard/CoverLetter'));
const LinkedInOptimizer = lazy(() => import('@/pages/dashboard/LinkedInOptimizer'));
const InterviewCoach = lazy(() => import('@/pages/dashboard/InterviewCoach'));
const ApplicationTracker = lazy(() => import('@/pages/dashboard/ApplicationTracker'));
const CareerDashboard = lazy(() => import('@/pages/dashboard/CareerDashboard'));
const Settings = lazy(() => import('@/pages/dashboard/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function PageLoader() {
  return (
    <div className="grid h-full min-h-[400px] place-items-center bg-ink-50">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="resumes" element={<ResumeList />} />
                  <Route path="resumes/:id" element={<ResumeBuilder />} />
                  <Route path="analyzer" element={<ResumeAnalyzer />} />
                  <Route path="ats" element={<ATSSimulator />} />
                  <Route path="job-match" element={<JobMatch />} />
                  <Route path="copilot" element={<AICopilot />} />
                  <Route path="cover-letter" element={<CoverLetter />} />
                  <Route path="linkedin" element={<LinkedInOptimizer />} />
                  <Route path="interview" element={<InterviewCoach />} />
                  <Route path="applications" element={<ApplicationTracker />} />
                  <Route path="career" element={<CareerDashboard />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
