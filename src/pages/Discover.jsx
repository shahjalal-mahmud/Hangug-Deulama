import { useMemo, useState } from 'react';
import { useDrama } from '../context/DramaContext';
import {
  getUniqueGenres,
  filterByGenre,
  filterBySearch,
  sortDramas,
  getLikedGenres,
} from '../utils/dramaHelpers';
import DiscoverHero from '../components/discover/DiscoverHero';
import DiscoverSearchBar from '../components/discover/DiscoverSearchBar';
import CategoryTabs from '../components/discover/CategoryTabs';
import GenreFilter from '../components/discover/GenreFilter';
import SortDropdown from '../components/discover/SortDropdown';
import SwipeDeck from '../components/discover/SwipeDeck';
import LoadingState from '../components/ui/LoadingState';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New Releases' },
  { id: 'top', label: 'Top Rated' },
];

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

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  const genres = useMemo(() => getUniqueGenres(dramas), [dramas]);
  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  const queue = useMemo(() => {
    let list = dramas.filter(
      (d) =>
        !likedDramas.includes(d.drama_id) &&
        !dislikedDramas.includes(d.drama_id) &&
        !watchedDramas.includes(d.drama_id)
    );

    list = filterByGenre(list, genre);
    list = filterBySearch(list, search);

    if (category === 'new') list = list.filter((d) => Number(d.release_year) >= 2024);
    if (category === 'top') list = list.filter((d) => (d.imdb_rating || 0) >= 8);
    if (category === 'trending') {
      list = [...list].sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0));
    }

    return sortDramas(list, sortBy, likedGenres);
  }, [dramas, likedDramas, dislikedDramas, watchedDramas, genre, search, category, sortBy, likedGenres]);

  const totalDecided = likedDramas.length + dislikedDramas.length + watchedDramas.length;

  if (loading) {
    return <LoadingState label="Curating dramas for you" />;
  }

  return (
    <div className="px-5 md:px-16 max-w-6xl mx-auto">
      <DiscoverHero />

      <div className="flex flex-col gap-4 mb-10">
        <DiscoverSearchBar value={search} onChange={setSearch} />
        <CategoryTabs categories={CATEGORIES} active={category} onSelect={setCategory} />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <GenreFilter genres={genres} selected={genre} onSelect={setGenre} />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

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