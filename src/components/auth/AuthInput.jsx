/* src/components/auth/AuthInput.jsx
   Premium dark input used by the auth screens.

   Pure presentation: receives the existing form state and change handler
   from the parent so the Login/Register pages keep full control of
   validation, state, and accessibility wiring. */

const AuthInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required = false,
  inputMode,
  rightSlot,
  leftIcon,
  labelExtra,
}) => {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <div
        className={`relative flex items-center rounded-xl bg-bg-elevated-2
                    border transition-all duration-300 ease-cinematic
                    ${hasError
                      ? 'border-primary shadow-[0_0_0_3px_var(--color-primary-container)]'
                      : 'border-outline-variant hover:border-text-tertiary/40 focus-within:border-primary/70 focus-within:shadow-[0_0_0_3px_var(--color-primary-container)]'
                    }`}
      >
        {leftIcon && (
          <span
            aria-hidden="true"
            className="material-symbols-outlined pl-3.5 text-[19px] leading-none text-text-tertiary"
          >
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          inputMode={inputMode}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`w-full bg-transparent py-3.5 text-sm text-text-primary
                     placeholder:text-text-tertiary/70
                     focus:outline-none rounded-xl
                     ${leftIcon ? 'pl-2.5 pr-4' : 'px-4'}`}
        />
        {rightSlot && <div className="pr-2 flex items-center">{rightSlot}</div>}
      </div>
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-primary text-xs mt-1.5 pl-1 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;