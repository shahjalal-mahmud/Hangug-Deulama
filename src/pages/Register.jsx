/* src/pages/Register.jsx
   Account creation. POSTs to /api/auth/register and on success the
   backend returns a JWT, so we immediately log the user in and
   redirect to the home page. */

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toFieldErrors } from '../utils/formErrors';
import LoadingState from '../components/ui/LoadingState';

const Register = () => {
  const { register, isAuthenticated, bootstrapped, status } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (bootstrapped && isAuthenticated) {
    return <Navigate to="/" replace />;
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
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      localErrors.full_name = 'Please enter your full name (at least 2 characters).';
    }
    if (!form.email.trim()) {
      localErrors.email = 'Email is required.';
    }
    if (!form.password) {
      localErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      localErrors.password = 'Password must be at least 8 characters.';
    }
    if (form.password !== form.password_confirmation) {
      localErrors.password_confirmation = 'Passwords do not match.';
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      navigate('/', { replace: true });
    } catch (err) {
      const fieldErrors = toFieldErrors(err.errors);
      setErrors(fieldErrors);
      setSubmitError(err.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md surface-card rounded-2xl p-8">
        <div className="mb-8 text-center">
          <p className="eyebrow text-accent mb-2">Join the cinema</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            Create your account
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Save favorites, build a watchlist, and get picks tailored to your taste.
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
            <label htmlFor="full_name" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange('full_name')}
              aria-invalid={!!errors.full_name}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.full_name
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
              placeholder="Jane Doe"
              required
            />
            {errors.full_name && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.full_name}</p>
            )}
          </div>

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
                autoComplete="new-password"
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
                placeholder="At least 8 characters"
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

          <div>
            <label htmlFor="password_confirmation" className="block text-xs font-medium uppercase tracking-wider text-text-secondary mb-1.5">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={handleChange('password_confirmation')}
              aria-invalid={!!errors.password_confirmation}
              className={`w-full bg-surface border rounded-full px-4 py-3 text-sm
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 transition-colors duration-300 ${
                errors.password_confirmation
                  ? 'border-accent focus:ring-accent/30'
                  : 'border-border-strong focus:border-accent/60 focus:ring-accent/20'
              }`}
              placeholder="Repeat your password"
              required
            />
            {errors.password_confirmation && (
              <p className="text-accent text-xs mt-1.5 pl-1">{errors.password_confirmation}</p>
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
            {submitting ? 'Creating account' : 'Create Account'}
          </button>
        </form>

        <p className="text-text-secondary text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;