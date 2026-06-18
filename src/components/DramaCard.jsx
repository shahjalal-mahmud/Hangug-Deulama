/* src/components/DramaCard.jsx */
import { Link } from 'react-router-dom';
import GenreBadge from './GenreBadge';

const DramaCard = ({ drama }) => {
  return (
    <div className="drama-card">
      <figure className="relative">
        <img 
          src={drama.poster} 
          alt={drama.title}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute top-2 right-2 badge badge-secondary">
          ⭐ {drama.rating}
        </div>
      </figure>
      <div className="card-body">
        <h3 className="card-title text-lg">{drama.title}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {drama.genre.slice(0, 2).map((g, idx) => (
            <GenreBadge key={idx} genre={g} />
          ))}
          {drama.genre.length > 2 && (
            <span className="text-xs opacity-50">+{drama.genre.length - 2}</span>
          )}
        </div>
        <p className="text-sm opacity-70 mt-1">{drama.year}</p>
        <div className="card-actions justify-end mt-2">
          <Link to={`/drama/${drama.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;