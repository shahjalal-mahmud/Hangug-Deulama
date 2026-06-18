/* src/components/SwipeCard.jsx */
import { useState } from 'react';
import GenreBadge from './GenreBadge';

const SwipeCard = ({ drama, onLike, onDislike, onWatched }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const genres = drama.genre.split(',').map(g => g.trim());

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

  const handleWatched = () => {
    onWatched(drama.drama_id);
  };

  return (
    <div className="swipe-card">
      <figure className="relative">
        <img 
          src={drama.banner_url || drama.poster} 
          alt={drama.title}
          className="w-full aspect-2/3 object-cover"
        />
        <div className="absolute top-2 right-2 badge badge-secondary">
          ⭐ {drama.imdb_rating || 'N/A'}
        </div>
        {swipeDirection === 'like' && (
          <div className="absolute inset-0 bg-success/50 flex items-center justify-center">
            <span className="text-6xl text-white font-bold">❤️</span>
          </div>
        )}
        {swipeDirection === 'dislike' && (
          <div className="absolute inset-0 bg-error/50 flex items-center justify-center">
            <span className="text-6xl text-white font-bold">✖️</span>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{drama.title}</h2>
        <div className="flex flex-wrap gap-1 mt-1">
          {genres.map((g, idx) => (
            <GenreBadge key={idx} genre={g} />
          ))}
        </div>
        <p className="text-sm opacity-70">{drama.release_year}</p>
        <p className="text-xs opacity-50">⭐ {drama.stars}</p>
        <p className="mt-2 text-sm line-clamp-3">{drama.storyline}</p>
        <div className="card-actions justify-center mt-4 gap-2">
          <button 
            className="btn btn-error btn-circle btn-lg"
            onClick={handleDislike}
          >
            ✖
          </button>
          <button 
            className="btn btn-success btn-circle btn-lg"
            onClick={handleLike}
          >
            ❤
          </button>
          <button 
            className="btn btn-info btn-circle btn-lg"
            onClick={handleWatched}
          >
            👁
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;