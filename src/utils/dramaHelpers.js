/* src/utils/dramaHelpers.js
   Pure functions that derive home/discover/details-page data from the raw
   dramas array. Kept outside DramaContext so they're easy to unit test
   in isolation. */

export const parseGenres = (genreString = '') =>
  genreString.split(',').map((g) => g.trim()).filter(Boolean);

export const parseStars = (starsString = '') =>
  starsString.split(',').map((s) => s.trim()).filter(Boolean);

export const getUniqueGenres = (dramas) => {
  const set = new Set();
  dramas.forEach((d) => parseGenres(d.genre).forEach((g) => set.add(g)));
  return Array.from(set).sort();
};

export const filterByGenre = (dramas, genre) => {
  if (!genre || genre === 'All') return dramas;
  return dramas.filter((d) => parseGenres(d.genre).includes(genre));
};

export const filterBySearch = (dramas, query) => {
  if (!query?.trim()) return dramas;
  const q = query.trim().toLowerCase();
  return dramas.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      (d.stars || '').toLowerCase().includes(q) ||
      parseGenres(d.genre).some((g) => g.toLowerCase().includes(q))
  );
};

export const getTrending = (dramas, limit = 10) =>
  [...dramas]
    .sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0))
    .slice(0, limit);

export const getLikedGenres = (dramas, likedIds) => {
  const set = new Set();
  dramas
    .filter((d) => likedIds.includes(d.drama_id))
    .forEach((d) => parseGenres(d.genre).forEach((g) => set.add(g)));
  return Array.from(set);
};

export const getMatchScore = (drama, likedGenres = []) => {
  const dramaGenres = parseGenres(drama.genre);
  if (!likedGenres.length) {
    // No taste signal yet — fall back to rating as a proxy, never below 60.
    return Math.max(60, Math.round((drama.imdb_rating || 7) * 10));
  }
  const shared = dramaGenres.filter((g) => likedGenres.includes(g)).length;
  const score = Math.round((shared / dramaGenres.length) * 100);
  return Math.max(score, 60);
};

/* Builds the human-readable line shown in the "Why Recommend" card.
   Falls back gracefully when there's no taste signal yet. */
export const getReasonText = (drama, likedGenres = [], likedDramaTitles = []) => {
  const dramaGenres = parseGenres(drama.genre);
  const sharedGenres = dramaGenres.filter((g) => likedGenres.includes(g));

  if (!sharedGenres.length) {
    return drama.imdb_rating >= 8.5
      ? 'A critically acclaimed pick — one of the highest-rated stories in the library.'
      : 'A solid pick to help us learn your taste. Swipe to refine future picks.';
  }

  const genreLabel = sharedGenres.slice(0, 2).join(' & ');
  if (likedDramaTitles.length) {
    return `Because you liked "${likedDramaTitles[0]}", you might enjoy this ${genreLabel.toLowerCase()} story too.`;
  }
  return `Matches your taste for ${genreLabel} — shared with titles you've liked.`;
};

export const sortDramas = (dramas, sortBy, likedGenres = []) => {
  const list = [...dramas];
  switch (sortBy) {
    case 'rating':
      return list.sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0));
    case 'newest':
      return list.sort((a, b) => Number(b.release_year) - Number(a.release_year));
    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'match':
    default:
      return list.sort((a, b) => getMatchScore(b, likedGenres) - getMatchScore(a, likedGenres));
  }
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
    .map((d) => ({ ...d, matchScore: getMatchScore(d, likedGenres) }))
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

/* Deterministic hue for cast-initial avatars, since dramas.json has no
   actor photos. Keeps each name's color stable across renders. */
export const hashToHue = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();