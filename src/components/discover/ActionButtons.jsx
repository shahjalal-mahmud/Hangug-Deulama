const ActionButtons = ({ onDislike, onWatched, onLike, onBookmark, isBookmarked }) => (
  <div className="flex items-center justify-center gap-4">
    <button
      type="button"
      onClick={onDislike}
      aria-label="Pass on this drama"
      className="w-16 h-16 rounded-full border border-border-strong text-text-secondary
                 hover:text-accent hover:border-accent/50 transition-all duration-300
                 flex items-center justify-center focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-accent/60 active:scale-90"
    >
      <span className="material-symbols-outlined text-2xl">close</span>
    </button>

    <button
      type="button"
      onClick={onBookmark}
      aria-label={isBookmarked ? 'Remove from saved' : 'Save for later'}
      aria-pressed={isBookmarked}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
        active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        ${isBookmarked ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'}`}
    >
      <span
        className="material-symbols-outlined text-xl"
        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
    </button>

    <button
      type="button"
      onClick={onWatched}
      aria-label="Mark as watched"
      className="w-12 h-12 rounded-full bg-white/5 text-text-secondary hover:text-text-primary
                 hover:bg-white/10 transition-all duration-300 flex items-center justify-center
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:scale-90"
    >
      <span className="material-symbols-outlined text-xl">visibility</span>
    </button>

    <button
      type="button"
      onClick={onLike}
      aria-label="Like this drama"
      className="w-16 h-16 rounded-full bg-accent text-white hover:bg-accent-hover
                 transition-all duration-300 flex items-center justify-center
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                 active:scale-90 shadow-lg shadow-accent/30"
    >
      <span className="material-symbols-outlined text-2xl">favorite</span>
    </button>
  </div>
);

export default ActionButtons;