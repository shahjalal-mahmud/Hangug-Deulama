const options = [
  { value: 'match', label: 'Best Match' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'A–Z' },
];

const SortDropdown = ({ value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort dramas"
      className="bg-surface border border-border rounded-full pl-4 pr-9 py-2
                 text-xs font-medium uppercase tracking-wide text-text-secondary
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20
                 transition-colors duration-300 appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-surface text-text-primary">
          {o.label}
        </option>
      ))}
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-base pointer-events-none">
      expand_more
    </span>
  </div>
);

export default SortDropdown;