/* src/pages/DramaDetails.jsx */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrama } from '../context/DramaContext';
import { parseGenres, getLikedGenres, getMatchScore } from '../utils/dramaHelpers';
import * as dramasApi from '../api/dramas';

import PosterPanel from '../components/details/PosterPanel';
import DetailsHeader from '../components/details/DetailsHeader';
import SynopsisSection from '../components/details/SynopsisSection';
import InfoGrid from '../components/details/InfoGrid';
import CastSection from '../components/details/CastSection';
import SimilarDramas from '../components/details/SimilarDramas';
import DetailsSkeleton from '../components/details/DetailsSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import RevealSection from '../components/ui/RevealSection';

const DramaDetails = () => {
  const { id } = useParams();
  const {
    dramas,
    likedDramas,
    getDramaStatus,
    likeDrama,
    dislikeDrama,
    watchDrama,
    toggleBookmark,
  } = useDrama();

  const [drama, setDrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareError, setShareError] = useState(null);
  /* A tick we bump on retry to force the fetch effect to re-run
     without nuking the whole page via window.location.reload(). */
  const [refreshTick, setRefreshTick] = useState(0);

  const dramaId = useMemo(() => {
    if (!id) return null;
    const parsed = Number.parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  /* Try the catalog cache first for a snappy first paint, then fetch
     /api/dramas/{id} for fresh authoritative data. */
  useEffect(() => {
    let cancelled = false;

    if (dramaId && dramas.length) {
      const cached = dramas.find((d) => d.drama_id === dramaId);
      if (cached) setDrama(cached);
    }

    if (!dramaId) {
      setDrama(null);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await dramasApi.getDrama(dramaId);
        if (cancelled) return;
        // Backend wraps the row in { data: { drama: {...} } } via
        // Response::ok, so unwrap one level before assigning.
        setDrama(res?.data?.drama || null);
      } catch (err) {
        if (cancelled) return;
        if (err.status === 404) {
          setDrama(null);
          setError(null);
        } else {
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dramaId, dramas, refreshTick]);

  useEffect(() => {
    document.title = drama ? `${drama.title} — HANGUG DEULAMA` : 'HANGUG DEULAMA';
  }, [drama]);

  const likedGenres = useMemo(() => getLikedGenres(dramas, likedDramas), [dramas, likedDramas]);

  const similarDramas = useMemo(() => {
    if (!drama || !dramas.length) return [];
    const dramaGenres = parseGenres(drama);
    return dramas
      .filter(
        (d) =>
          d.drama_id !== drama.drama_id &&
          parseGenres(d).some((g) => dramaGenres.includes(g))
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
      setShareError(null);
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

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <ErrorState
          title="Couldn't load this drama"
          description={error.message || 'Something went wrong while fetching this drama.'}
          onRetry={() => {
            setError(null);
            setLoading(true);
            // Bumping refreshTick re-runs the fetch effect cleanly
            // without a hard page reload (preserves scroll + state).
            setRefreshTick((t) => t + 1);
          }}
        />
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

  const genres = parseGenres(drama);
  const status = getDramaStatus(drama.drama_id);

  const infoItems = [
    { label: 'Genres', value: genres.join(', ') },
    { label: 'Release Year', value: drama.release_year },
    { label: 'Rating', value: drama.imdb_rating ? `${drama.imdb_rating} / 10` : 'Not yet rated' },
    { label: 'Language', value: 'Korean' },
    { label: 'Country', value: 'South Korea' },
  ];

  return (
    <div>
      <section className="px-5 md:px-16 max-w-6xl mx-auto pt-28 md:pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <PosterPanel drama={drama} />
          </div>

          <div className="md:col-span-8 space-y-10">
            <DetailsHeader
              drama={drama}
              status={status}
              onLike={() => likeDrama(drama.drama_id)}
              onDislike={() => dislikeDrama(drama.drama_id)}
              onWatched={() => watchDrama(drama.drama_id)}
              onBookmark={() => toggleBookmark(drama.drama_id)}
              onShare={handleShare}
            />

            {shareError && (
              <ErrorState title="Couldn't share" description={shareError} onRetry={() => setShareError(null)} />
            )}

            <RevealSection>
              <SynopsisSection storyline={drama.storyline} />
            </RevealSection>

            <RevealSection>
              <InfoGrid items={infoItems} />
            </RevealSection>

            <RevealSection>
              <CastSection stars={parseGenres(drama) && drama.stars ? drama.stars.split(',').map((s) => s.trim()).filter(Boolean) : []} />
            </RevealSection>
          </div>
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