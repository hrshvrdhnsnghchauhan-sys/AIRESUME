import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Download,
  ArrowLeft,
  Save,
  Eye,
  Palette,
  Type,
  Sparkles,
} from 'lucide-react';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Resume, ResumeContent, ResumeTheme, ExperienceItem, EducationItem, SkillGroup, ProjectItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import TemplateSelector from '@/components/dashboard/TemplateSelector';

const emptyContent: ResumeContent = {
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
};

const defaultTheme: ResumeTheme = {
  primaryColor: '#2553eb',
  fontFamily: 'Inter',
  fontSize: 'medium',
  spacing: 'normal',
};

const templates = ['modern', 'minimal', 'classic', 'executive'];
const colors = ['#2553eb', '#0f172a', '#059669', '#dc2626', '#7c3aed', '#ea580c'];
const fonts = ['Inter', 'Georgia', 'Times New Roman', 'Helvetica'];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(emptyContent);
  const [theme, setTheme] = useState<ResumeTheme>(defaultTheme);
  const [title, setTitle] = useState('Untitled Resume');
  const [template, setTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResume(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadResume = async (resumeId: string) => {
    try {
      const docRef = doc(db, 'resumes', resumeId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        navigate('/app/resumes');
        return;
      }
      const r = { id: docSnap.id, ...docSnap.data() } as Resume;
      setResume(r);
      setContent(r.content || emptyContent);
      setTheme(r.theme || defaultTheme);
      setTitle(r.title);
      setTemplate(r.template);
    } catch (e) {
      navigate('/app/resumes');
    }
    setLoading(false);
  };

  const save = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      title,
      template,
      theme,
      content,
      updated_at: new Date().toISOString(),
    };

    try {
      if (resume) {
        await updateDoc(doc(db, 'resumes', resume.id), payload);
        setSavedAt(new Date().toISOString());
      } else {
        const docRef = await addDoc(collection(db, 'resumes'), {
          ...payload,
          user_id: user.uid,
          created_at: new Date().toISOString(),
        });
        setResume({ id: docRef.id, ...payload, user_id: user.uid } as Resume);
        setSavedAt(new Date().toISOString());
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    }
    setSaving(false);
  }, [resume, title, template, theme, content, user]);

  // Autosave every 5 seconds if there are changes
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => save(), 5000);
    return () => clearTimeout(timer);
  }, [content, theme, title, template, loading, save]);

  const updateContent = (key: keyof ResumeContent, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const exportPDF = async () => {
    if (!resumeRef.current) return;
    
    // Show loading state on button (we can use the saving state temporarily or a new one)
    setSaving(true);
    try {
      const element = resumeRef.current;
      
      // Temporarily scale up for better resolution
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid h-full place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const sections = [
    { key: 'summary', label: 'Summary' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'languages', label: 'Languages' },
    { key: 'awards', label: 'Awards' },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-ink-200 bg-surface px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/resumes')}
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold text-ink-900 outline-none focus:bg-ink-50 rounded-lg px-2 py-1 -ml-2"
          />
          {savedAt && (
            <span className="text-xs text-ink-400">Saved {new Date(savedAt).toLocaleTimeString()}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPDF} loading={saving}>
            <Download className="h-4 w-4" />
            Pixel-Perfect Recruiter-Ready PDF Export
          </Button>
          <Button size="sm" onClick={save} loading={saving}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — section nav */}
        <div className="hidden w-56 shrink-0 overflow-y-auto border-r border-ink-200 bg-surface p-3 md:block">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Sections</p>
          <ul className="space-y-0.5">
            {sections.map((s) => (
              <li key={s.key}>
                <button
                  onClick={() => setActiveSection(s.key)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    activeSection === s.key
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-ink-100',
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Theme controls */}
          <div className="mt-6 border-t border-ink-100 pt-4">
            <p className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <Palette className="h-3.5 w-3.5" />
              Theme
            </p>
            <div className="px-3">
              <TemplateSelector 
                template={template} 
                setTemplate={setTemplate} 
                theme={theme} 
                setTheme={setTheme} 
                colors={colors} 
                fonts={fonts} 
              />
            </div>
          </div>
        </div>

        {/* Middle — editor */}
        <div className="w-full max-w-md overflow-y-auto border-r border-ink-200 p-6 lg:max-w-lg">
          {activeSection === 'summary' && (
            <SectionWrapper title="Professional Summary">
              <Textarea
                value={content.summary || ''}
                onChange={(e) => updateContent('summary', e.target.value)}
                placeholder="Write a compelling summary of your experience and career goals..."
                className="min-h-[120px]"
              />
            </SectionWrapper>
          )}

          {activeSection === 'experience' && (
            <ExperienceEditor content={content} updateContent={updateContent} />
          )}
          {activeSection === 'education' && (
            <EducationEditor content={content} updateContent={updateContent} />
          )}
          {activeSection === 'skills' && (
            <SkillsEditor content={content} updateContent={updateContent} />
          )}
          {activeSection === 'projects' && (
            <ProjectsEditor content={content} updateContent={updateContent} />
          )}
          {activeSection === 'certifications' && (
            <SimpleListEditor
              title="Certifications"
              items={content.certifications || []}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'issuer', label: 'Issuer' },
                { key: 'date', label: 'Date' },
                { key: 'url', label: 'URL' },
              ]}
              onUpdate={(items) => updateContent('certifications', items)}
            />
          )}
          {activeSection === 'languages' && (
            <LanguagesEditor content={content} updateContent={updateContent} />
          )}
          {activeSection === 'awards' && (
            <SimpleListEditor
              title="Awards"
              items={content.awards || []}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'issuer', label: 'Issuer' },
                { key: 'date', label: 'Date' },
              ]}
              onUpdate={(items) => updateContent('awards', items)}
            />
          )}
        </div>

        {/* Right — preview */}
        <div className="hidden flex-1 overflow-y-auto bg-ink-950 p-6 lg:block">
          <div className="mx-auto max-w-[210mm] shadow-2xl glass-card rounded-xl p-2">
            <div ref={resumeRef} className="bg-white" style={{ minHeight: '297mm' }}>
              <ResumePreview content={content} theme={theme} template={template} title={title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

function ExperienceEditor({
  content,
  updateContent,
}: {
  content: ResumeContent;
  updateContent: (key: keyof ResumeContent, value: unknown) => void;
}) {
  const items = content.experience || [];

  const add = () => {
    const newItem: ExperienceItem = {
      id: uid(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    updateContent('experience', [...items, newItem]);
  };

  const update = (idx: number, field: keyof ExperienceItem, value: unknown) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    updateContent('experience', next);
  };

  const remove = (idx: number) => {
    updateContent('experience', items.filter((_, i) => i !== idx));
  };

  return (
    <SectionWrapper title="Work Experience">
      <div className="space-y-4">
        {items.map((exp, idx) => (
          <Card key={exp.id} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <GripVertical className="h-4 w-4 text-ink-300" />
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Role" value={exp.role} onChange={(e) => update(idx, 'role', e.target.value)} placeholder="Software Engineer" />
              <Input label="Company" value={exp.company} onChange={(e) => update(idx, 'company', e.target.value)} placeholder="Google" />
              <Input label="Location" value={exp.location} onChange={(e) => update(idx, 'location', e.target.value)} placeholder="San Francisco, CA" />
              <div className="flex items-end gap-2">
                <Input label="Start" value={exp.startDate} onChange={(e) => update(idx, 'startDate', e.target.value)} placeholder="Jan 2023" />
                <Input label="End" value={exp.endDate} onChange={(e) => update(idx, 'endDate', e.target.value)} placeholder="Present" disabled={exp.current} />
              </div>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={exp.current} onChange={(e) => update(idx, 'current', e.target.checked)} className="rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
              I currently work here
            </label>
            <div className="mt-3">
              <p className="mb-1.5 text-sm font-medium text-ink-700">Bullet Points</p>
              <div className="space-y-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <Textarea
                      value={bullet}
                      onChange={(e) => {
                        const next = [...exp.bullets];
                        next[bIdx] = e.target.value;
                        update(idx, 'bullets', next);
                      }}
                      placeholder="Achieved X by doing Y, resulting in Z..."
                      className="min-h-[60px] flex-1"
                    />
                    <button
                      onClick={() => update(idx, 'bullets', exp.bullets.filter((_, i) => i !== bIdx))}
                      className="self-start rounded-lg p-2 text-error-500 hover:bg-error-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => update(idx, 'bullets', [...exp.bullets, ''])}
                >
                  <Plus className="h-4 w-4" />
                  Add Bullet
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>
    </SectionWrapper>
  );
}

function EducationEditor({
  content,
  updateContent,
}: {
  content: ResumeContent;
  updateContent: (key: keyof ResumeContent, value: unknown) => void;
}) {
  const items = content.education || [];

  const add = () => {
    const newItem: EducationItem = {
      id: uid(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    updateContent('education', [...items, newItem]);
  };

  const update = (idx: number, field: keyof EducationItem, value: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    updateContent('education', next);
  };

  const remove = (idx: number) => {
    updateContent('education', items.filter((_, i) => i !== idx));
  };

  return (
    <SectionWrapper title="Education">
      <div className="space-y-4">
        {items.map((edu, idx) => (
          <Card key={edu.id} className="p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="School" value={edu.school} onChange={(e) => update(idx, 'school', e.target.value)} placeholder="Stanford University" />
              <Input label="Degree" value={edu.degree} onChange={(e) => update(idx, 'degree', e.target.value)} placeholder="B.S." />
              <Input label="Field" value={edu.field} onChange={(e) => update(idx, 'field', e.target.value)} placeholder="Computer Science" />
              <Input label="GPA" value={edu.gpa || ''} onChange={(e) => update(idx, 'gpa', e.target.value)} placeholder="3.8" />
              <Input label="Start" value={edu.startDate} onChange={(e) => update(idx, 'startDate', e.target.value)} placeholder="2018" />
              <Input label="End" value={edu.endDate} onChange={(e) => update(idx, 'endDate', e.target.value)} placeholder="2022" />
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>
    </SectionWrapper>
  );
}

function SkillsEditor({
  content,
  updateContent,
}: {
  content: ResumeContent;
  updateContent: (key: keyof ResumeContent, value: unknown) => void;
}) {
  const groups = content.skills || [];

  const add = () => {
    const newGroup: SkillGroup = { id: uid(), category: '', skills: [] };
    updateContent('skills', [...groups, newGroup]);
  };

  const update = (idx: number, field: keyof SkillGroup, value: unknown) => {
    const next = [...groups];
    next[idx] = { ...next[idx], [field]: value };
    updateContent('skills', next);
  };

  const remove = (idx: number) => {
    updateContent('skills', groups.filter((_, i) => i !== idx));
  };

  return (
    <SectionWrapper title="Skills">
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <Card key={group.id} className="p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Input
              label="Category"
              value={group.category}
              onChange={(e) => update(idx, 'category', e.target.value)}
              placeholder="Programming Languages"
            />
            <div className="mt-3">
              <Input
                label="Skills (comma separated)"
                value={group.skills.join(', ')}
                onChange={(e) => update(idx, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="Python, JavaScript, Go"
              />
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add Skill Group
        </Button>
      </div>
    </SectionWrapper>
  );
}

function ProjectsEditor({
  content,
  updateContent,
}: {
  content: ResumeContent;
  updateContent: (key: keyof ResumeContent, value: unknown) => void;
}) {
  const items = content.projects || [];

  const add = () => {
    const newItem: ProjectItem = {
      id: uid(),
      name: '',
      description: '',
      url: '',
      tech: [],
      bullets: [],
    };
    updateContent('projects', [...items, newItem]);
  };

  const update = (idx: number, field: keyof ProjectItem, value: unknown) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    updateContent('projects', next);
  };

  const remove = (idx: number) => {
    updateContent('projects', items.filter((_, i) => i !== idx));
  };

  return (
    <SectionWrapper title="Projects">
      <div className="space-y-4">
        {items.map((proj, idx) => (
          <Card key={proj.id} className="p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={proj.name} onChange={(e) => update(idx, 'name', e.target.value)} placeholder="My Awesome Project" />
              <Input label="URL" value={proj.url} onChange={(e) => update(idx, 'url', e.target.value)} placeholder="github.com/..." />
            </div>
            <div className="mt-3">
              <Textarea label="Description" value={proj.description} onChange={(e) => update(idx, 'description', e.target.value)} placeholder="A brief description..." />
            </div>
            <div className="mt-3">
              <Input label="Tech Stack (comma separated)" value={proj.tech.join(', ')} onChange={(e) => update(idx, 'tech', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="React, Node.js, PostgreSQL" />
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>
    </SectionWrapper>
  );
}

function SimpleListEditor({
  title,
  items,
  fields,
  onUpdate,
}: {
  title: string;
  items: Record<string, string>[];
  fields: { key: string; label: string }[];
  onUpdate: (items: Record<string, string>[]) => void;
}) {
  const add = () => onUpdate([...items, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  const update = (idx: number, key: string, value: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [key]: value };
    onUpdate(next);
  };
  const remove = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));

  return (
    <SectionWrapper title={title}>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <Input key={f.key} label={f.label} value={item[f.key] || ''} onChange={(e) => update(idx, f.key, e.target.value)} />
              ))}
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add {title.replace(/s$/, '')}
        </Button>
      </div>
    </SectionWrapper>
  );
}

function LanguagesEditor({
  content,
  updateContent,
}: {
  content: ResumeContent;
  updateContent: (key: keyof ResumeContent, value: unknown) => void;
}) {
  const items = content.languages || [];

  const add = () => updateContent('languages', [...items, { name: '', level: 'Fluent' }]);
  const update = (idx: number, field: string, value: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    updateContent('languages', next);
  };
  const remove = (idx: number) => updateContent('languages', items.filter((_, i) => i !== idx));

  return (
    <SectionWrapper title="Languages">
      <div className="space-y-4">
        {items.map((lang, idx) => (
          <Card key={idx} className="p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => remove(idx)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Language" value={lang.name} onChange={(e) => update(idx, 'name', e.target.value)} placeholder="English" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">Proficiency</label>
                <select
                  value={lang.level}
                  onChange={(e) => update(idx, 'level', e.target.value)}
                  className="h-11 rounded-xl border border-ink-300 bg-surface px-3.5 text-sm shadow-sm"
                >
                  {['Beginner', 'Intermediate', 'Fluent', 'Native'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>
    </SectionWrapper>
  );
}

function ResumePreview({
  content,
  theme,
  template,
  title,
}: {
  content: ResumeContent;
  theme: ResumeTheme;
  template: string;
  title: string;
}) {
  const fontSizeClass =
    theme.fontSize === 'small' ? 'text-xs' : theme.fontSize === 'large' ? 'text-sm' : 'text-[13px]';

  return (
    <div
      className="rounded-xl bg-surface p-8 shadow-lg"
      style={{ fontFamily: theme.fontFamily, color: '#1f2937' }}
    >
      {/* Header */}
      <div className={cn('border-b-2 pb-4', template === 'executive' ? 'border-ink-900' : '')} style={{ borderColor: theme.primaryColor }}>
        <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>{title}</h1>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mt-4">
          <h2 className={cn('mb-1.5 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Summary
          </h2>
          <p className={cn('leading-relaxed text-ink-700', fontSizeClass)}>{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Experience
          </h2>
          <div className="space-y-3">
            {content.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <p className={cn('font-semibold text-ink-900', fontSizeClass)}>
                    {exp.role} {exp.company && `at ${exp.company}`}
                  </p>
                  <p className={cn('text-ink-500', fontSizeClass)}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                {exp.location && <p className={cn('text-ink-500', fontSizeClass)}>{exp.location}</p>}
                <ul className={cn('mt-1 list-disc pl-4 text-ink-700', fontSizeClass)}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Education
          </h2>
          <div className="space-y-2">
            {content.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between">
                  <p className={cn('font-semibold text-ink-900', fontSizeClass)}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  <p className={cn('text-ink-500', fontSizeClass)}>
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
                <p className={cn('text-ink-600', fontSizeClass)}>{edu.school}</p>
                {edu.gpa && <p className={cn('text-ink-500', fontSizeClass)}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Skills
          </h2>
          <div className="space-y-1">
            {content.skills.map((group) => (
              <p key={group.id} className={cn('text-ink-700', fontSizeClass)}>
                <span className="font-semibold">{group.category}:</span> {group.skills.join(', ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Projects
          </h2>
          <div className="space-y-2">
            {content.projects.map((proj) => (
              <div key={proj.id}>
                <p className={cn('font-semibold text-ink-900', fontSizeClass)}>
                  {proj.name}
                  {proj.url && <span className="ml-2 text-ink-500">{proj.url}</span>}
                </p>
                <p className={cn('text-ink-700', fontSizeClass)}>{proj.description}</p>
                {proj.tech.length > 0 && (
                  <p className={cn('text-ink-500', fontSizeClass)}>Tech: {proj.tech.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {content.certifications && content.certifications.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Certifications
          </h2>
          <div className="space-y-1">
            {content.certifications.map((cert, i) => (
              <p key={i} className={cn('text-ink-700', fontSizeClass)}>
                <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.date})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {content.languages && content.languages.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Languages
          </h2>
          <p className={cn('text-ink-700', fontSizeClass)}>
            {content.languages.map((l) => `${l.name} (${l.level})`).join(', ')}
          </p>
        </div>
      )}

      {/* Awards */}
      {content.awards && content.awards.length > 0 && (
        <div className="mt-4">
          <h2 className={cn('mb-2 font-semibold uppercase tracking-wide', fontSizeClass)} style={{ color: theme.primaryColor }}>
            Awards
          </h2>
          <div className="space-y-1">
            {content.awards.map((award, i) => (
              <p key={i} className={cn('text-ink-700', fontSizeClass)}>
                <span className="font-semibold">{award.title}</span> — {award.issuer} ({award.date})
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
