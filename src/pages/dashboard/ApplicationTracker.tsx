import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Briefcase,
  Trash2,
  Calendar,
  MoreVertical,
  X,
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Application, ApplicationStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn, relativeTime, formatDate } from '@/lib/utils';
import { container, fadeUp } from '@/lib/motion';

const statusOrder: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'rejected', 'offer', 'accepted'];
const statusLabels: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  rejected: 'Rejected',
  offer: 'Offer',
  accepted: 'Accepted',
};
const statusColors: Record<ApplicationStatus, string> = {
  wishlist: 'border-t-ink-400 bg-ink-50',
  applied: 'border-t-brand-500 bg-brand-50',
  interview: 'border-t-accent-500 bg-accent-50',
  rejected: 'border-t-error-500 bg-error-500/5',
  offer: 'border-t-success-500 bg-success-500/5',
  accepted: 'border-t-success-600 bg-success-600/10',
};

export default function ApplicationTracker() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('wishlist');
  const [jobUrl, setJobUrl] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'applications'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      data.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompany('');
    setRole('');
    setStatus('wishlist');
    setJobUrl('');
    setSalary('');
    setLocation('');
    setNotes('');
    setAppliedDate('');
    setInterviewDate('');
    setEditingApp(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (app: Application) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setJobUrl(app.job_url);
    setSalary(app.salary);
    setLocation(app.location);
    setNotes(app.notes);
    setAppliedDate(app.applied_date || '');
    setInterviewDate(app.interview_date || '');
    setSelectedApp(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!company.trim() || !role.trim() || !user) return;

    const payload = {
      company,
      role,
      status,
      job_url: jobUrl,
      salary,
      location,
      notes,
      applied_date: appliedDate || null,
      interview_date: interviewDate || null,
      updated_at: new Date().toISOString(),
    };

    if (editingApp) {
      await updateDoc(doc(db, 'applications', editingApp.id), payload);
    } else {
      await addDoc(collection(db, 'applications'), {
        ...payload,
        user_id: user.uid,
        created_at: new Date().toISOString(),
      });
    }

    setModalOpen(false);
    resetForm();
    fetchApplications();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'applications', id));
    setApplications(applications.filter((a) => a.id !== id));
    setSelectedApp(null);
  };

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus) => {
    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, 'applications', app.id), { status: newStatus, updated_at: updatedAt });
    setApplications(applications.map((a) => (a.id === app.id ? { ...a, status: newStatus, updated_at: updatedAt } : a)));
  };

  const grouped = statusOrder.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s);
    return acc;
  }, {} as Record<ApplicationStatus, Application[]>);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Application Tracker</h1>
          <p className="mt-1 text-sm text-ink-500">Track every application from wishlist to offer</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-ink-200 bg-surface p-0.5">
            <button
              onClick={() => setView('board')}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium', view === 'board' ? 'bg-brand-600 text-white' : 'text-ink-600')}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium', view === 'list' ? 'bg-brand-600 text-white' : 'text-ink-600')}
            >
              List
            </button>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statusOrder.map((s) => (
            <div key={s} className="h-48 animate-pulse rounded-xl bg-ink-100" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 py-20">
          <Briefcase className="h-12 w-12 text-ink-300" />
          <p className="mt-4 text-lg font-medium text-ink-900">No applications yet</p>
          <p className="mt-1 text-sm text-ink-500">Start tracking your job applications</p>
          <Button className="mt-4" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      ) : view === 'board' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {statusOrder.map((s) => (
            <div key={s} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-ink-700">{statusLabels[s]}</span>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                  {grouped[s].length}
                </span>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {grouped[s].map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      onClick={() => setSelectedApp(app)}
                      className={cn('cursor-pointer rounded-xl border-t-4 border border-ink-200 bg-surface p-3 shadow-sm transition-shadow hover:shadow-md', statusColors[s])}
                    >
                      <p className="text-sm font-semibold text-ink-900">{app.company}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{app.role}</p>
                      {app.location && <p className="mt-1 text-xs text-ink-400">{app.location}</p>}
                      {app.applied_date && <p className="mt-1 text-xs text-ink-400">Applied {formatDate(app.applied_date)}</p>}
                      <p className="mt-2 text-[10px] text-ink-400">{relativeTime(app.updated_at)}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-500">
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Updated</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-ink-50 hover:bg-ink-50">
                    <td className="px-6 py-3 font-medium text-ink-900">{app.company}</td>
                    <td className="px-6 py-3 text-ink-600">{app.role}</td>
                    <td className="px-6 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                        className="rounded-lg border border-ink-200 bg-surface px-2 py-1 text-xs font-medium capitalize"
                      >
                        {statusOrder.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-ink-600">{app.location || '—'}</td>
                    <td className="px-6 py-3 text-ink-500">{relativeTime(app.updated_at)}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => setSelectedApp(app)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingApp ? 'Edit Application' : 'Add Application'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" />
            <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="h-11 rounded-xl border border-ink-300 bg-surface px-3.5 text-sm shadow-sm"
              >
                {statusOrder.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Job URL" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." />
            <Input label="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$120,000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Applied Date" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
            <Input label="Interview Date" type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
          </div>
          <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about this application..." className="min-h-[80px]" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!company.trim() || !role.trim()}>
              {editingApp ? 'Update' : 'Add'} Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp?.company}
        description={selectedApp?.role}
        size="md"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={selectedApp.status === 'rejected' ? 'error' : selectedApp.status === 'offer' || selectedApp.status === 'accepted' ? 'success' : 'brand'}>
                {statusLabels[selectedApp.status]}
              </Badge>
              {selectedApp.location && <span className="text-sm text-ink-500">{selectedApp.location}</span>}
            </div>

            {selectedApp.salary && <p className="text-sm text-ink-700">Salary: {selectedApp.salary}</p>}
            {selectedApp.job_url && (
              <a href={selectedApp.job_url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-600 hover:underline">
                View Job Posting
              </a>
            )}
            {selectedApp.applied_date && (
              <p className="flex items-center gap-2 text-sm text-ink-700">
                <Calendar className="h-4 w-4 text-ink-400" />
                Applied: {formatDate(selectedApp.applied_date)}
              </p>
            )}
            {selectedApp.interview_date && (
              <p className="flex items-center gap-2 text-sm text-ink-700">
                <Calendar className="h-4 w-4 text-ink-400" />
                Interview: {formatDate(selectedApp.interview_date)}
              </p>
            )}
            {selectedApp.notes && (
              <div className="rounded-lg bg-ink-50 p-3">
                <p className="text-xs font-medium text-ink-500">Notes</p>
                <p className="mt-1 text-sm text-ink-700">{selectedApp.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {statusOrder.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    handleStatusChange(selectedApp, s);
                    setSelectedApp({ ...selectedApp, status: s });
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    selectedApp.status === s ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200',
                  )}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-ink-100 pt-4">
              <Button variant="danger" size="sm" onClick={() => handleDelete(selectedApp.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => openEdit(selectedApp)}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
