/* src/pages/Login.jsx
   Sign-in screen. Posts to /api/auth/login, persists the returned JWT
   via AuthContext, and redirects to the page the user came from (or
   the home page if they navigated here directly).

   UI redesign only — every interaction (validation, submit, redirect,
   show/hide password) is identical to the previous version. */

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toFieldErrors } from '../utils/formErrors';
import LoadingState from '../components/ui/LoadingState';
import AuthHero from '../components/auth/AuthHero';
import BrandSection from '../components/auth/BrandSection';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';

const Login = () => {
  const { login, isAuthenticated, bootstrapped, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (bootstrapped && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  if (!bootstrapped || status === 'authenticating') {
    return <LoadingState label="Checking your session" />;
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    const localErrors = {};
    if (!form.email.trim()) localErrors.email = 'Email is required.';
    if (!form.password) localErrors.password = 'Password is required.';
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      const fieldErrors = toFieldErrors(err.errors);
      setErrors(fieldErrors);
      setSubmitError(err.message || 'Could not sign you in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-text-primary overflow-hidden">
      {/* Soft radial wash behind the right panel — adds depth without
          introducing any new color tokens. */}
      <div
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(circle_at_top_right,rgba(179,55,63,0.08),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(214,168,92,0.05),transparent_60%)]"
        aria-hidden="true"
      />
      {/* Reuse the existing film-grain utility at very low opacity. */}
      <div className="absolute inset-0 film-grain opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left: cinematic collage (desktop only). */}
        <AuthHero />

        {/* Right: brand on mobile, auth card on every screen. */}
        <section className="relative flex flex-col items-center justify-center px-5 sm:px-8 py-16 lg:py-24">
          <div className="w-full max-w-md">
            <BrandSection />

            <AuthCard
              eyebrow="Sign in"
              title="Welcome Back"
              subtitle="Continue your cinematic journey through Korean drama."
              error={submitError}
              footer={
                <p className="text-text-secondary text-sm">
                  New to Hangug Deulama?{' '}
                  <Link
                    to="/register"
                    className="text-accent font-semibold hover:text-accent-hover
                               transition-colors duration-200
                               focus-visible:outline-none focus-visible:underline"
                  >
                    Create an account
                  </Link>
                </p>
              }
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <AuthInput
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  leftIcon="mail"
                  error={errors.email}
                />

                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword((v) => !v)}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2
                             rounded-xl bg-accent text-white text-sm font-semibold
                             uppercase tracking-[0.08em] px-6 py-3.5
                             shadow-[0_18px_40px_-18px_rgba(179,55,63,0.9)]
                             hover:bg-accent-hover
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-accent/60 focus-visible:ring-offset-2
                             focus-visible:ring-offset-background
                             active:scale-[0.985]
                             transition-all duration-300 ease-cinematic
                             disabled:opacity-60 disabled:cursor-not-allowed
                             disabled:hover:bg-accent"
                >
                  {submitting && (
                    <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                  )}
                  {submitting ? 'Signing in' : 'Sign In'}
                </button>
              </form>
            </AuthCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;