/* src/pages/Home.jsx */
import { useMemo, useState } from 'react';
import { useDrama } from '../context/DramaContext';
import HeroSection from '../components/home/HeroSection';
import GenrePills from '../components/home/GenrePills';
import ContinueWatching from '../components/home/ContinueWatching';
import TrendingSection from '../components/home/TrendingSection';
import RecommendationSection from '../components/home/RecommendationSection';
import RevealSection from '../components/ui/RevealSection';
import {
  getUniqueGenres,
  filterByGenre,
  getTrending,
  getContinueWatching,
  getRecommendations,
  getLikedGenres,
  getReasonText,
} from '../utils/dramaHelpers';

const Home = () => {
  const { dramas, loading, likedDramas, dislikedDramas, watchedDramas } = useDrama();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genres = useMemo(() => getUniqueGenres(dramas), [dramas]);

  // Spotlight always pulls from the unfiltered top-rated pool, independent
  // of the genre filter below it — the hero stays stable while browsing.
  const spotlightItems = useMemo(() => getTrending(dramas, 5), [dramas]);

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

  return (
    <div>
      <HeroSection items={spotlightItems} loading={loading} />

      <div className="mb-12">
        <GenrePills genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      </div>

      <RevealSection>
        <ContinueWatching items={continueWatchingItems} loading={loading} />
      </RevealSection>

      <RevealSection>
        <TrendingSection items={trendingItems} loading={loading} />
      </RevealSection>

      <RevealSection>
        <RecommendationSection items={recommendationItems} subtitle={recommendationSubtitle} />
      </RevealSection>
    </div>
  );
};

export default Home;