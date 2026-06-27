import { useState } from 'react';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import GenreBadge from '../ui/GenreBadge';
import { parseGenres } from '../../utils/dramaHelpers';

const SwipeCard = ({ drama, onLike, onDislike, onWatched }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const genres = parseGenres(drama.genre);

  const handleLike = () => {
    setSwipeDirection('like');
    setTimeout(() => {
      onLike(drama.drama_id);
      setSwipeDirection(null);
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection('dislike');
    setTimeout(() => {
      onDislike(drama.drama_id);
      setSwipeDirection(null);
    }, 300);
  };

  return (
    <div className="surface-card rounded-2xl overflow-hidden max-w-md mx-auto w-full">
      <div className="relative aspect-2/3">
        <ImageWithSkeleton
          src={drama.banner_url || drama.poster}
          alt={drama.title}
          className="w-full h-full"
        />

        {drama.imdb_rating && (
          <span className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-text-primary text-xs font-medium px-2.5 py-1 rounded-md">
            ★ {drama.imdb_rating}
          </span>
        )}

        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300
            ${swipeDirection ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            ${swipeDirection === 'like' ? 'bg-emerald-600/40' : 'bg-rose-700/40'}`}
        >
          <span className="material-symbols-outlined text-white text-6xl">
            {swipeDirection === 'like' ? 'favorite' : 'close'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="font-display text-2xl font-semibold text-text-primary">{drama.title}</h2>
        <p className="text-text-tertiary text-xs mt-1">{drama.release_year}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {genres.map((g) => (
            <GenreBadge key={g} genre={g} />
          ))}
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mt-4 line-clamp-3">
          {drama.storyline}
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleDislike}
            aria-label="Not interested"
            className="w-14 h-14 rounded-full border border-border-strong text-text-secondary
                       hover:text-rose-400 hover:border-rose-400/50 transition-colors duration-300
                       flex items-center justify-center focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <button
            type="button"
            onClick={() => onWatched(drama.drama_id)}
            aria-label="Mark as watched"
            className="w-12 h-12 rounded-full bg-white/5 text-text-secondary
                       hover:text-text-primary hover:bg-white/10 transition-colors duration-300
                       flex items-center justify-center focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span className="material-symbols-outlined text-xl">visibility</span>
          </button>

          <button
            type="button"
            onClick={handleLike}
            aria-label="Like this drama"
            className="w-14 h-14 rounded-full bg-accent text-white
                       hover:bg-accent-hover transition-colors duration-300
                       flex items-center justify-center focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span className="material-symbols-outlined text-2xl">favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;