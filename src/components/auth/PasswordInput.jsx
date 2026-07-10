/* src/components/auth/PasswordInput.jsx
   Password field built on top of AuthInput. Keeps the existing
   show/hide logic (a single boolean toggle lifted to the parent) so
   the Login/Register pages don't lose control of state. */

import AuthInput from './AuthInput';

const PasswordInput = ({
  id,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  showPassword,
  onToggleVisibility,
  showForgotLink = false,
}) => {
  return (
    <AuthInput
      id={id}
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder="••••••••"
      error={error}
      autoComplete={autoComplete}
      required
      leftIcon="lock"
      labelExtra={
        showForgotLink ? (
          <button
            type="button"
            title="Coming soon"
            className="text-accent text-[11px] font-semibold uppercase tracking-widest
                       hover:text-accent-hover transition-colors duration-200"
          >
            Forgot?
          </button>
        ) : null
      }
      rightSlot={
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          className="flex items-center justify-center w-9 h-9 rounded-lg
                     text-text-tertiary hover:text-text-secondary
                     hover:bg-surface-overlay/60
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent/60
                     transition-all duration-200 ease-cinematic"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      }
    />
  );
};

export default PasswordInput;