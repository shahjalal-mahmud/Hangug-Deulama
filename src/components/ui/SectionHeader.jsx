import { Link } from 'react-router-dom';

const SectionHeader = ({ id, title, subtitle, actionLabel, actionTo }) => {
  return (
    <div className="flex items-end justify-between mb-5 md:mb-6">
      <div>
        {subtitle && (
          <p className="text-text-tertiary text-xs font-medium uppercase tracking-widest mb-1">
            {subtitle}
          </p>
        )}
        <h2 id={id} className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
          {title}
        </h2>
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