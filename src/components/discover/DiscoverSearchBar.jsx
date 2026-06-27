const DiscoverSearchBar = ({ value, onChange }) => (
  <div className="relative w-full max-w-md mx-auto">
    <span
      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg"
      aria-hidden="true"
    >
      search
    </span>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search title, genre, or cast..."
      aria-label="Search dramas"
      className="w-full bg-surface border border-border rounded-full pl-11 pr-4 py-3
                 text-sm text-text-primary placeholder:text-text-tertiary
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20
                 transition-colors duration-300"
    />
  </div>
);

export default DiscoverSearchBar;