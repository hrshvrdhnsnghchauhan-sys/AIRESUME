export type ResumeContent = {
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillGroup[];
  projects?: ProjectItem[];
  certifications?: CertItem[];
  languages?: { name: string; level: string }[];
  awards?: { title: string; issuer: string; date: string }[];
  customSections?: { title: string; items: string[] }[];
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type SkillGroup = {
  id: string;
  category: string;
  skills: string[];
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  tech: string[];
  bullets: string[];
};

export type CertItem = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export type ResumeTheme = {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'wide';
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  template: string;
  theme: ResumeTheme;
  content: ResumeContent;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'interview'
  | 'rejected'
  | 'offer'
  | 'accepted';

export type Application = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  job_url: string;
  salary: string;
  location: string;
  notes: string;
  applied_date: string | null;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ResumeAnalysis = {
  id: string;
  user_id: string;
  resume_id: string | null;
  raw_text: string;
  scores: AnalysisScores;
  feedback: FeedbackItem[];
  missing_keywords: string[];
  missing_sections: string[];
  weak_bullets: string[];
  created_at: string;
};

export type AnalysisScores = {
  ats: number;
  formatting: number;
  grammar: number;
  keyword: number;
  impact: number;
  readability: number;
  actionVerb: number;
  overall: number;
};

export type FeedbackItem = {
  type: 'positive' | 'warning' | 'critical';
  section: string;
  message: string;
  suggestion?: string;
};

export type JobMatch = {
  id: string;
  user_id: string;
  resume_id: string | null;
  job_description: string;
  company: string;
  role: string;
  overall_match: number;
  missing_keywords: string[];
  missing_skills: string[];
  gaps: string[];
  interview_chance: number;
  created_at: string;
};

export type AIChat = {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  headline: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  id: string;
  email: string;
};
