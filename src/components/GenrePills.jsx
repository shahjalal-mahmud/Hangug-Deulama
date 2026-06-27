import clsx from 'clsx';

/* Controlled filter — selecting a genre here drives TrendingSection's
   results directly via Home.jsx state. Not decorative. */
const GenrePills = ({ genres, selected, onSelect }) => {
  return (
    <div
      role="tablist"
      aria-label="Filter by genre"
      className="flex overflow-x-auto gap-2 no-scrollbar pb-1 px-5 md:px-16"
    >
      {['All', ...genres].map((genre) => {
        const isActive = selected === genre || (selected === null && genre === 'All');
        return (
          <button
            key={genre}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(genre === 'All' ? null : genre)}
            className={clsx(
              'flex-none px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider',
              'transition-colors duration-300 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-accent/60',
              isActive
                ? 'bg-accent text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
            )}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};

export default GenrePills;