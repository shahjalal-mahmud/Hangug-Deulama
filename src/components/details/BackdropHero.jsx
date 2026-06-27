import { useNavigate } from 'react-router-dom';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import GenreBadge from '../ui/GenreBadge';
import ActionBar from './ActionBar';
import { parseGenres } from '../../utils/dramaHelpers';

const BackdropHero = ({ drama, status, onLike, onDislike, onWatched, onBookmark, onShare }) => {
  const navigate = useNavigate();
  const genres = parseGenres(drama.genre);
  const isUpcoming = !drama.imdb_rating || drama.imdb_rating === 0;

  return (
    <section className="relative h-[55vh] md:h-[68vh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithSkeleton src={drama.banner_url} alt="" className="w-full h-full" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />
      </div>

      <button
        type="button"
        onClick={() => navigate('/discover')}
        aria-label="Back to Discover"
        className="absolute top-24 md:top-28 left-5 md:left-16 z-10 w-10 h-10 rounded-full
                   bg-background/60 backdrop-blur-sm border border-border-strong
                   flex items-center justify-center text-text-primary hover:bg-background/80
                   transition-colors duration-300 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
      </button>

      <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-16 pb-8 md:pb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {isUpcoming ? (
            <span className="bg-white/10 text-text-secondary px-3 py-1 text-[11px] font-medium uppercase tracking-widest rounded-full">
              Upcoming
            </span>
          ) : (
            <span className="text-text-secondary text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              {drama.imdb_rating} / 10
            </span>
          )}
          <span className="text-text-tertiary text-xs">{drama.release_year}</span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-semibold text-text-primary leading-[1.05] mb-4 max-w-2xl">
          {drama.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
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
    </section>
  );
};

export default BackdropHero;