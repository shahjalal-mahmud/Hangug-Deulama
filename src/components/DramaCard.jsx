/* src/components/DramaCard.jsx */
import { Link } from 'react-router-dom';
import GenreBadge from './GenreBadge';

const DramaCard = ({ drama }) => {
  // Split genres for display
  const genres = drama.genre.split(',').map(g => g.trim());
  
  return (
    <div className="drama-card">
      <figure className="relative">
        <img 
          src={drama.banner_url || drama.poster} 
          alt={drama.title}
          className="w-full aspect-2/3 object-cover"
        />
        <div className="absolute top-2 right-2 badge badge-secondary">
          ⭐ {drama.imdb_rating || 'N/A'}
        </div>
      </figure>
      <div className="card-body">
        <h3 className="card-title text-lg">{drama.title}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {genres.slice(0, 2).map((g, idx) => (
            <GenreBadge key={idx} genre={g} />
          ))}
          {genres.length > 2 && (
            <span className="text-xs opacity-50">+{genres.length - 2}</span>
          )}
        </div>
        <p className="text-sm opacity-70 mt-1">{drama.release_year}</p>
        <p className="text-xs opacity-50 line-clamp-1">⭐ {drama.stars}</p>
        <div className="card-actions justify-end mt-2">
          <Link to={`/drama/${drama.drama_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;