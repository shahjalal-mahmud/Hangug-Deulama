/* src/pages/Recommendations.jsx
   Reads /api/recommendations and renders the result. The endpoint
   returns at most 10 dramas and a `is_personalized` / `fallback` flag
   that we surface to the user. */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as recommendationsApi from '../api/recommendations';
import { useAuth } from '../context/AuthContext';
import DramaCard from '../components/drama/DramaCard';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

const Recommendations = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ count: 0, is_personalized: false, fallback: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    /* /api/recommendations is JWT-protected. Don't hit it for guests —
       the global 401 listener would sign them out for "no reason". */
    if (!isAuthenticated) {
      setLoading(false);
      setItems([]);
      setMeta({ count: 0, is_personalized: false, fallback: false });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await recommendationsApi.getRecommendations();
      setItems(res.data?.recommendations || []);
      setMeta({
        count: res.data?.count ?? (res.data?.recommendations?.length || 0),
        is_personalized: !!res.data?.is_personalized,
        fallback: !!res.data?.fallback,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // We deliberately depend on auth state — when the user signs in the
    // personalized feed should re-fetch.
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingState label="Building your picks" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 px-5 md:px-16 max-w-6xl mx-auto">
        <div>
          <p className="eyebrow text-accent mb-2">맞춤 추천 · FOR YOU</p>
          <h1 className="text-3xl font-bold text-text-primary">Your Recommendations</h1>
          <p className="text-text-secondary mt-2">
            Sign in to get drama recommendations tailored to your taste.
          </p>
        </div>
        <div className="min-h-[40vh] flex items-center justify-center">
          <EmptyState
            title="Sign in to see your picks"
            message={
              <span>
                <Link to="/login" className="text-accent hover:underline">Sign in</Link>{' '}
                to get drama recommendations tailored to your taste.
              </span>
            }
            icon="🔍"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 md:px-16 max-w-3xl mx-auto py-10">
        <ErrorState
          title="Couldn't load recommendations"
          description={error.message || 'Something went wrong fetching your picks.'}
          onRetry={load}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 md:px-16 max-w-6xl mx-auto">
      <div>
        <p className="eyebrow text-accent mb-2">맞춤 추천 · FOR YOU</p>
        <h1 className="text-3xl font-bold text-text-primary">Your Recommendations</h1>
        <p className="text-text-secondary mt-2">
          {meta.is_personalized
            ? 'Personalized picks based on your activity.'
            : 'Top-rated picks to get you started — like a few dramas for sharper recs.'}
        </p>
      </div>

      {meta.fallback && (
        <div className="surface-card rounded-xl px-4 py-3 text-text-secondary text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-accent">auto_awesome</span>
          <span>
            Showing the highest-rated library &mdash; once we know your taste your feed becomes personalized.
          </span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <EmptyState
            title="No Recommendations Yet"
            message="Like or watch a few dramas and your picks will appear here."
            icon="🔍"
          />
        </div>
      ) : (
        <>
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Picks</div>
              <div className="stat-value">{meta.count}</div>
              <div className="stat-desc">
                {meta.is_personalized ? 'Personalized' : 'Cold-start fallback'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
            {items.map((drama) => (
              <DramaCard key={drama.drama_id} drama={drama} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;