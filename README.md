# AIRESUME

A modern, AI-powered resume builder and career assistant platform helping you analyze, optimize, and land your dream job.

![Screenshot](https://bolt.new/static/og_default.png)

## Features

- **Resume Builder** - Create professional resumes with ease
- **Resume Analyzer** - Get AI-powered feedback on your resume
- **ATS Simulator** - Test how well your resume performs with Applicant Tracking Systems
- **Job Match** - Find the best matching jobs for your profile
- **AI Copilot** - Get personalized career guidance and assistance
- **Cover Letter Generator** - Generate personalized cover letters
- **LinkedIn Optimizer** - Improve your LinkedIn profile
- **Interview Coach** - Practice and prepare for interviews
- **Application Tracker** - Track your job applications
- **Career Dashboard** - Overview of your career progress

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe code
- **Vite** - Fast development server and build
- **TanStack Query** - Data fetching and state management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Firebase** - Authentication and backend services
- **Supabase** - Database and additional backend services

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` to view the application.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Pages

| Page | Path |
|------|------|
| Landing Page | `/` |
| Login | `/login` |
| Signup | `/signup` |
| Forgot Password | `/forgot-password` |
| Dashboard | `/app` |
| Resumes | `/app/resumes` |
| Resume Builder | `/app/resumes/:id` |
| Resume Analyzer | `/app/analyzer` |
| ATS Simulator | `/app/ats` |
| Job Match | `/app/job-match` |
| AI Copilot | `/app/copilot` |
| Cover Letter | `/app/cover-letter` |
| LinkedIn Optimizer | `/app/linkedin` |
| Interview Coach | `/app/interview` |
| Application Tracker | `/app/applications` |
| Career Dashboard | `/app/career` |
| Settings | `/app/settings` |

## Authentication

This application supports authentication via email/password and social providers. Protected routes require the user to be logged in.

## Learn More

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)