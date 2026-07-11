/* eslint-disable react-refresh/only-export-components */
/* src/context/DramaContext.jsx
   API-driven drama catalog and user activity state.

   On mount we:
     1. Fetch the public catalog from GET /api/dramas.
     2. If a JWT is present, also fetch favorites / watch-later /
        watched so the UI reflects the user's persisted activity.
     3. Read stored liked/disliked drama IDs from localStorage so the
        swipe deck stays usable even when the user is logged out (the
        API has no concept of an anonymous user).

   Mutations are optimistic for snappier UI — we update local state
   first, then call the API. On failure we revert and surface the
   error so callers can display it. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import * as dramasApi from '../api/dramas';
import * as favoritesApi from '../api/favorites';
import * as watchLaterApi from '../api/watchLater';
import * as watchedApi from '../api/watched';
import * as swipeApi from '../api/swipe';

const DramaContext = createContext(null);

const LS_KEYS = {
  liked: 'hd_liked_dramas',
  disliked: 'hd_disliked_dramas',
};

const readLs = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLs = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* fail silently if storage is unavailable */
  }
};

/* Flatten the user-library payloads into a simple Set-of-ids for fast
   membership checks across the UI. Items come back as
   `{ drama_id, drama: {...} }`. */
const extractDramaIds = (rows = []) => rows.map((r) => r.drama_id);

