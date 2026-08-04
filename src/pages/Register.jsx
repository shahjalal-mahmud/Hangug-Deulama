/* src/pages/Register.jsx
   Account creation. POSTs to /api/auth/register and on success the
   backend returns a JWT, so we immediately log the user in and
   redirect to the home page.

   UI redesign only — every interaction (validation, submit, redirect,
   show/hide password) is identical to the previous version, and the
   visual language is shared 1:1 with the redesigned Login page.

   @see docs/API.md#sec-auth-register
   @see docs/ARCHITECTURE.md#sec-auth-context
   @see docs/PROJECT.md#sec-proj-fr-user-mgmt */

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toFieldErrors } from '../utils/formErrors';
import LoadingState from '../components/ui/LoadingState';
import AuthHero from '../components/auth/AuthHero';
import BrandSection from '../components/auth/BrandSection';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';

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
      // NOTE: `register` doubles as a sign-in. The backend's
      // /api/auth/register endpoint already returns the JWT in its
      // 201 response, so AuthContext.login's persistence path runs
      // and we navigate straight to "/" — no separate sign-in step
      // is needed or wanted.
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
    <div className="relative min-h-screen w-full bg-bg-base text-text-primary overflow-hidden">
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left: cinematic collage (desktop only) — same AuthHero. */}
        <AuthHero />

        {/* Right: brand on mobile, auth card on every screen. */}
        <section className="relative flex flex-col items-center justify-center px-6 md:px-12 py-16 lg:py-24">
          <div className="w-full max-w-md">
            <BrandSection />

            <AuthCard
              title="Join the Story"
              subtitle="Discover a new world of K-dramas."
              error={submitError}
              footer={
                <p className="text-text-secondary text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:underline
                               transition-all duration-200
                               focus-visible:outline-none focus-visible:underline"
                  >
                    Log in
                  </Link>
                </p>
              }
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <AuthInput
                  id="full_name"
                  label="Full Name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange('full_name')}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                  error={errors.full_name}
                />

                <AuthInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="name@example.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  error={errors.email}
                />

                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  autoComplete="new-password"
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword((v) => !v)}
                  showForgotLink={false}
                />

                <AuthInput
                  id="password_confirmation"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange('password_confirmation')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  error={errors.password_confirmation}
                  leftIcon="lock"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2.5
                             rounded-xl
                             bg-linear-to-br from-primary via-primary-container to-secondary
                             text-on-primary
                             shadow-lg shadow-primary-container/25
                             hover:shadow-xl hover:shadow-primary-container/40
                             hover:scale-[1.02]
                             active:scale-[0.98]
                             transition-all duration-300 ease-cinematic
                             font-display text-base font-bold
                             px-6 py-4
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-primary/60 focus-visible:ring-offset-2
                             focus-visible:ring-offset-bg-base
                             disabled:opacity-60 disabled:cursor-not-allowed
                             disabled:hover:scale-100 disabled:hover:shadow-lg
                             disabled:hover:shadow-primary-container/25"
                >
                  {submitting && (
                    <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                  )}
                  <span>{submitting ? 'Creating account' : 'Create Account'}</span>
                  {!submitting && (
                    <span className="material-symbols-outlined text-[20px] leading-none">
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

export default Register;