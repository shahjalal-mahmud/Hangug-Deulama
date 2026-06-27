const RecommendationBadge = ({ score, className = '' }) => {
  if (!score) return null;

  const tier = score >= 90 ? 'Top Match' : score >= 75 ? 'Great Match' : 'Good Match';

  return (
    <span
      className={`bg-background/70 backdrop-blur-sm text-accent text-[11px] font-semibold
                  uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 ${className}`}
    >
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        auto_awesome
      </span>
      {score}% · {tier}
    </span>
  );
};

export default RecommendationBadge;