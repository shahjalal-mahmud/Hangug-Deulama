/* src/components/discover/DiscoverFilters.jsx
   Search + genre chip row that actually drives the swipe queue.
   Sits between the hero and the card stack; sticky on scroll so
   filters stay reachable without pushing the deck off-screen.

   @see docs/components/discover/SwipeDeck.jsx
   @see docs/utils/dramaHelpers.js (filterByGenre, filterBySearch) */

import { useState } from 'react';

const DiscoverFilters = ({
  genres,
  activeGenre,
  onGenreChange,
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  // NOTE: searchOpen is local state because whether the search bar is
  // expanded doesn't need to be coordinated with anything else — it's
  // purely a UI toggle. The actual search value stays in the parent
  // (Discover.jsx) so it can survive route navigations or unmounting
  // of this component.
  const [searchOpen, setSearchOpen] = useState(false);
  const chips = ['All', ...genres];

  return (
    <div className="sticky top-16 z-20 -mx-5 md:-mx-16 px-5 md:px-16 py-3 mb-6
                     bg-background/85 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chips.map((genre) => {
            const isActive = genre === activeGenre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => onGenreChange(genre)}
                aria-pressed={isActive}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide
                            transition-all duration-300 focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-accent/60
                            ${isActive
                              ? 'bg-accent text-on-primary shadow-md shadow-black/20'
                              : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'}`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        <div className="flex items-center shrink-0">
          <div
            className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-cinematic
                        ${searchOpen ? 'w-44 md:w-56 border-border-strong bg-white/5' : 'w-9 border-transparent bg-transparent'}`}
          >
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? 'Close search' : 'Search dramas'}
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-text-secondary
                         hover:text-text-primary transition-colors duration-300 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <span className="material-symbols-outlined text-lg">
                {searchOpen ? 'close' : 'search'}
              </span>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search title, cast, genre…"
              autoFocus={searchOpen}
              className={`bg-transparent text-sm text-text-primary placeholder:text-text-tertiary
                          outline-none pr-3 transition-opacity duration-200
                          ${searchOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
            />
          </div>
        </div>
      </div>

      {(activeGenre !== 'All' || searchQuery.trim()) && (
        <p className="text-text-tertiary text-[11px] mt-2 uppercase tracking-widest">
          {resultCount} {resultCount === 1 ? 'match' : 'matches'}
        </p>
      )}
    </div>
  );
};

export default DiscoverFilters;