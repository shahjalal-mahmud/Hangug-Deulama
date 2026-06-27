import { memo } from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

const LandscapeDramaCard = ({ drama }) => {
  return (
    <Link
      to={`/drama/${drama.drama_id}`}
      className="group relative aspect-video rounded-xl overflow-hidden surface-card
                 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      aria-label={`Continue watching ${drama.title}, ${drama.progress}% complete`}
    >
      <ImageWithSkeleton
        src={drama.banner_url || drama.poster}
        alt={drama.title}
        className="w-full h-full"
        imgClassName="transition-transform duration-700 ease-cinematic group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-4">
        <h3 className="font-display text-base font-semibold text-text-primary leading-tight">
          {drama.title}
        </h3>
        <div className="w-full h-1 bg-white/15 mt-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 ease-cinematic"
            style={{ width: `${drama.progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default memo(LandscapeDramaCard);