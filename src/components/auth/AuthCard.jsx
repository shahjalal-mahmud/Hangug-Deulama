/* src/components/auth/AuthCard.jsx
   Right-hand auth content. Deliberately flat/borderless to match the
   approved reference — content sits directly on the page background
   rather than in a boxed card. */

const AuthCard = ({
  title = 'Welcome Back',
  subtitle,
  children,
  footer,
  error,
}) => {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-xl
                     bg-on-primary-container/40 border border-primary/40
                     text-primary text-sm flex items-start gap-2"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[18px] leading-none mt-0.5 shrink-0"
          >
            error
          </span>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <div className="space-y-6">{children}</div>

      {footer && <div className="text-center pt-8">{footer}</div>}
    </div>
  );
};

export default AuthCard;