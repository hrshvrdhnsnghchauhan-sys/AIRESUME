import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Save, Check } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Profile } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setHeadline(profile.headline || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setWebsite(profile.website || '');
      setLinkedin(profile.linkedin || '');
      setSummary(profile.summary || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await setDoc(doc(db, 'profiles', user.uid), {
      user_id: user.uid,
      full_name: fullName,
      headline,
      phone,
      location,
      website,
      linkedin,
      summary,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your profile and account preferences</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-semibold text-white">
              {fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-900">{fullName || 'Your Name'}</h3>
              <p className="text-sm text-ink-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
              <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" />
            </div>
            <Input label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Senior Software Engineer" />

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
                <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" placeholder="+1 555 0123" />
              </div>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" placeholder="San Francisco, CA" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
                <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} className="pl-10" placeholder="yoursite.com" />
              </div>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
                <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="pl-10" placeholder="linkedin.com/in/..." />
              </div>
            </div>

            <Textarea label="Professional Summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A brief summary about yourself..." className="min-h-[100px]" />

            <div className="flex justify-end">
              <Button onClick={handleSave} loading={saving}>
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Account */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-ink-900">Account</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-ink-50 p-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-sm font-medium text-ink-900">Email</p>
                  <p className="text-xs text-ink-500">{user?.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-success-500/10 px-2.5 py-0.5 text-xs font-medium text-success-600">Verified</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-ink-50 p-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-ink-400" />
                <div>
                  <p className="text-sm font-medium text-ink-900">Plan</p>
                  <p className="text-xs text-ink-500">Free Plan</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Upgrade</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
