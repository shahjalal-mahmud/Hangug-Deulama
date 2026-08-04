/* src/components/profile/StatCard.jsx
   A single glanceable metric. `accentClass` carries a text+bg color pair
   (e.g. "text-primary bg-primary/10") so the icon token colors are static
   Tailwind classes at each call site rather than built dynamically.

   @see docs/pages/Profile.jsx */

const StatCard = ({ icon, label, value, accentClass, hint }) => (
  <div className="surface-card-elevated rounded-2xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-none ${accentClass}`}>
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="eyebrow text-[11px] mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-text-primary leading-none">
        {value}
      </p>
      {hint && <p className="text-xs text-text-tertiary mt-1.5">{hint}</p>}
    </div>
  </div>
);

export default StatCard;