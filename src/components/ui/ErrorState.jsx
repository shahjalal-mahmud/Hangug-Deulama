const ErrorState = ({
  title = 'Something went wrong',
  description = 'We hit a snag loading dramas. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <span className="material-symbols-outlined text-4xl text-accent mb-3" aria-hidden="true">
      error
    </span>
    <h3 className="font-display text-lg text-text-primary mb-1">{title}</h3>
    <p className="text-text-secondary text-sm max-w-sm mb-5">{description}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-full bg-accent text-white text-xs font-medium uppercase
                   tracking-wide hover:bg-accent-hover transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;