/*
# VanitraAI Resume — Core Schema

## Overview
Creates the complete database schema for the VanitraAI Resume SaaS platform.
This is a multi-user application with Supabase Auth (email/password + Google OAuth).

## New Tables
1. `profiles` — user profile data (name, avatar, headline, phone, location, website, linkedin, summary)
2. `resumes` — resume documents with structured JSON content and metadata
3. `resume_analyses` — AI analysis results (ATS, formatting, grammar, keyword, impact scores)
4. `job_matches` — job description match results with match %, missing keywords, gaps
5. `applications` — job application tracker (wishlist, applied, interview, rejected, offer, accepted)
6. `ai_chats` — AI copilot conversation history
7. `notifications` — user notifications

## Security
- RLS enabled on all tables
- All tables are owner-scoped (user_id = auth.uid())
- Only authenticated users can access their own data
- user_id columns default to auth.uid() so inserts work without explicit owner
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  headline text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  website text DEFAULT '',
  linkedin text DEFAULT '',
  summary text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RESUMES
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Resume',
  template text NOT NULL DEFAULT 'modern',
  theme jsonb NOT NULL DEFAULT '{"primaryColor":"#2553eb","fontFamily":"Inter","fontSize":"medium"}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_resumes" ON resumes;
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_resumes" ON resumes;
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_resumes" ON resumes;
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_resumes" ON resumes;
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RESUME ANALYSES
CREATE TABLE IF NOT EXISTS resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  raw_text text DEFAULT '',
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  feedback jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords text[] DEFAULT '{}',
  missing_sections text[] DEFAULT '{}',
  weak_bullets text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_analyses" ON resume_analyses;
CREATE POLICY "select_own_analyses" ON resume_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_analyses" ON resume_analyses;
CREATE POLICY "insert_own_analyses" ON resume_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_analyses" ON resume_analyses;
CREATE POLICY "update_own_analyses" ON resume_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_analyses" ON resume_analyses;
CREATE POLICY "delete_own_analyses" ON resume_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- JOB MATCHES
CREATE TABLE IF NOT EXISTS job_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  job_description text NOT NULL DEFAULT '',
  company text DEFAULT '',
  role text DEFAULT '',
  overall_match integer NOT NULL DEFAULT 0,
  missing_keywords text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  gaps text[] DEFAULT '{}',
  interview_chance integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_job_matches" ON job_matches;
CREATE POLICY "select_own_job_matches" ON job_matches FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_job_matches" ON job_matches;
CREATE POLICY "insert_own_job_matches" ON job_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_job_matches" ON job_matches;
CREATE POLICY "update_own_job_matches" ON job_matches FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_job_matches" ON job_matches;
CREATE POLICY "delete_own_job_matches" ON job_matches FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'wishlist' CHECK (status IN ('wishlist','applied','interview','rejected','offer','accepted')),
  job_url text DEFAULT '',
  salary text DEFAULT '',
  location text DEFAULT '',
  notes text DEFAULT '',
  applied_date date,
  interview_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_applications" ON applications;
CREATE POLICY "select_own_applications" ON applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_applications" ON applications;
CREATE POLICY "update_own_applications" ON applications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications" ON applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- AI CHATS
CREATE TABLE IF NOT EXISTS ai_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Chat',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_ai_chats" ON ai_chats;
CREATE POLICY "select_own_ai_chats" ON ai_chats FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_ai_chats" ON ai_chats;
CREATE POLICY "insert_own_ai_chats" ON ai_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_ai_chats" ON ai_chats;
CREATE POLICY "update_own_ai_chats" ON ai_chats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_ai_chats" ON ai_chats;
CREATE POLICY "delete_own_ai_chats" ON ai_chats FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  body text DEFAULT '',
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
