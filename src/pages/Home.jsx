import { useMemo, useState } from 'react';
import { useDrama } from '../context/DramaContext';
import HeroSection from '../components/home/HeroSection';
import GenrePills from '../components/home/GenrePills';
import ContinueWatching from '../components/home/ContinueWatching';
import TrendingSection from '../components/home/TrendingSection';
import RecommendationSection from '../components/home/RecommendationSection';
import RevealSection from '../components/RevealSection';
import {
  getUniqueGenres,
  filterByGenre,
  getTrending,
  getContinueWatching,
  getRecommendations,
} from '../utils/dramaHelpers';

const Home = () => {
  const { dramas, loading, likedDramas, dislikedDramas, watchedDramas } = useDrama();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genres = useMemo(() => getUniqueGenres(dramas), [dramas]);

  const continueWatchingItems = useMemo(
    () => getContinueWatching(dramas, dislikedDramas, watchedDramas),
    [dramas, dislikedDramas, watchedDramas]
  );

  const trendingItems = useMemo(() => {
    const filtered = filterByGenre(dramas, selectedGenre);
    return getTrending(filtered, 10);
  }, [dramas, selectedGenre]);

  const recommendationItems = useMemo(
    () => getRecommendations(dramas, likedDramas, dislikedDramas, watchedDramas, 4),
    [dramas, likedDramas, dislikedDramas, watchedDramas]
  );

  const recommendationSubtitle = likedDramas.length
    ? "Based on what you've liked"
    : 'Top picks to get you started';

  return (
    <div>
      <HeroSection />

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