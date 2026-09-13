import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { EyeIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/Logo';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { useAuth } from '../AuthContext';
import { Notice } from '../components/AdminUi';

export default function Login() {
  useDocumentTitle('Sign in · Admin');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length > 0) {
        setErrors(err.fields);
      } else {
        setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-surface-sunken p-8 shadow-panel">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold tracking-tight">Sign in to Yenko admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage blog posts, categories and messages.</p>

          <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
            {formError && <Notice tone="error">{formError}</Notice>}
            <TextField
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              required
              autoFocus
            />
            <div className="relative">
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3 top-[2.35rem] rounded-lg p-1.5 text-ink-muted hover:text-ink"
              >
                <EyeIcon width={18} height={18} />
              </button>
            </div>
            <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
              {submitting && <Spinner label="Signing in" />}
              Sign in
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
