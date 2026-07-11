const SwipeProgress = ({ decided, total, remaining }) => {
  const percent = total ? Math.round((decided / total) * 100) : 0;

  return (
    <div className="w-full max-w-sm">
      <div
        className="flex items-center gap-3"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="text-text-secondary text-xs font-medium shrink-0">
          {percent}% explored
        </span>
        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500 ease-cinematic rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-text-tertiary text-xs shrink-0">{remaining} left</span>
      </div>
    </div>
  );
};

export default SwipeProgress;