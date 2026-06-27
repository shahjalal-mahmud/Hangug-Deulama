/* src/pages/DramaDetails.jsx */
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDrama } from '../context/DramaContext';
import {
  parseGenres,
  parseStars,
  getLikedGenres,
  getMatchScore,
  getReasonText,
} from '../utils/dramaHelpers';

import BackdropHero from '../components/details/BackdropHero';
import SynopsisSection from '../components/details/SynopsisSection';
import InfoGrid from '../components/details/InfoGrid';
import CastSection from '../components/details/CastSection';
import RecommendationReason from '../components/details/RecommendationReason';
import SimilarDramas from '../components/details/SimilarDramas';
import DetailsSkeleton from '../components/details/DetailsSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import RevealSection from '../components/ui/RevealSection';

const DramaDetails = () => {
  const { id } = useParams();
  const {
    dramas,
    loading,
    likedDramas,
    getDramaById,
    getDramaStatus,
    likeDrama,
    dislikeDrama,
    watchDrama,
    toggleBookmark,
  } = useDrama();

  const [loadError, setLoadError] = useState(null);
  
  // Convert id to number safely
  const dramaId = useMemo(() => {
    if (!id) return null;
    const parsed = Number.parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }, [id]);
  
  // Get drama only when dramaId is valid and dramas are loaded
  const drama = useMemo(() => {
    if (!dramaId || !dramas || dramas.length === 0) return null;
    return getDramaById(dramaId);
  }, [dramaId, dramas, getDramaById]);

  useEffect(() => {
    document.title = drama ? `${drama.title} — HANGUG DEULAMA` : 'HANGUG DEULAMA';
  }, [drama]);

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  const likedDramaTitles = useMemo(
    () => dramas.filter((d) => likedDramas.includes(d.drama_id)).map((d) => d.title),
    [dramas, likedDramas]
  );

  const similarDramas = useMemo(() => {
    if (!drama) return [];
    const dramaGenres = parseGenres(drama.genre);
    return dramas
      .filter(
        (d) =>
          d.drama_id !== drama.drama_id &&
          parseGenres(d.genre).some((g) => dramaGenres.includes(g))
      )
      .sort((a, b) => getMatchScore(b, likedGenres) - getMatchScore(a, likedGenres))
      .slice(0, 6);
  }, [drama, dramas, likedGenres]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: drama.title, url });
        return 'shared';
      }
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      setLoadError(null); // share cancellation isn't an error state
      return null;
    }
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!dramaId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <ErrorState title="Invalid Drama Link" description="That link doesn't point to a valid drama." />
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <EmptyState
          icon="search_off"
          title="Drama Not Found"
          description="Sorry, we couldn't find the drama you're looking for. It may have been removed."
        />
      </div>
    );
  }

  const genres = parseGenres(drama.genre);
  const stars = parseStars(drama.stars);
  const status = getDramaStatus(drama.drama_id);
  const matchScore = getMatchScore(drama, likedGenres);
  const reasonText = getReasonText(drama, likedGenres, likedDramaTitles);

  const infoItems = [
    { label: 'Genres', value: genres.join(', ') },
    { label: 'Release Year', value: drama.release_year },
    { label: 'Rating', value: drama.imdb_rating ? `${drama.imdb_rating} / 10` : 'Not yet rated' },
    { label: 'Language', value: 'Korean' },
    { label: 'Country', value: 'South Korea' },
  ];

  return (
    <div>
      <BackdropHero
        drama={drama}
        status={status}
        onLike={() => likeDrama(drama.drama_id)}
        onDislike={() => dislikeDrama(drama.drama_id)}
        onWatched={() => watchDrama(drama.drama_id)}
        onBookmark={() => toggleBookmark(drama.drama_id)}
        onShare={handleShare}
      />

      {loadError && (
        <div className="px-5 md:px-16 max-w-6xl mx-auto pt-6">
          <ErrorState title="Couldn't share" description={loadError} onRetry={() => setLoadError(null)} />
        </div>
      )}

      <section className="px-5 md:px-16 max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-12">
          <RevealSection>
            <SynopsisSection storyline={drama.storyline} />
          </RevealSection>

          <RevealSection>
            <InfoGrid items={infoItems} />
          </RevealSection>

          <RevealSection>
            <CastSection stars={stars} />
          </RevealSection>
        </div>

        <div className="md:col-span-4">
          <RevealSection>
            <RecommendationReason score={matchScore} reasonText={reasonText} />
          </RevealSection>
        </div>
      </section>

      <section className="px-5 md:px-16 max-w-6xl mx-auto pb-16">
        <RevealSection>
          <SimilarDramas dramas={similarDramas} />
        </RevealSection>
      </section>
    </div>
  );
};

export default DramaDetails;