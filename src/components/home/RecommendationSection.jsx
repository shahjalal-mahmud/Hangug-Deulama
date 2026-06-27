import { Link } from 'react-router-dom';
import SectionHeader from '../SectionHeader';
import GenreBadge from '../GenreBadge';
import ImageWithSkeleton from '../ImageWithSkeleton';
import EmptyState from '../EmptyState';
import { parseGenres } from '../../utils/dramaHelpers';

const PickCard = ({ drama }) => {
  const genres = parseGenres(drama.genre);

  return (
    <Link
      to={`/drama/${drama.drama_id}`}
      className="flex gap-4 surface-card rounded-xl p-3 hover:bg-surface-elevated
                 transition-colors duration-300 group focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <ImageWithSkeleton
        src={drama.poster || drama.banner_url}
        alt={drama.title}
        className="w-28 md:w-32 aspect-2/3 flex-none rounded-lg"
        imgClassName="transition-transform duration-500 ease-cinematic group-hover:scale-105"
      />
      <div className="flex flex-col justify-center py-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-accent-muted text-text-primary px-2 py-0.5 rounded text-[10px] font-medium">
            {drama.matchScore}% MATCH
          </span>
          <span className="text-text-tertiary text-[11px]">• {drama.release_year}</span>
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {drama.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2 mt-1">{drama.stars}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {genres.slice(0, 2).map((g) => (
            <GenreBadge key={g} genre={g} />
          ))}
        </div>
      </div>
    </Link>
  );
};

const RecommendationSection = ({ items, subtitle }) => {
  if (items.length === 0) {
    return (
      <section className="px-5 md:px-16 mb-14">
        <SectionHeader title="Personalized Picks" subtitle={subtitle} />
        <EmptyState
          icon="favorite"
          title="Like a few dramas to unlock picks"
          description="Your recommendations get sharper the more you rate."
        />
      </section>
    );
  }

  return (
    <section className="px-5 md:px-16 mb-14" aria-labelledby="picks-heading">
      <SectionHeader id="picks-heading" title="Personalized Picks" subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((drama) => (
          <PickCard key={drama.drama_id} drama={drama} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;