import RecommendationBadge from '../discover/RecommendationBadge';

const RecommendationReason = ({ score, reasonText }) => (
  <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-3 text-accent">
      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        auto_awesome
      </span>
      <h3 className="text-xs font-semibold uppercase tracking-widest">Why This Pick</h3>
    </div>

    <RecommendationBadge score={score} className="!relative !top-0 !left-0 mb-3 inline-flex" />

    <p className="text-text-secondary text-sm leading-relaxed">{reasonText}</p>
  </div>
);

export default RecommendationReason;