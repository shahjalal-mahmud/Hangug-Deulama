/* src/pages/Discover.jsx */
import { useState } from 'react';
import { useDrama } from '../context/DramaContext';
import SwipeCard from '../components/SwipeCard';
import EmptyState from '../components/EmptyState';

const Discover = () => {
  const { dramas, likedDramas, dislikedDramas, watchedDramas, likeDrama, dislikeDrama, watchDrama } = useDrama();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get undecided dramas (not liked, disliked, or watched)
  const getUndecidedDramas = () => {
    return dramas.filter(drama => 
      !likedDramas.includes(drama.id) && 
      !dislikedDramas.includes(drama.id) && 
      !watchedDramas.includes(drama.id)
    );
  };

  const undecidedDramas = getUndecidedDramas();
  const totalDecided = likedDramas.length + dislikedDramas.length + watchedDramas.length;
  const totalDramas = dramas.length;

  const handleLike = (dramaId) => {
    likeDrama(dramaId);
    nextDrama();
  };

  const handleDislike = (dramaId) => {
    dislikeDrama(dramaId);
    nextDrama();
  };

  const handleWatched = (dramaId) => {
    watchDrama(dramaId);
    nextDrama();
  };

  const nextDrama = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (undecidedDramas.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState 
          title="All Done!"
          message="You've reviewed all dramas. Check your recommendations or activity page."
          icon="🎉"
        />
      </div>
    );
  }

  const currentDrama = undecidedDramas[currentIndex] || undecidedDramas[0];

  return (
    <div className="max-w-md mx-auto py-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Discover Dramas</h1>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="text-sm opacity-70">
            {totalDecided} / {totalDramas} Dramas Viewed
          </div>
          <div className="w-32 h-2 bg-base-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(totalDecided / totalDramas) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <SwipeCard 
          drama={currentDrama}
          onLike={handleLike}
          onDislike={handleDislike}
          onWatched={handleWatched}
        />
      </div>
    </div>
  );
};

export default Discover;