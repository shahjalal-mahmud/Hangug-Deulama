import clsx from 'clsx';

const CategoryTabs = ({ categories, active, onSelect }) => (
  <div className="flex items-center justify-center gap-2 flex-wrap" role="tablist" aria-label="Filter categories">
    {categories.map((cat) => (
      <button
        key={cat.id}
        type="button"
        role="tab"
        aria-selected={active === cat.id}
        onClick={() => onSelect(cat.id)}
        className={clsx(
          'px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
          active === cat.id
            ? 'bg-accent text-white'
            : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
        )}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

export default CategoryTabs;