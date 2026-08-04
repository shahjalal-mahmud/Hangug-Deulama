/* src/pages/Discover.jsx
   The /discover route. Hosts the swipe-deck flow — given the master
   catalog, computes "undecided" dramas (not liked / disliked / watched)
   and sorts them by match-score so the cards the user sees first are
   the ones most likely to score well.

   @see docs/ARCHITECTURE.md#sec-drama-context
   @see docs/PROJECT.md#sec-proj-fr-swipe-system */
import { useMemo } from 'react';
import { useDrama } from '../context/DramaContext';
import { sortDramas, getLikedGenres } from '../utils/dramaHelpers';
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
    favoriteDramas,
    likeDrama,
    dislikeDrama,
    watchDrama,
    toggleBookmark,
    toggleFavorite,
  } = useDrama();

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  // NOTE: we explicitly filter out the three "decided" sets before
  // sorting. If we left them in, the deck would show the same liked
  // drama on every refresh — the user would feel stuck.
  const queue = useMemo(() => {
    const undecided = dramas.filter(
      (d) =>
        !likedDramas.includes(d.drama_id) &&
        !dislikedDramas.includes(d.drama_id) &&
        !watchedDramas.includes(d.drama_id)
    );
    return sortDramas(undecided, 'match', likedGenres);
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
        onFavorite={toggleFavorite}
        bookmarkedDramas={bookmarkedDramas}
        favoriteDramas={favoriteDramas}
      />
    </div>
  );
};

export default Discover;