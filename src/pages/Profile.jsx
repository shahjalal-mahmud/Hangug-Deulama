/* src/pages/Profile.jsx
   Authenticated profile page. Pulls /api/profile and
   /api/profile/genre-statistics and surfaces:
     - avatar + name + email
     - liked_count, watched_count, top-3 favorite_genres
     - full per-genre stats
     - edit button → opens the ProfileEdit modal
     - logout
*/

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as profileApi from '../api/profile';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import SectionHeader from '../components/ui/SectionHeader';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import { API_BASE_URL } from '../api';

const STAT_CARDS = [
  { key: 'liked_count', label: 'Liked', icon: 'favorite' },
  { key: 'watched_count', label: 'Watched', icon: 'visibility' },
  { key: 'favorite_count', label: 'Favorites', icon: 'bookmark' },
];

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, statsRes] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getGenreStatistics(),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
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
    return <LoadingState label="Loading your profile" />;
  }

  if (error) {
    return (
      <div className="px-5 md:px-16 max-w-6xl mx-auto py-10">
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
    setProfile((prev) => ({ ...prev, ...updated }));
    updateUser(updated);
  };

  /* The backend stores the avatar as a path like "uploads/profile/foo.jpg".
     When no base URL is set we treat it as relative to the current origin. */
  const avatarSrc = profile?.image
    ? /^https?:\/\//i.test(profile.image)
      ? profile.image
      : `${API_BASE_URL}/${profile.image}`
    : null;

  return (
    <div className="px-5 md:px-16 max-w-5xl mx-auto py-10">
      <div className="surface-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start mb-10">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-elevated flex items-center justify-center border border-border-strong flex-none">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={profile?.name || 'Profile avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-text-tertiary">person</span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="eyebrow text-accent mb-1">My account</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            {profile?.name || user?.full_name}
          </h1>
          <p className="text-text-secondary text-sm mt-1">{profile?.email || user?.email}</p>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-5">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent text-white text-xs font-medium uppercase
                         tracking-wide px-5 py-2.5 hover:bg-accent-hover transition-colors duration-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong
                         text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs
                         font-medium uppercase tracking-wide px-5 py-2.5 transition-colors duration-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="surface-card rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-none">
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-text-tertiary text-[11px] uppercase tracking-widest">
                {card.label}
              </p>
              <p className="font-display text-2xl font-semibold text-text-primary leading-tight">
                {profile?.[card.key] ?? 0}
              </p>
            </div>
          </div>
        ))}
      </section>

      {profile?.favorite_genres?.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            id="favorite-genres"
            eyebrow="Taste profile"
            title="Your top genres"
          />
          <div className="flex flex-wrap gap-2">
            {profile.favorite_genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider"
              >
                {g}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <SectionHeader
          id="genre-stats"
          eyebrow="Deep dive"
          title="Genre preference scores"
          subtitle="likes +5 · watched +2 · dislikes -3 (clamped at 0)"
        />
        {stats?.statistics?.length ? (
          <div className="surface-card rounded-2xl overflow-hidden">
            <ul className="divide-y divide-border">
              {stats.statistics.map((s) => {
                const max = Math.max(1, ...stats.statistics.map((row) => row.score));
                const pct = Math.round((s.score / max) * 100);
                return (
                  <li key={s.genre} className="px-5 py-4 grid grid-cols-12 items-center gap-3">
                    <span className="col-span-4 sm:col-span-3 text-text-primary text-sm font-medium">
                      {s.genre}
                    </span>
                    <div className="col-span-6 sm:col-span-7 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-700 ease-cinematic"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="col-span-2 text-right text-text-secondary text-xs font-mono">
                      {s.score} <span className="text-text-tertiary">({s.liked}L / {s.watched}W / {s.disliked}D)</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="surface-card rounded-2xl p-6 text-text-secondary text-sm">
            <p>
              No genre activity yet. Try the{' '}
              <Link to="/discover" className="text-accent hover:underline">Discover</Link>{' '}
              page to record some likes and dislikes.
            </p>
          </div>
        )}
      </section>

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