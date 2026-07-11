/* src/pages/Discover.jsx */
import { useMemo, useState } from 'react';
import { useDrama } from '../context/DramaContext';
import {
  filterByGenre,
  filterBySearch,
  sortDramas,
  getLikedGenres,
  getUniqueGenres,
} from '../utils/dramaHelpers';
import DiscoverHero from '../components/discover/DiscoverHero';
import DiscoverFilters from '../components/discover/DiscoverFilters';
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

  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);
  const genreOptions = useMemo(() => getUniqueGenres(dramas), [dramas]);

  const undecided = useMemo(
    () =>
      dramas.filter(
        (d) =>
          !likedDramas.includes(d.drama_id) &&
          !dislikedDramas.includes(d.drama_id) &&
          !watchedDramas.includes(d.drama_id)
      ),
    [dramas, likedDramas, dislikedDramas, watchedDramas]
  );

  const queue = useMemo(() => {
    let list = filterByGenre(undecided, activeGenre);
    list = filterBySearch(list, searchQuery);
    return sortDramas(list, 'match', likedGenres);
  }, [undecided, activeGenre, searchQuery, likedGenres]);

  const isFiltered = activeGenre !== 'All' || searchQuery.trim().length > 0;
  const totalDecided = likedDramas.length + dislikedDramas.length + watchedDramas.length;

  if (loading) {
    return <LoadingState label="Curating dramas for you" />;
  }

  return (
    <div className="px-5 md:px-16 max-w-6xl mx-auto">
      <DiscoverHero />

      <DiscoverFilters
        genres={genreOptions}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={queue.length}
      />

      <SwipeDeck
        queue={queue}
        likedGenres={likedGenres}
        totalDecided={totalDecided}
        totalDramas={dramas.length}
        isFiltered={isFiltered}
        onClearFilters={() => {
          setActiveGenre('All');
          setSearchQuery('');
        }}
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