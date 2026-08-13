import { GoogleGenerativeAI } from '@google/generative-ai';

function getAIModel(isJson = false) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || !apiKey.startsWith('AIza')) {
    throw new Error('Please configure a valid VITE_GEMINI_API_KEY in your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: isJson ? { responseMimeType: 'application/json' } : {},
  });
}

function hasValidApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return !!apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.startsWith('AIza');
}

// Parse model output robustly — Gemini sometimes wraps JSON in markdown fences
function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*$/g, '')
      .trim();
    // Find the first { ... } block if there's stray prose around it
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* LOCAL FALLBACK ENGINES                                              */
/* These guarantee every feature produces a result even without a      */
/* valid API key — perfect for live demos and hackathons.              */
/* ------------------------------------------------------------------ */

function fallbackCoverLetter(data: any): string {
  const name = data.name || 'Candidate';
  const role = data.role || 'the role';
  const company = data.company || 'your company';
  const experience = data.experience || 'several years of hands-on experience';
  const skills = data.skills || 'a strong blend of technical and soft skills';
  const achievements = data.achievements || '';
  const tone = data.tone || 'professional';

  const opener =
    tone === 'startup'
      ? 'I am genuinely excited about the opportunity to bring my energy and expertise to'
      : tone === 'corporate'
        ? 'I am writing to express my strong interest in the role of'
        : 'I am writing to express my interest in the position of';

  return `${name}
${opener} ${role} at ${company}.

With ${experience}, I have developed ${skills} that I believe align closely with what your team is looking for.
${achievements ? `Notably, ${achievements}. ` : ''}I am passionate about delivering measurable results and collaborating with teams that value impact and growth.

I would welcome the chance to discuss how my background and enthusiasm can contribute to ${company}'s continued success. Thank you for your time and consideration.

Best regards,
${name}`;
}

