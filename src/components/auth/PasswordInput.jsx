import AuthInput from './AuthInput';

const PasswordInput = ({
  id,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  showPassword,
  onToggleVisibility,
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