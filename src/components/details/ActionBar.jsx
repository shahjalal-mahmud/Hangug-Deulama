import { useState } from 'react';

const ActionBar = ({ status, onLike, onDislike, onWatched, onBookmark, onShare }) => {
  const [justShared, setJustShared] = useState(false);

  const handleShare = async () => {
    const result = await onShare();
    if (result === 'copied') {
      setJustShared(true);
      window.setTimeout(() => setJustShared(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={onLike}
        aria-pressed={status.isLiked}
        className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium
          uppercase tracking-wide transition-all duration-300 active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          ${status.isLiked ? 'bg-accent text-white' : 'bg-white/10 text-text-primary hover:bg-white/15'}`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: status.isLiked ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </span>
        {status.isLiked ? 'Liked' : 'Like'}
      </button>

      <button
        type="button"
        onClick={onDislike}
        aria-pressed={status.isDisliked}
        aria-label="Not interested"
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          ${status.isDisliked ? 'bg-white/20 text-text-primary' : 'bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/15'}`}
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>

      <button
        type="button"
        onClick={onWatched}
        aria-pressed={status.isWatched}
        aria-label="Mark as watched"
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          ${status.isWatched ? 'bg-white/20 text-text-primary' : 'bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/15'}`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: status.isWatched ? "'FILL' 1" : "'FILL' 0" }}>
          visibility
        </span>
      </button>

      <button
        type="button"
        onClick={onBookmark}
        aria-pressed={status.isBookmarked}
        aria-label={status.isBookmarked ? 'Remove from saved' : 'Save for later'}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
          ${status.isBookmarked ? 'bg-white/20 text-text-primary' : 'bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/15'}`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: status.isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>
          bookmark
        </span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this drama"
        className="w-12 h-12 rounded-full bg-white/10 text-text-secondary hover:text-text-primary
                   hover:bg-white/15 flex items-center justify-center transition-all duration-300
                   active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 relative"
      >
        <span className="material-symbols-outlined text-lg">{justShared ? 'check' : 'ios_share'}</span>
        {justShared && (
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-text-secondary bg-surface px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
};

export default ActionBar;