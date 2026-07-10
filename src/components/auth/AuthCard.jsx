const AuthCard = ({
  eyebrow = 'Sign in',
  title = 'Welcome Back',
  subtitle,
  children,
  footer,
  error,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-10 -z-10
                   bg-[radial-gradient(circle_at_center,rgba(179,55,63,0.14),transparent_60%)]"
        aria-hidden="true"
      />

      <div
        className="relative overflow-hidden rounded-2xl surface-card-elevated
                   shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)]
                   backdrop-blur-md animate-fade-up"
      >
        <div
          className="h-[3px] w-full bg-linear-to-r from-accent via-accent-hover to-gold"
          aria-hidden="true"
        />

        <div className="px-6 sm:px-10 py-10 sm:py-12">
          <header className="mb-8 text-center">
            <p className="eyebrow text-accent mb-2">{eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-text-secondary text-sm mt-3 leading-relaxed">
                {subtitle}
              </p>
            )}
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 px-4 py-3 rounded-xl
                         bg-accent-muted/40 border border-accent/40
                         text-accent text-sm flex items-start gap-2"
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

          {children}

          {footer && (
            <div className="mt-8 pt-6 border-t border-border text-center">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;