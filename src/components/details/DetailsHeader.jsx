/* src/components/details/DetailsHeader.jsx
   Right-column header: back link, rating/year, title, genres, and the
   action bar. Replaces the text-over-image treatment from the old
   BackdropHero now that the poster lives in its own column.

   @see docs/components/details/PosterPanel.jsx
   @see docs/pages/DramaDetails.jsx */

import { useNavigate } from 'react-router-dom';
import GenreBadge from '../ui/GenreBadge';
import ActionBar from './ActionBar';
import { parseGenres } from '../../utils/dramaHelpers';

const DetailsHeader = ({ drama, status, onLike, onDislike, onWatched, onBookmark, onShare }) => {
  const navigate = useNavigate();
  const genres = parseGenres(drama);
  const isUpcoming = !drama.imdb_rating || drama.imdb_rating === 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/discover')}
        className="inline-flex items-center gap-1.5 text-text-tertiary hover:text-text-primary
                   text-xs font-medium uppercase tracking-widest mb-6 transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Discover
      </button>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {isUpcoming ? (
          <span className="bg-white/10 text-text-secondary px-3 py-1 text-[11px] font-medium uppercase tracking-widest rounded-full">
            Upcoming
          </span>
        ) : (
          <span className="flex items-center gap-1 text-secondary text-sm font-semibold">
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            {drama.imdb_rating}
            <span className="text-text-tertiary font-normal">/10</span>
          </span>
        )}
        <span className="text-text-tertiary text-sm">{drama.release_year}</span>
      </div>

      <h1 className="font-display text-3xl md:text-[2.75rem] font-semibold text-text-primary leading-[1.08] mb-4">
        {drama.title}
      </h1>

      <div className="flex flex-wrap gap-2 mb-7">
        {genres.map((g) => (
          <GenreBadge key={g} genre={g} />
        ))}
      </div>

      <ActionBar
        status={status}
        onLike={onLike}
        onDislike={onDislike}
        onWatched={onWatched}
        onBookmark={onBookmark}
        onShare={onShare}
      />
    </div>
  );
};

export default DetailsHeader;