export const DramaProvider = ({ children }) => {
  const { isAuthenticated, bootstrapped } = useAuth();

  const [dramas, setDramas] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [watched, setWatched] = useState([]);
  const [likedDramas, setLikedDramas] = useState(() => readLs(LS_KEYS.liked));
  const [dislikedDramas, setDislikedDramas] = useState(() => readLs(LS_KEYS.disliked));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Catalog fetch — runs on mount and whenever we log in (to clear
     stale locals). We ignore pagination; the default `limit=20` is
     enough to fill the home + discover + recommendations screens. */
  useEffect(() => {
    let cancelled = false;
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dramasApi.listDramas({ limit: 100, sort: 'created_at', order: 'desc' });
        if (cancelled) return;
        setDramas(Array.isArray(res.data?.dramas) ? res.data.dramas : []);
      } catch (err) {
        if (cancelled) return;
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  /* When authenticated, hydrate the library lists. Failures here are
     non-fatal — the UI just keeps working off localStorage. */
  useEffect(() => {
    if (!bootstrapped) return;
    if (!isAuthenticated) {
      setFavorites([]);
      setWatchLater([]);
      setWatched([]);
      return;
    }
    let cancelled = false;
    const hydrate = async () => {
      try {
        const [favsRes, wlRes, wdRes] = await Promise.all([
          favoritesApi.listFavorites(),
          watchLaterApi.listWatchLater(),
          watchedApi.listWatched(),
        ]);
        if (cancelled) return;
        setFavorites(extractDramaIds(favsRes.data?.favorites));
        setWatchLater(extractDramaIds(wlRes.data?.watch_later));
        setWatched(extractDramaIds(wdRes.data?.watched));
        // Seed the like/dislike lists from the swipe history endpoint?
        // There's no GET for swipes, so we keep the localStorage copies.
      } catch {
        /* silent — keep existing local state */
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [bootstrapped, isAuthenticated]);

  /* Persist liked/disliked locally so anonymous swipes survive reloads. */
  useEffect(() => writeLs(LS_KEYS.liked, likedDramas), [likedDramas]);
  useEffect(() => writeLs(LS_KEYS.disliked, dislikedDramas), [dislikedDramas]);

  /* --- Mutations -------------------------------------------------- */

  const likeDrama = useCallback(
    async (dramaId) => {
      if (likedDramas.includes(dramaId)) return;
      setLikedDramas((prev) => [...prev, dramaId]);
      setDislikedDramas((prev) => prev.filter((id) => id !== dramaId));

      if (!isAuthenticated) return;
      try {
        await swipeApi.recordSwipe(dramaId, 'like');
      } catch {
        /* don't revert UX state; show a console hint for diagnostics */
        console.warn('Failed to record like swipe');
      }
    },
    [likedDramas, isAuthenticated]
  );

  const dislikeDrama = useCallback(
    async (dramaId) => {
      if (dislikedDramas.includes(dramaId)) return;
      setDislikedDramas((prev) => [...prev, dramaId]);
      setLikedDramas((prev) => prev.filter((id) => id !== dramaId));

      if (!isAuthenticated) return;
      try {
        await swipeApi.recordSwipe(dramaId, 'dislike');
      } catch {
        console.warn('Failed to record dislike swipe');
      }
    },
    [dislikedDramas, isAuthenticated]
  );

  const watchDrama = useCallback(
    async (dramaId) => {
      // Watched is a log, not a toggle — calling it twice on the same
      // drama should be a no-op rather than an error.
      if (watched.includes(dramaId)) return;

      if (!isAuthenticated) {
        // local-only fallback so the offline UI keeps working
        setWatched((prev) => [...prev, dramaId]);
        return;
      }

      const prevWatched = watched;
      setWatched((prev) => [...prev, dramaId]);
      try {
        await watchedApi.markWatched(dramaId);
      } catch {
        setWatched(prevWatched);
        throw new Error('Could not mark drama as watched.');
      }
    },
    [watched, isAuthenticated]
  );

  const toggleBookmark = useCallback(
    async (dramaId) => {
      const has = watchLater.includes(dramaId);
      const previous = watchLater;
      setWatchLater((prev) => (has ? prev.filter((id) => id !== dramaId) : [...prev, dramaId]));

      if (!isAuthenticated) return;

      try {
        if (has) {
          await watchLaterApi.removeWatchLater(dramaId);
        } else {
          await watchLaterApi.addWatchLater(dramaId);
        }
      } catch {
        setWatchLater(previous);
        throw new Error(has ? 'Could not remove from your list.' : 'Could not save to your list.');
      }
    },
    [watchLater, isAuthenticated]
  );

  const toggleFavorite = useCallback(
    async (dramaId) => {
      const has = favorites.includes(dramaId);
      const previous = favorites;
      setFavorites((prev) => (has ? prev.filter((id) => id !== dramaId) : [...prev, dramaId]));

      if (!isAuthenticated) return;

      try {
        if (has) {
          await favoritesApi.removeFavorite(dramaId);
        } else {
          await favoritesApi.addFavorite(dramaId);
        }
      } catch {
        setFavorites(previous);
        throw new Error(has ? 'Could not remove from favorites.' : 'Could not add to favorites.');
      }
    },
    [favorites, isAuthenticated]
  );

  /* --- Selectors -------------------------------------------------- */

  const getDramaById = useCallback(
    (id) => dramas.find((drama) => drama.drama_id === id) || null,
    [dramas]
  );

  const getDramaStatus = useCallback(
    (dramaId) => ({
      isLiked: likedDramas.includes(dramaId),
      isDisliked: dislikedDramas.includes(dramaId),
      isWatched: watched.includes(dramaId),
      isBookmarked: watchLater.includes(dramaId),
      isFavorite: favorites.includes(dramaId),
    }),
    [likedDramas, dislikedDramas, watched, watchLater, favorites]
  );

  const value = useMemo(
    () => ({
      dramas,
      loading,
      error,
      likedDramas,
      dislikedDramas,
      watchedDramas: watched,
      bookmarkedDramas: watchLater,
      favoriteDramas: favorites,
      likeDrama,
      dislikeDrama,
      watchDrama,
      toggleBookmark,
      toggleFavorite,
      getDramaById,
      getDramaStatus,
    }),
    [
      dramas,
      loading,
      error,
      likedDramas,
      dislikedDramas,
      watched,
      watchLater,
      favorites,
      likeDrama,
      dislikeDrama,
      watchDrama,
      toggleBookmark,
      toggleFavorite,
      getDramaById,
      getDramaStatus,
    ]
  );

  return <DramaContext.Provider value={value}>{children}</DramaContext.Provider>;
};

export const useDrama = () => {
  const context = useContext(DramaContext);
  if (!context) {
    throw new Error('useDrama must be used within a DramaProvider');
  }
  return context;
};