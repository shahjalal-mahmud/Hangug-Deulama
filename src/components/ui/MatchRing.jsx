/* src/components/ui/MatchRing.jsx */
/* Small circular progress indicator used to surface match scores without
   leaning on a flat "73% MATCH" pill — reads as a quality signal rather
   than a UI badge. */
const MatchRing = ({ value = 0, size = 36, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative flex-none" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-cinematic"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] font-bold text-text-primary">
        {value}%
      </span>
    </div>
  );
};

export default MatchRing;