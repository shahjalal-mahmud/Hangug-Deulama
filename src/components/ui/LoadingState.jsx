const LoadingState = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3" role="status" aria-live="polite">
    <span className="loading loading-spinner loading-md text-accent" />
    <p className="text-text-tertiary text-xs uppercase tracking-widest">{label}</p>
  </div>
);

export default LoadingState;