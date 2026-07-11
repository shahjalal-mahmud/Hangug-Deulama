/* src/pages/Discover.jsx */
import { useMemo } from 'react';
import { useDrama } from '../context/DramaContext';
import {
  filterByGenre,
  filterBySearch,
  sortDramas,
  getLikedGenres,
} from '../utils/dramaHelpers';
import DiscoverHero from '../components/discover/DiscoverHero';
import LoadingState from '../components/ui/LoadingState';
import SwipeDeck from '../components/discover/SwipeDeck';

const Discover = () => {
  const {
    dramas,
    loading,
    likedDramas,
    dislikedDramas,
    watchedDramas,
    bookmarkedDramas,
    likeDrama,
    dislikeDrama,
    watchDrama,
    toggleBookmark,
  } = useDrama();

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  const queue = useMemo(() => {
    let list = dramas.filter(
      (d) =>
        !likedDramas.includes(d.drama_id) &&
        !dislikedDramas.includes(d.drama_id) &&
        !watchedDramas.includes(d.drama_id)
    );

    list = filterByGenre(list);
    list = filterBySearch(list);
    return sortDramas(list, likedGenres);
  }, [dramas, likedDramas, dislikedDramas, watchedDramas, likedGenres]);

  const totalDecided = likedDramas.length + dislikedDramas.length + watchedDramas.length;

  if (loading) {
    return <LoadingState label="Curating dramas for you" />;
  }

  return (
    <div className="px-5 md:px-16 max-w-6xl mx-auto">
      <DiscoverHero />

      <SwipeDeck
        queue={queue}
        likedGenres={likedGenres}
        totalDecided={totalDecided}
        totalDramas={dramas.length}
        onLike={likeDrama}
        onDislike={dislikeDrama}
        onWatched={watchDrama}
        onBookmark={toggleBookmark}
        bookmarkedDramas={bookmarkedDramas}
      />
    </div>
  );
};

export default Discover;