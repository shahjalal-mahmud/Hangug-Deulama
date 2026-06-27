/* src/utils/dramaHelpers.js
   Pure functions that derive home-page data from the raw dramas array.
   Kept outside DramaContext so they're easy to unit test in isolation. */

export const parseGenres = (genreString = '') =>
  genreString.split(',').map((g) => g.trim()).filter(Boolean);

export const getUniqueGenres = (dramas) => {
  const set = new Set();
  dramas.forEach((d) => parseGenres(d.genre).forEach((g) => set.add(g)));
  return Array.from(set).sort();
};

export const filterByGenre = (dramas, genre) => {
  if (!genre || genre === 'All') return dramas;
  return dramas.filter((d) => parseGenres(d.genre).includes(genre));
};

export const getTrending = (dramas, limit = 10) =>
  [...dramas]
    .sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0))
    .slice(0, limit);

const getLikedGenres = (dramas, likedIds) => {
  const set = new Set();
  dramas
    .filter((d) => likedIds.includes(d.drama_id))
    .forEach((d) => parseGenres(d.genre).forEach((g) => set.add(g)));
  return Array.from(set);
};

const computeMatchScore = (drama, likedGenres) => {
  const dramaGenres = parseGenres(drama.genre);
  if (!likedGenres.length) {
    // No taste signal yet — fall back to rating as a proxy, never below 60.
    return Math.max(60, Math.round((drama.imdb_rating || 7) * 10));
  }
  const shared = dramaGenres.filter((g) => likedGenres.includes(g)).length;
  const score = Math.round((shared / dramaGenres.length) * 100);
  return Math.max(score, 60);
};

export const getRecommendations = (
  dramas,
  likedIds = [],
  dislikedIds = [],
  watchedIds = [],
  limit = 4
) => {
  const likedGenres = getLikedGenres(dramas, likedIds);
  const excluded = new Set([...dislikedIds, ...watchedIds]);

  return [...dramas]
    .filter((d) => !excluded.has(d.drama_id))
    .map((d) => ({ ...d, matchScore: computeMatchScore(d, likedGenres) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

/* Deterministic placeholder progress — there's no episode/watch-position
   field in dramas.json yet. Swap this for real progress data once a
   watch-history API/field exists; the rest of the component tree won't
   need to change since it just reads `drama.progress`. */
const hashToPercent = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100;
  }
  return Math.max(8, Math.min(96, Math.abs(hash)));
};

export const getContinueWatching = (
  dramas,
  dislikedIds = [],
  watchedIds = [],
  limit = 3
) =>
  dramas
    .filter((d) => !dislikedIds.includes(d.drama_id) && !watchedIds.includes(d.drama_id))
    .slice(0, limit)
    .map((d) => ({
      ...d,
      progress: hashToPercent(String(d.drama_id ?? d.title)),
    }));