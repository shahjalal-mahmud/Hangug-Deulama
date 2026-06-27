import { memo } from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import GenreBadge from '../ui/GenreBadge';
import { parseGenres } from '../../utils/dramaHelpers';

const DramaCard = ({ drama }) => {
  const genres = parseGenres(drama.genre);

  return (
    <Link
      to={`/drama/${drama.drama_id}`}
      className="group flex flex-col surface-card rounded-xl overflow-hidden
                 hover:bg-surface-elevated transition-colors duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      aria-label={`View details for ${drama.title}`}
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <ImageWithSkeleton
          src={drama.poster || drama.banner_url}
          alt={drama.title}
          className="w-full h-full"
          imgClassName="transition-transform duration-700 ease-cinematic group-hover:scale-105"
        />
        {drama.imdb_rating && (
          <span className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm text-text-primary text-[10px] font-medium px-2 py-1 rounded-md">
            ★ {drama.imdb_rating}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
          {drama.title}
        </h3>
        <p className="text-text-tertiary text-xs">{drama.release_year}</p>
        <div className="flex gap-2 flex-wrap">
          {genres.slice(0, 2).map((g) => (
            <GenreBadge key={g} genre={g} />
          ))}
          {genres.length > 2 && (
            <span className="text-text-tertiary text-[10px] self-center">+{genres.length - 2}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default memo(DramaCard);