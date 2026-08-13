import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, MoreVertical, Trash2, Copy, ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Resume } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { relativeTime } from '@/lib/utils';
import { container, fadeUp } from '@/lib/motion';

export default function ResumeList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const fetchResumes = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'resumes'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume));
      data.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [user]);

  const createResume = async () => {
    if (!user) return;
    const title = newTitle.trim() || 'Untitled Resume';
    
    const newResume = {
      title,
      template: 'modern',
      theme: { primaryColor: '#2553eb', fontFamily: 'Inter', fontSize: 'medium', spacing: 'normal' },
      content: {},
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'resumes'), newResume);
    navigate(`/app/resumes/${docRef.id}`);
  };

  const deleteResume = async (id: string) => {
    await deleteDoc(doc(db, 'resumes', id));
    setResumes(resumes.filter((r) => r.id !== id));
    setMenuOpen(null);
  };

  const duplicateResume = async (resume: Resume) => {
    if (!user) return;
    const newResume = {
      title: `${resume.title} (Copy)`,
      template: resume.template,
      theme: resume.theme,
      content: resume.content,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'resumes'), newResume);
    setResumes([{ ...newResume, id: docRef.id } as Resume, ...resumes]);
    setMenuOpen(null);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">My Resumes</h1>
          <p className="mt-1 text-sm text-ink-500">Create and manage your resume versions</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Resume
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 py-20">
          <FileText className="h-12 w-12 text-ink-300" />
          <p className="mt-4 text-lg font-medium text-ink-900">No resumes yet</p>
          <p className="mt-1 text-sm text-ink-500">Create your first resume to get started</p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Resume
          </Button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resumes.map((resume) => (
            <motion.div key={resume.id} variants={fadeUp} whileHover={{ y: -4 }}>
              <Card
                className="group cursor-pointer p-5 transition-shadow hover:shadow-lg"
                onClick={() => navigate(`/app/resumes/${resume.id}`)}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50">
                    <FileText className="h-6 w-6 text-brand-600" />
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === resume.id ? null : resume.id);
                      }}
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuOpen === resume.id && (
                      <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-ink-200 bg-surface py-1 shadow-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateResume(resume);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-100"
                        >
                          <Copy className="h-4 w-4" /> Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(resume.id);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-500/10"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="mt-4 truncate text-base font-semibold text-ink-900">{resume.title}</h3>
                <p className="mt-1 text-xs text-ink-500">
                  {resume.template} template · Updated {relativeTime(resume.updated_at)}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Open editor <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Resume" description="Give your resume a name to get started">
        <Input
          label="Resume Title"
          placeholder="e.g. Software Engineer Resume"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createResume()}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={createResume}>
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </Modal>
    </div>
  );
}
