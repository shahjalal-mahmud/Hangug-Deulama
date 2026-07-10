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
}) => {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.14em]
                   text-text-secondary mb-2"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl bg-surface-elevated/80
                    border transition-all duration-300 ease-cinematic
                    backdrop-blur-sm
                    ${hasError
                      ? 'border-accent shadow-[0_0_0_3px_var(--color-accent-muted)]'
                      : 'border-border-strong hover:border-text-tertiary/40 focus-within:border-accent/70 focus-within:shadow-[0_0_0_3px_var(--color-accent-muted)]'
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
          className="text-accent text-xs mt-1.5 pl-1 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;