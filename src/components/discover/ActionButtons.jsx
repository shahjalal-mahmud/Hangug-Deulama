/* src/components/discover/ActionButtons.jsx
   Primary swipe controls beneath the card stack. Like is the clear
   visual anchor (largest, gradient-filled); Pass, Watched, and Save
   are secondary, equal-weight actions flanking it — mirrors the
   card's own gesture vocabulary so keyboard/click users get the
   same three-way choice as a swipe, plus bookmark as a bonus.

   @see docs/components/discover/SwipeDeck.jsx */

const ActionButtons = ({
  onDislike,
  onWatched,
  onLike,
  onBookmark,
  onFavorite,
  isBookmarked,
  isFavorited,
}) => (
  <div className="flex items-center justify-center gap-4 md:gap-5">
    <button
      type="button"
      onClick={onDislike}
      aria-label="Pass"
      className="w-14 h-14 rounded-full bg-white/5 border border-border-strong text-text-secondary
                 flex items-center justify-center transition-all duration-300 hover:bg-danger/10
                 hover:text-danger hover:border-danger/40 active:scale-90
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <span className="material-symbols-outlined text-2xl">close</span>
    </button>

    <button
      type="button"
      onClick={onWatched}
      aria-label="Already watched"
      className="w-12 h-12 rounded-full bg-white/5 border border-border-strong text-text-secondary
                 flex items-center justify-center transition-all duration-300 hover:bg-tertiary/10
                 hover:text-tertiary hover:border-tertiary/40 active:scale-90
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <span className="material-symbols-outlined text-xl">visibility</span>
    </button>

    <button
      type="button"
      onClick={onLike}
      aria-label="Like"
      className="btn-gradient-icon w-18 h-18"
    >
      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
        favorite
      </span>
    </button>

    <button
      type="button"
      onClick={onFavorite}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300
                  active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                  ${isFavorited
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-white/5 border-border-strong text-text-secondary hover:text-accent hover:border-accent/40'}`}
    >
      <span
        className="material-symbols-outlined text-xl"
        style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
      >
        star
      </span>
    </button>

    <button
      type="button"
      onClick={onBookmark}
      aria-label={isBookmarked ? 'Remove from saved' : 'Save for later'}
      aria-pressed={isBookmarked}
      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300
                  active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                  ${isBookmarked
                    ? 'bg-secondary/15 border-secondary/40 text-secondary'
                    : 'bg-white/5 border-border-strong text-text-secondary hover:text-secondary hover:border-secondary/40'}`}
    >
      <span
        className="material-symbols-outlined text-xl"
        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
    </button>
  </div>
);

export default ActionButtons;