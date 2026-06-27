const SwipeProgress = ({ decided, total }) => {
  const percent = total ? Math.round((decided / total) * 100) : 0;

  return (
    <div
      className="w-full max-w-sm flex items-center gap-3"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="text-text-tertiary text-xs uppercase tracking-widest shrink-0">
        {decided} / {total}
      </span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-cinematic"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default SwipeProgress;