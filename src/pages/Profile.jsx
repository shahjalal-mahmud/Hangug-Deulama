/* src/pages/Profile.jsx
   Authenticated profile page.

   Data sources:
     - GET /api/profile                  → id, name, email, image,
                                           liked_count, watched_count,
                                           favorite_genres[]
     - GET /api/profile/genre-statistics → statistics[]
                                           (genre, score, liked, watched, disliked)
                                           totals { liked, watched, disliked }
     - GET /api/favorites                → count (the /api/profile endpoint
                                           does not return favorite_count, so we
                                           pull it from the dedicated endpoint)

   Layout: a hero identity card, an at-a-glance stat row, then the "Taste
   profile" — a ranked genre-affinity chart that's the page's one signature
   element. A collapsed "Developer details" panel at the bottom preserves
   the original verbatim-field verification view without it being the
   first thing a user sees.

   @see docs/API.md#sec-profile-get
   @see docs/API.md#sec-genre-statistics-endpoint
   @see docs/API.md#sec-favorites-list
   @see docs/ARCHITECTURE.md#sec-auth-context */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as profileApi from '../api/profile';
import * as favoritesApi from '../api/favorites';
import ErrorState from '../components/ui/ErrorState';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import ProfileHero from '../components/profile/ProfileHero';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import StatCard from '../components/profile/StatCard';
import TasteProfile from '../components/profile/TasteProfile';
import { resolveAvatar } from '../utils/avatar';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // NOTE: the three endpoints fire in parallel — there are no shared
  // inputs so Promise.all beats awaited-sequential by ~⅔ the latency.
  // favorites count is fished out of the favorites endpoint because
  // /api/profile does not surface a favorite_count field at all.
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, statsRes, favsRes] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getGenreStatistics(),
        favoritesApi.listFavorites(),
      ]);
      setProfile(profileRes.data ?? null);
      setStats(statsRes.data ?? null);
      setFavoritesCount(favsRes.data?.count ?? favsRes.data?.favorites?.length ?? 0);
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
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-10">
        <ErrorState
          title="Couldn't load your profile"
          description={error.message || 'Something went wrong while fetching your profile.'}
          onRetry={load}
        />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdated = (updated) => {
    setProfile((prev) => ({ ...(prev || {}), ...updated }));
    updateUser(updated);
  };

  const avatarSrc = resolveAvatar(profile?.image);
  const totals = stats?.totals ?? {};
  const statistics = Array.isArray(stats?.statistics) ? stats.statistics : [];
  const favoriteGenres = profile?.favorite_genres ?? [];

  const topGenre = statistics.length
    ? [...statistics].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
    : null;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
      <div className="animate-fade-up">
        <ProfileHero
          name={profile?.name || user?.full_name}
          email={profile?.email || user?.email}
          avatarSrc={avatarSrc}
          topGenreLabel={topGenre?.genre}
          onEdit={() => setEditOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 animate-fade-up"
        style={{ animationDelay: '90ms' }}
      >
        <StatCard
          icon="favorite"
          label="Liked dramas"
          value={profile?.liked_count ?? 0}
          accentClass="text-primary bg-primary/10"
        />
        <StatCard
          icon="visibility"
          label="Watched dramas"
          value={profile?.watched_count ?? 0}
          accentClass="text-tertiary bg-tertiary/10"
        />
        <StatCard
          icon="star"
          label="Favorites"
          value={favoritesCount}
          accentClass="text-secondary bg-secondary/10"
        />
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <TasteProfile statistics={statistics} totals={totals} favoriteGenres={favoriteGenres} />
      </div>

      {favoriteGenres.length > 0 && (
        <section className="mt-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <p className="eyebrow mb-2">Favorite genres</p>
          <div className="flex flex-wrap gap-2">
            {favoriteGenres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </section>
      )}
      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default Profile;