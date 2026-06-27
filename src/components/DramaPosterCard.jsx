import { memo } from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';
import { parseGenres } from '../utils/dramaHelpers';

const DramaPosterCard = ({ drama }) => {
  const genres = parseGenres(drama.genre);

  return (
    <Link
      to={`/drama/${drama.drama_id}`}
      className="group flex-none w-40 sm:w-48 md:w-56 block focus-visible:outline-none"
      aria-label={`View details for ${drama.title}`}
    >
      <div className="relative aspect-2/3 rounded-xl overflow-hidden surface-card">
        <ImageWithSkeleton
          src={drama.poster || drama.banner_url}
          alt={drama.title}
          className="w-full h-full"
          imgClassName="transition-transform duration-700 ease-cinematic group-hover:scale-105"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface via-surface/40 to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-cinematic"
        />
        <div
          className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0
                     group-hover:translate-y-0 group-hover:opacity-100
                     transition-all duration-400 ease-cinematic"
        >
          <h4 className="font-display text-sm font-semibold text-text-primary leading-tight line-clamp-1">
            {drama.title}
          </h4>
          <p className="text-text-secondary text-[11px] uppercase tracking-wider mt-1 line-clamp-1">
            {genres.slice(0, 2).join(' · ')}
          </p>
        </div>

        {drama.imdb_rating && (
          <span className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm text-text-primary text-[10px] font-medium px-2 py-1 rounded-md">
            ★ {drama.imdb_rating}
          </span>
        )}
      </div>
    </Link>
  );
};

export default memo(DramaPosterCard);