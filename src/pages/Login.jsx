/* src/pages/Login.jsx
   Sign-in screen. Posts to /api/auth/login, persists the returned JWT
   via AuthContext, and redirects to the page the user came from (or
   the home page if they navigated here directly). */

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
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import AuthDivider from '../components/auth/AuthDivider';

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
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left: cinematic collage (desktop only). */}
        <AuthHero />

        {/* Right: brand on mobile, auth content on every screen. */}
        <section className="relative flex flex-col items-center justify-center px-6 md:px-12 py-16 lg:py-24">
          <div className="w-full max-w-md">
            <BrandSection />

            <AuthCard
              title="Welcome Back"
              subtitle="Continue your cinematic journey."
              error={submitError}
              footer={
                <p className="text-text-secondary text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="text-accent font-bold hover:underline
                               transition-all duration-200
                               focus-visible:outline-none focus-visible:underline"
                  >
                    Create account
                  </Link>
                </p>
              }
            >
              <SocialLoginButtons />

              <AuthDivider label="Or continue with email" />

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <AuthInput
                  id="email"
                  label="Email Address"
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
                  showForgotLink
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2
                             rounded-xl bg-accent text-white text-sm font-semibold
                             px-6 py-4
                             shadow-lg shadow-accent/20
                             hover:bg-accent-hover
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-accent/60 focus-visible:ring-offset-2
                             focus-visible:ring-offset-background
                             active:scale-[0.98]
                             transition-all duration-200 ease-cinematic
                             disabled:opacity-60 disabled:cursor-not-allowed
                             disabled:hover:bg-accent"
                >
                  {submitting && (
                    <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                  )}
                  <span>{submitting ? 'Signing in' : 'Sign In'}</span>
                  {!submitting && (
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      arrow_forward
                    </span>
                  )}
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