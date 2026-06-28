/* src/components/ui/SectionHeader.jsx */
import { Link } from 'react-router-dom';

const SectionHeader = ({ id, eyebrow, title, subtitle, actionLabel, actionTo }) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
      <div>
        {eyebrow && <p className="eyebrow text-text-tertiary mb-2">{eyebrow}</p>}
        <h2 id={id} className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
          {title}
        </h2>
        {subtitle && <p className="text-text-secondary text-sm mt-1.5">{subtitle}</p>}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="text-accent text-xs font-medium uppercase tracking-wider
                     hover:underline shrink-0 ml-4 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-accent/60 rounded"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;