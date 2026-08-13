import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);
    if (error) {
      setServerError(error);
    } else {
      navigate('/app');
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Create your account</h1>
      <p className="mt-2 text-sm text-ink-500">
        Start your career journey with AI — free forever
      </p>

      {serverError && (
        <div className="mt-6 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            {...register('fullName')}
            error={errors.fullName?.message}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-ink-400" />
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            {...register('password')}
            error={errors.password?.message}
            className="pl-10"
          />
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
