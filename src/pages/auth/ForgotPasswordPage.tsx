import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Error sending password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/login" className="mb-6 flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Reset password</h1>
      <p className="mt-2 text-sm text-ink-500">
        Enter your email and we'll send you a reset link
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-600">
          Check your email for a reset link.
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-6 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
              <Input
                label="Email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Send Reset Link
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
