/* src/pages/Activity.jsx
   Authenticated "My List" page. Reads the three library endpoints in
   parallel:
     - /api/favorites       → Liked (favorited hearts)
     - /api/swipe           → Not interested (disliked), shown locally
     - /api/watched         → Watched
   /api/swipe has no GET, so we keep using DramaContext's dislike list
   (already persisted to localStorage) for the "Disliked" tab.

   Tabs:
     - Liked      (server: favorites)
     - Watch Later (server: watch-later)
     - Watched    (server: watched)
     - Disliked   (local-only, persisted to localStorage)

   @see docs/API.md#sec-favorites-list
   @see docs/API.md#sec-watch-later-list
   @see docs/API.md#sec-watched-list
   @see docs/ARCHITECTURE.md#sec-drama-context */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDrama } from '../context/DramaContext';
import * as favoritesApi from '../api/favorites';
import * as watchLaterApi from '../api/watchLater';
import * as watchedApi from '../api/watched';
import DramaCard from '../components/drama/DramaCard';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const Activity = () => {
  const { dramas, dislikedDramas } = useDrama();
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('liked');

  // NOTE: firing all three list endpoints in parallel via Promise.all
  // instead of awaiting them in sequence saves ~2× the wall time on a
  // cold network. The single error catch is acceptable here because
  // if any one fails the whole page needs to show the error state —
  // we don't have UX for partial success on this screen.
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [favsRes, wlRes, wRes] = await Promise.all([
        favoritesApi.listFavorites(),
        watchLaterApi.listWatchLater(),
        watchedApi.listWatched(),
      ]);
      setFavorites(favsRes.data?.favorites || []);
      setWatchLater(wlRes.data?.watch_later || []);
      setWatched(wRes.data?.watched || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <LoadingState label="Loading your library" />;
  }

  if (error) {
    return (
      <div className="px-5 md:px-16 max-w-3xl mx-auto py-10">
        <ErrorState
          title="Couldn't load your activity"
          description={error.message || 'Something went wrong fetching your library.'}
          onRetry={load}
        />
      </div>
    );
  }

  const renderContent = () => {
    let rows = [];
    let dramasList = [];

    if (activeTab === 'liked') {
      rows = favorites;
      dramasList = rows
        .map((r) => r.drama || dramas.find((d) => d.drama_id === r.drama_id))
        .filter(Boolean);
    } else if (activeTab === 'watch_later') {
      rows = watchLater;
      dramasList = rows
        .map((r) => r.drama || dramas.find((d) => d.drama_id === r.drama_id))
        .filter(Boolean);
    } else if (activeTab === 'watched') {
      rows = watched;
      dramasList = rows
        .map((r) => r.drama || dramas.find((d) => d.drama_id === r.drama_id))
        .filter(Boolean);
    } else if (activeTab === 'disliked') {
      dramasList = dramas.filter((d) => dislikedDramas.includes(d.drama_id));
    }

    const title = TAB_TITLES[activeTab];
    const emptyMessage = EMPTY_MESSAGES[activeTab];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {rows.length > 0 && activeTab !== 'disliked' && (
            <span className="text-text-tertiary text-xs uppercase tracking-wider">
              {rows.length} item{rows.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {dramasList.length === 0 ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <EmptyState
              title="Nothing here yet"
              message={
                <span>
                  {emptyMessage}{' '}
                  <Link to="/discover" className="text-accent hover:underline">
                    Browse dramas
                  </Link>{' '}
                  to add some.
                </span>
              }
              icon="📋"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dramasList.map((drama) => (
              <DramaCard key={drama.drama_id} drama={drama} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'liked', label: `Favorites (${favorites.length})`, icon: 'favorite' },
    { id: 'watch_later', label: `Watch Later (${watchLater.length})`, icon: 'bookmark' },
    { id: 'watched', label: `Watched (${watched.length})`, icon: 'visibility' },
    { id: 'disliked', label: `Disliked (${dislikedDramas.length})`, icon: 'close' },
  ];

  return (
    <div className="space-y-6 px-5 md:px-16 max-w-6xl mx-auto">
      <div>
        <p className="eyebrow text-accent mb-2">My library</p>
        <h1 className="text-3xl font-bold text-text-primary">My List</h1>
        <p className="text-text-secondary text-sm mt-2">
          Favorites, watch queue, and what you have already finished.
        </p>
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        role="tablist"
        aria-label="Activity sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 flex-none px-4 py-2 rounded-full text-xs font-medium
                       uppercase tracking-wide transition-all duration-300
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

const EMPTY_MESSAGES = {
  liked: "You haven't favorited any dramas yet.",
  watch_later: 'Your watch queue is empty.',
  watched: "You haven't marked any dramas as watched yet.",
  disliked: "You haven't passed on any dramas yet.",
};

const TAB_TITLES = {
  liked: 'Favorites',
  watch_later: 'Watch Later',
  watched: 'Watched',
  disliked: 'Disliked',
};

export default Activity;