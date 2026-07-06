/* src/pages/Login.jsx
   Sign-in screen. Posts to /api/auth/login, persists the returned JWT
   via AuthContext, and redirects to the page the user came from (or
   the home page if they navigated here directly). */

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toFieldErrors } from '../utils/formErrors';
import LoadingState from '../components/ui/LoadingState';

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
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md surface-card rounded-2xl p-8">
        <div className="mb-8 text-center">
          <p className="eyebrow text-accent mb-2">Welcome back</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            Sign in to Hangug Deulama
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Track dramas, build your list, and get personalized picks.
          </p>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 rounded-lg bg-accent/10 border border-accent/30
                       text-accent text-sm"
          >
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              aria-invalid={!!errors.email}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.email
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
              placeholder="you@example.com"
              required
            />
            {errors.email && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange('password')}
                aria-invalid={!!errors.password}
                className={`w-full bg-surface border rounded-full pl-4 pr-12 py-3 text-sm
                            text-text-primary placeholder:text-text-tertiary
                            focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  errors.password
                    ? 'border-accent focus:ring-accent/30'
                    : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary
                           hover:text-text-secondary p-1"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent
                       text-white text-sm font-medium uppercase tracking-wide px-6 py-3
                       hover:bg-accent-hover transition-all duration-300
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                       active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <span className="loading loading-spinner loading-xs" />}
            {submitting ? 'Signing in' : 'Sign In'}
          </button>
        </form>

        <p className="text-text-secondary text-sm text-center mt-6">
          New to Hangug Deulama?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;