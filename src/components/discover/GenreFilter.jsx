import clsx from 'clsx';

const GenreFilter = ({ genres, selected, onSelect }) => (
  <div
    className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1"
    role="listbox"
    aria-label="Filter by genre"
  >
    {['All', ...genres].map((g) => (
      <button
        key={g}
        type="button"
        role="option"
        aria-selected={selected === g}
        onClick={() => onSelect(g)}
        className={clsx(
          'flex-none px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
          selected === g
            ? 'border-accent text-accent bg-accent/10'
            : 'border-border-strong text-text-secondary hover:text-text-primary hover:border-text-tertiary'
        )}
      >
        {g}
      </button>
    ))}
  </div>
);

export default GenreFilter;