/* src/pages/Home.jsx */
import { useEffect, useMemo, useState } from 'react';
import { useDrama } from '../context/DramaContext';
import HeroSection from '../components/home/HeroSection';
import GenrePills from '../components/home/GenrePills';
import ContinueWatching from '../components/home/ContinueWatching';
import TrendingSection from '../components/home/TrendingSection';
import RecommendationSection from '../components/home/RecommendationSection';
import GenreRow from '../components/home/GenreRow';
import AllDramaSection from '../components/home/AllDramaSection';
import RevealSection from '../components/ui/RevealSection';
import ErrorState from '../components/ui/ErrorState';
import {
  getUniqueGenres,
  filterByGenre,
  filterByGenreAny,
  getTrending,
  getContinueWatching,
  getRecommendations,
  getLikedGenres,
  getReasonText,
  sortDramas,
} from '../utils/dramaHelpers';

/* Config-driven genre rails. Each entry uses a list of aliases since we
   can't guarantee the exact label casing the backend catalog uses for a
   given category (e.g. "Historical" vs "Period"). Order here is the
   exact serial requested for the page, right after "Top Picks For You". */
const GENRE_SECTIONS = [
  { id: 'romcom', eyebrow: '로맨스 코미디 · ROM-COM', title: 'Rom-Com', keywords: ['Romance', 'Rom-Com', 'Romantic Comedy'] },
  { id: 'historical', eyebrow: '사극 · HISTORICAL', title: 'Historical', keywords: ['Historical', 'History', 'Period', 'Sageuk'] },
  { id: 'thriller', eyebrow: '스릴러 · THRILLER', title: 'Thriller', keywords: ['Thriller'] },
  { id: 'fantasy', eyebrow: '판타지 · FANTASY', title: 'Fantasy', keywords: ['Fantasy'] },
  { id: 'action', eyebrow: '액션 · ACTION', title: 'Action', keywords: ['Action'] },
  { id: 'horror', eyebrow: '공포 · HORROR', title: 'Horror', keywords: ['Horror'] },
  { id: 'comedy', eyebrow: '코미디 · COMEDY', title: 'Comedy', keywords: ['Comedy'] },
];

const Home = () => {
  const {
    dramas,
    loading,
    error,
    likedDramas,
    dislikedDramas,
    watchedDramas,
  } = useDrama();
  const [selectedGenre, setSelectedGenre] = useState(null);

  // The hero banner is meant to bleed all the way to the top of the
  // viewport so the navbar floats over it. The shared <main> reserves
  // pt-24/pt-28 for every other route, so we zero it out only while this
  // page is mounted and put it back on unmount.
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return undefined;
    const previous = main.style.paddingTop;
    main.style.paddingTop = '0px';
    return () => {
      main.style.paddingTop = previous;
    };
  }, []);

  const genres = useMemo(() => getUniqueGenres(dramas), [dramas]);

  // Spotlight always pulls from the unfiltered top-rated pool, independent
  // of the genre filter below it — the hero stays stable while browsing.
  const spotlightItems = useMemo(() => getTrending(dramas, 10), [dramas]);

  const continueWatchingItems = useMemo(
    () => getContinueWatching(dramas, dislikedDramas, watchedDramas),
    [dramas, dislikedDramas, watchedDramas]
  );

  const trendingItems = useMemo(() => {
    const filtered = filterByGenre(dramas, selectedGenre);
    return getTrending(filtered, 10);
  }, [dramas, selectedGenre]);

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  const likedDramaTitles = useMemo(
    () => dramas.filter((d) => likedDramas.includes(d.drama_id)).map((d) => d.title),
    [dramas, likedDramas]
  );

  // Attach the human-readable "why we picked this" line to each card so
  // the recommendation section can show real personalization, not just a score.
  const recommendationItems = useMemo(() => {
    const recs = getRecommendations(dramas, likedDramas, dislikedDramas, watchedDramas, 4);
    return recs.map((d) => ({
      ...d,
      reason: getReasonText(d, likedGenres, likedDramaTitles),
    }));
  }, [dramas, likedDramas, dislikedDramas, watchedDramas, likedGenres, likedDramaTitles]);

  const recommendationSubtitle = likedDramas.length
    ? "Based on what you've liked"
    : 'Top picks to get you started';

  // One row per genre in GENRE_SECTIONS, each sorted by rating within
  // that genre. Computed together so we don't spread N useMemo calls
  // across a loop.
  const genreSectionsData = useMemo(
    () =>
      GENRE_SECTIONS.map((section) => ({
        ...section,
        items: getTrending(filterByGenreAny(dramas, section.keywords), 12),
      })),
    [dramas]
  );

  // "All Dramas" — newest first, full catalog, paginated client-side.
  const allDramaItems = useMemo(() => sortDramas(dramas, 'newest'), [dramas]);

  if (error && !dramas.length) {
    return (
      <div className="px-5 md:px-16 max-w-3xl mx-auto py-20">
        <ErrorState
          title="The catalog is unreachable"
          description={error.message || 'We could not load dramas. Please check your connection.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      <HeroSection items={spotlightItems} loading={loading} />

      <div className="mb-12">
        <GenrePills genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      </div>

      <RevealSection>
        <ContinueWatching items={continueWatchingItems} loading={loading} />
      </RevealSection>

      {/* 1. Trending Now */}
      <RevealSection>
        <TrendingSection items={trendingItems} loading={loading} />
      </RevealSection>

      {/* 2. Top Picks For You */}
      <RevealSection>
        <RecommendationSection items={recommendationItems} subtitle={recommendationSubtitle} />
      </RevealSection>

      {/* 3-9. Rom-Com, Historical, Thriller, Fantasy, Action, Horror, Comedy */}
      {genreSectionsData.map((section) => (
        <RevealSection key={section.id}>
          <GenreRow
            id={`${section.id}-heading`}
            eyebrow={section.eyebrow}
            title={section.title}
            items={section.items}
            loading={loading}
            actionTo={`/discover?genre=${encodeURIComponent(section.title)}`}
          />
        </RevealSection>
      ))}

      {/* 10. All Drama */}
      <RevealSection>
        <AllDramaSection items={allDramaItems} loading={loading} />
      </RevealSection>
    </div>
  );
};

export default Home;