function fallbackATSSimulation(resumeText: string, jobDescription: string): {
  passRate: number;
  parsedSections: { experience: boolean; education: boolean; skills: boolean; contact: boolean };
  rejectionReasons: string[];
} {
  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jobDescription.toLowerCase();

  const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasExperience = /experience|work|employment/i.test(resumeText);
  const hasEducation = /education|degree|university|bachelor|master/i.test(resumeText);
  const hasSkills = /skills|technologies|tools/i.test(resumeText);

  const jdWords = lowerJd
    .replace(/[^a-z0-9+#.\- ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const stopWords = new Set(['the', 'and', 'for', 'you', 'will', 'with', 'that', 'this', 'have', 'from', 'your', 'are', 'our', 'team', 'role', 'job', 'work', 'must', 'can', 'who', 'what', 'all', 'one', 'may', 'not', 'but', 'its', 'has', 'had', 'was', 'were', 'been', 'being', 'per', 'etc', 'able', 'also', 'into', 'than', 'then', 'they', 'them', 'their', 'there', 'these', 'those', 'about', 'across', 'after', 'again', 'against', 'before', 'between', 'both', 'each', 'other', 'some', 'such', 'through', 'under', 'while', 'during', 'using', 'well', 'like', 'make', 'made', 'use', 'used', 'new', 'good', 'great', 'best', 'more', 'most', 'over', 'only', 'any', 'many', 'much', 'very', 'just', 'because', 'should', 'could', 'would', 'where', 'when', 'which', 'why', 'how', 'out', 'own', 'same', 'so', 'too', 'up', 'down', 'off', 'on', 'at', 'by', 'in', 'to', 'of', 'or', 'as', 'is', 'it', 'be', 'do', 'if', 'no', 'we', 'he', 'she', 'it', 'an', 'am', 'i', 'e', 's']);
  const jdKeywords = Array.from(new Set(jdWords.filter((w) => !stopWords.has(w))));

  const found = jdKeywords.filter((kw) => lowerResume.includes(kw));
  const missing = jdKeywords.filter((kw) => !lowerResume.includes(kw));

  const sectionScore = [hasEmail, hasPhone, hasExperience, hasEducation, hasSkills].filter(Boolean).length * 12;
  const keywordScore = jdKeywords.length > 0 ? Math.round((found.length / jdKeywords.length) * 45) : 30;

  let passRate = Math.min(95, Math.max(15, sectionScore + keywordScore));
  if (hasEmail && hasPhone) passRate += 5;

  const rejectionReasons: string[] = [];
  if (!hasEmail) rejectionReasons.push('No email address detected — ATS cannot contact you');
  if (!hasPhone) rejectionReasons.push('No phone number detected — incomplete contact block');
  if (!hasExperience) rejectionReasons.push('Missing "Experience" section header — ATS may not parse work history');
  if (!hasEducation) rejectionReasons.push('Missing "Education" section — many ATS filters require it');
  if (!hasSkills) rejectionReasons.push('Missing "Skills" section — keyword matching will fail');
  if (missing.length > 0) rejectionReasons.push(`Missing key skills from the job description: ${missing.slice(0, 5).join(', ')}`);
  if (passRate < 50) rejectionReasons.push('Low overall keyword match with the job description');

  return {
    passRate,
    parsedSections: { experience: hasExperience, education: hasEducation, skills: hasSkills, contact: hasEmail && hasPhone },
    rejectionReasons,
  };
}

function fallbackJobMatch(resumeText: string, company: string, role: string, jobDescription: string): {
  matchScore: number;
  interviewChance: string;
  gaps: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
} {
  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jobDescription.toLowerCase();

  const jdWords = lowerJd
    .replace(/[^a-z0-9+#.\- ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const stopWords = new Set(['the', 'and', 'for', 'you', 'will', 'with', 'that', 'this', 'have', 'from', 'your', 'are', 'our', 'team', 'role', 'job', 'work', 'must', 'can', 'who', 'what', 'all', 'one', 'may', 'not', 'but', 'its', 'has', 'had', 'was', 'were', 'been', 'being', 'per', 'etc', 'able', 'also', 'into', 'than', 'then', 'they', 'them', 'their', 'there', 'these', 'those', 'about', 'across', 'after', 'again', 'against', 'before', 'between', 'both', 'each', 'other', 'some', 'such', 'through', 'under', 'while', 'during', 'using', 'well', 'like', 'make', 'made', 'use', 'used', 'new', 'good', 'great', 'best', 'more', 'most', 'over', 'only', 'any', 'many', 'much', 'very', 'just', 'because', 'should', 'could', 'would', 'where', 'when', 'which', 'why', 'how', 'out', 'own', 'same', 'so', 'too', 'up', 'down', 'off', 'on', 'at', 'by', 'in', 'to', 'of', 'or', 'as', 'is', 'it', 'be', 'do', 'if', 'no', 'we', 'he', 'she', 'it', 'an', 'am', 'i', 'e', 's']);
  const jdKeywords = Array.from(new Set(jdWords.filter((w) => !stopWords.has(w))));

  const found = jdKeywords.filter((kw) => lowerResume.includes(kw));
  const missing = jdKeywords.filter((kw) => !lowerResume.includes(kw));

  const matchScore = jdKeywords.length > 0 ? Math.min(95, Math.round((found.length / jdKeywords.length) * 100)) : 50;
  const interviewChance = matchScore >= 75 ? 'High' : matchScore >= 50 ? 'Medium' : 'Low';

  const gaps: string[] = [];
  if (matchScore < 70) gaps.push(`Resume covers only ${found.length} of ${jdKeywords.length} key terms from the job description`);
  if (missing.length > 0) gaps.push(`Add these missing keywords to improve the match: ${missing.slice(0, 4).join(', ')}`);
  if (!/experience|work|employment/i.test(resumeText)) gaps.push('No work experience section found — recruiters expect it for this role');
  gaps.push('Quantify achievements (numbers, % improvements) to strengthen the match');

  return { matchScore, interviewChance, gaps, keywordsFound: found.slice(0, 12), keywordsMissing: missing.slice(0, 12) };
}

function fallbackLinkedInOptimization(headline: string, about: string, skills: string, experience: string): {
  headlineSuggestions: string[];
  aboutSuggestion: string;
  suggestedKeywords: string[];
  scoreBreakdown: { section: string; score: number; suggestion: string }[];
} {
  const skillList = skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const headlineScore = headline.trim().length >= 30 ? 82 : headline.trim().length >= 15 ? 65 : 40;
  const aboutScore = about.trim().length >= 300 ? 85 : about.trim().length >= 100 ? 68 : 45;
  const skillsScore = skillList.length >= 5 ? 80 : skillList.length >= 3 ? 62 : 40;
  const expScore = experience.trim().length >= 150 ? 84 : experience.trim().length >= 50 ? 66 : 45;

  const headlineBase = headline.trim() || 'Professional with a track record of delivering results';
  const headlineWords = headlineBase.split(' ').slice(0, 6).join(' ');

  const headlineSuggestions = [
    `${headlineWords} | Helping teams ship impactful products`,
    headline.trim() ? `${headlineBase} | Driving measurable business outcomes` : 'Results-driven professional | Open to new opportunities',
    `${headlineWords} | 5+ years of hands-on experience`,
  ].filter((h, i, arr) => arr.indexOf(h) === i);

  const aboutSuggestion = `${about.trim() ? about.trim() + ' ' : ''}I am a dedicated professional focused on delivering real impact. Over my career, I have developed strong expertise in ${
    skillList.slice(0, 4).join(', ') || 'my field'
  }, consistently exceeding goals and collaborating effectively with cross-functional teams. I thrive on solving challenging problems and am always looking to grow and contribute meaningfully.`;

  const suggestedKeywords = [...new Set([
    'Leadership', 'Problem Solving', 'Cross-functional Collaboration',
    ...skillList.slice(0, 3),
    'Agile', 'Stakeholder Management',
  ])].slice(0, 8);

  const scoreBreakdown = [
    { section: 'Headline', score: headlineScore, suggestion: headlineScore < 80 ? 'Make your headline keyword-rich and outcome-focused (30+ characters).' : 'Great headline — clear and professional.' },
    { section: 'About', score: aboutScore, suggestion: aboutScore < 80 ? 'Expand your About to 3-4 sentences with achievements and keywords.' : 'Strong About section.' },
    { section: 'Skills', score: skillsScore, suggestion: skillsScore < 80 ? 'List at least 5 relevant skills — recruiters search by them.' : 'Good skill coverage.' },
    { section: 'Experience', score: expScore, suggestion: expScore < 80 ? 'Add quantified achievements (metrics, % growth) to your experience.' : 'Solid experience summary.' },
  ];

  return { headlineSuggestions, aboutSuggestion, suggestedKeywords, scoreBreakdown };
}

function fallbackInterviewEvaluation(question: string, answer: string, category: string): {
  strengths: string[];
  improvements: string[];
  score: number;
} {
  const lower = answer.toLowerCase();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= 60) strengths.push('Good answer length — enough detail to evaluate');
  else improvements.push('Expand your answer — aim for 3-5 sentences with concrete detail');

  if (/\d+%|\$\d+|\d+x|\d+ (users|people|clients|team|revenue|sales|customers)/.test(answer)) {
    strengths.push('Uses quantified results, which makes your impact measurable');
  } else {
    improvements.push('Add numbers to quantify your impact (e.g. "increased sales by 20%")');
  }

  const starParts = { S: /situation|context|challenge|problem|faced/i, T: /task|responsib|needed to|had to/i, A: /action|did|implemented|built|created|led|developed/i, R: /result|outcome|learned|improved|increased/i };
  const starUsed = Object.values(starParts).filter((re) => re.test(lower)).length;

  if (starUsed >= 3) strengths.push('Follows the STAR structure well (Situation, Task, Action, Result)');
  else improvements.push(`Use the STAR method — your answer covers ${starUsed} of 4 parts (Situation, Task, Action, Result)`);

  if (/i (learned|realized|understood|grew)/.test(lower)) strengths.push('Shows self-awareness and reflection');
  else improvements.push('End with a reflection on what you learned from the experience');

  const score = Math.min(92, Math.max(35, wordCount >= 60 ? 70 : 50) + starUsed * 6 + (/\d+%/.test(answer) ? 8 : 0) - (wordCount < 40 ? 15 : 0));

  return { strengths, improvements, score };
}

/* ------------------------------------------------------------------ */
/* PUBLIC API — tries Gemini first, falls back to local engine         */
/* ------------------------------------------------------------------ */

// 1. Cover Letter
export async function generateAICoverLetter(data: any): Promise<string> {
  if (!hasValidApiKey()) return fallbackCoverLetter(data);
  try {
    const model = getAIModel(false);
    const prompt = `You are an expert career coach and executive resume writer. Write a compelling, highly professional cover letter for the following details. Do NOT use placeholder text like [Company] if data is provided. Make it impactful and focus on results.
Name: ${data.name}
Role: ${data.role}
Company: ${data.company}
Experience: ${data.experience}
Skills: ${data.skills}
Achievements: ${data.achievements}
Tone: ${data.tone || 'professional'}

Only return the cover letter text, ready to be copied. Ensure proper formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text && text.trim() ? text : fallbackCoverLetter(data);
  } catch (error) {
    console.warn('Gemini cover letter failed, using fallback:', error);
    return fallbackCoverLetter(data);
  }
}

// 2. ATS Simulator
export async function simulateATS(resumeText: string, jobDescription: string): Promise<{
  passRate: number;
  parsedSections: { experience: boolean; education: boolean; skills: boolean; contact: boolean };
  rejectionReasons: string[];
}> {
  if (!hasValidApiKey()) return fallbackATSSimulation(resumeText, jobDescription);
  try {
    const model = getAIModel(true);
    const prompt = `You are a strict Applicant Tracking System (ATS) bot. Analyze the provided resume against the job description.
Return a JSON object with this exact structure:
{
  "passRate": <number 0-100 based on keyword match, formatting, and relevance>,
  "parsedSections": { "experience": boolean, "education": boolean, "skills": boolean, "contact": boolean },
  "rejectionReasons": [<array of strings explaining why it might be rejected, e.g. "Missing React keyword", "Formatting too complex">]
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text(), null as any);
    if (parsed && typeof parsed.passRate === 'number') return parsed;
    return fallbackATSSimulation(resumeText, jobDescription);
  } catch (error) {
    console.warn('Gemini ATS simulation failed, using fallback:', error);
    return fallbackATSSimulation(resumeText, jobDescription);
  }
}

// 3. Job Match
export async function analyzeJobMatch(resumeText: string, company: string, role: string, jobDescription: string): Promise<{
  matchScore: number;
  interviewChance: string;
  gaps: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
}> {
  if (!hasValidApiKey()) return fallbackJobMatch(resumeText, company, role, jobDescription);
  try {
    const model = getAIModel(true);
    const prompt = `You are an expert recruiter evaluating a candidate for a role.
Analyze the candidate's resume against the role and job description.
Return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "interviewChance": <string, e.g. "High", "Medium", "Low">,
  "gaps": [<array of strings explaining the biggest skill or experience gaps>],
  "keywordsFound": [<array of keywords from the JD found in the resume>],
  "keywordsMissing": [<array of important keywords from the JD missing from the resume>]
}

Target Role: ${role} at ${company}
Job Description:
${jobDescription}

Resume Text:
${resumeText}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text(), null as any);
    if (parsed && typeof parsed.matchScore === 'number') return parsed;
    return fallbackJobMatch(resumeText, company, role, jobDescription);
  } catch (error) {
    console.warn('Gemini job match failed, using fallback:', error);
    return fallbackJobMatch(resumeText, company, role, jobDescription);
  }
}

// 4. LinkedIn Optimizer
export async function optimizeLinkedInProfile(headline: string, about: string, skills: string, experience: string): Promise<{
  headlineSuggestions: string[];
  aboutSuggestion: string;
  suggestedKeywords: string[];
  scoreBreakdown: { section: string; score: number; suggestion: string }[];
}> {
  if (!hasValidApiKey()) return fallbackLinkedInOptimization(headline, about, skills, experience);
  try {
    const model = getAIModel(true);
    const prompt = `You are a top-tier LinkedIn Profile Optimizer and Executive Career Coach.
Analyze the provided LinkedIn profile content and return a JSON object with this exact structure:
{
  "headlineSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "aboutSuggestion": "A fully rewritten, highly engaging, and professional About section.",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
  "scoreBreakdown": [
    { "section": "Headline", "score": <0-100>, "suggestion": "Feedback" },
    { "section": "About", "score": <0-100>, "suggestion": "Feedback" },
    { "section": "Skills", "score": <0-100>, "suggestion": "Feedback" },
    { "section": "Experience", "score": <0-100>, "suggestion": "Feedback" }
  ]
}

Headline: ${headline}
About: ${about}
Skills: ${skills}
Experience: ${experience}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text(), null as any);
    if (parsed && Array.isArray(parsed.scoreBreakdown)) return parsed;
    return fallbackLinkedInOptimization(headline, about, skills, experience);
  } catch (error) {
    console.warn('Gemini LinkedIn optimization failed, using fallback:', error);
    return fallbackLinkedInOptimization(headline, about, skills, experience);
  }
}

// 5. Interview Coach
export async function evaluateInterviewAnswer(question: string, answer: string, category: string): Promise<{
  strengths: string[];
  improvements: string[];
  score: number;
}> {
  if (!hasValidApiKey()) return fallbackInterviewEvaluation(question, answer, category);
  try {
    const model = getAIModel(true);
    const prompt = `You are a Senior Engineering Manager conducting a mock interview.
Evaluate the candidate's answer to the interview question using the STAR method (Situation, Task, Action, Result).
Return a JSON object with this exact structure:
{
  "strengths": [<array of strings highlighting what they did well>],
  "improvements": [<array of strings suggesting specific ways to improve the answer>],
  "score": <number 0-100 evaluating the quality, depth, and structure of the answer>
}

Category: ${category}
Question: ${question}
Candidate's Answer: ${answer}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text(), null as any);
    if (parsed && typeof parsed.score === 'number') return parsed;
    return fallbackInterviewEvaluation(question, answer, category);
  } catch (error) {
    console.warn('Gemini interview evaluation failed, using fallback:', error);
    return fallbackInterviewEvaluation(question, answer, category);
  }
}
