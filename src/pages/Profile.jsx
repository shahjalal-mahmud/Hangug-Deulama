/* src/pages/Profile.jsx
   Authenticated profile page.

   Data sources:
     - GET /api/profile              → id, name, email, image,
                                       liked_count, watched_count,
                                       favorite_genres[]
     - GET /api/profile/genre-statistics → statistics[]
                                            (genre, score, liked, watched, disliked)
                                       totals { liked, watched, disliked }
     - GET /api/favorites            → count (the /api/profile endpoint
                                       does not return favorite_count, so we
                                       pull it from the dedicated endpoint)

   The goal of this view is to surface every field the backend returns so
   the data layer is verified end-to-end. Styling is intentionally minimal
   — the UI will be pixel-perfected later. */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as profileApi from '../api/profile';
import * as favoritesApi from '../api/favorites';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import { API_BASE_URL } from '../api';

/* Resolve a stored image path like "uploads/profile/foo.png" into a URL
   the <img> tag can actually load. If the backend ever returns a fully
   qualified URL we leave it alone. */
const resolveAvatar = (image) => {
  if (!image) return null;
  return /^https?:\/\//i.test(image) ? image : `${API_BASE_URL}/${image}`;
};

/* Format any value into something safe to render. Arrays / objects get
   stringified so a stray field from a future API change never crashes
   the page. */
const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

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
    return <LoadingState label="Loading your profile" />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
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

  /* Pull every field we know about out of the response so the screen
     reflects the API contract verbatim. Extra fields are still rendered
     via the "Raw API response" panel at the bottom. */
  const profileFields = [
    { label: 'ID',             value: profile?.id },
    { label: 'Name',           value: profile?.name },
    { label: 'Email',          value: profile?.email },
    { label: 'Image',          value: profile?.image },
    { label: 'Liked count',    value: profile?.liked_count },
    { label: 'Watched count',  value: profile?.watched_count },
    { label: 'Favorite genres', value: profile?.favorite_genres },
  ];

  const totals = stats?.totals ?? {};
  const statistics = Array.isArray(stats?.statistics) ? stats.statistics : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* ============================================================ */}
      {/* Header: avatar + name + email + actions                      */}
      {/* ============================================================ */}
      <header
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          padding: '1.5rem',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '7rem',
            height: '7rem',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#1c1c1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #3a3a3a',
          }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={profile?.name || 'Profile avatar'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ color: '#888' }}>No avatar</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
            My account
          </p>
          <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', color: '#fff' }}>
            {profile?.name || user?.full_name || 'Unknown user'}
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#aaa' }}>
            {profile?.email || user?.email}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                background: '#e11d48',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                background: 'transparent',
                color: '#ccc',
                border: '1px solid #444',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* Counters: liked / watched / favorites                        */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Activity counters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Liked dramas',     value: profile?.liked_count ?? 0,   icon: '♥' },
            { label: 'Watched dramas',   value: profile?.watched_count ?? 0, icon: '◉' },
            { label: 'Favorites',        value: favoritesCount,              icon: '★' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                padding: '1rem',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'rgba(225,29,72,0.1)',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
                  {card.label}
                </p>
                <p style={{ margin: '0.15rem 0 0', fontSize: '1.5rem', color: '#fff', fontWeight: 600 }}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* All raw profile fields                                       */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Profile fields (from GET /api/profile)
        </h2>
        <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <tbody>
              {profileFields.map((field, idx) => (
                <tr
                  key={field.label}
                  style={{ borderTop: idx === 0 ? 'none' : '1px solid #2a2a2a' }}
                >
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      width: '12rem',
                      color: '#888',
                      fontWeight: 500,
                      background: '#1a1a1a',
                      verticalAlign: 'top',
                    }}
                  >
                    {field.label}
                  </th>
                  <td style={{ padding: '0.75rem 1rem', color: '#fff', wordBreak: 'break-word' }}>
                    {field.label === 'Favorite genres' && Array.isArray(field.value) ? (
                      field.value.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {field.value.map((g) => (
                            <span
                              key={g}
                              style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                background: 'rgba(225,29,72,0.15)',
                                color: '#e11d48',
                                fontSize: '0.75rem',
                              }}
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '—'
                      )
                    ) : field.label === 'Image' && field.value ? (
                      <span style={{ color: '#9ca3af' }}>{formatValue(field.value)}</span>
                    ) : (
                      formatValue(field.value)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Top genres (from favorite_genres[])                          */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Your top genres
        </h2>
        {profile?.favorite_genres?.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.favorite_genres.map((g) => (
              <span
                key={g}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgba(225,29,72,0.1)',
                  color: '#e11d48',
                  fontSize: '0.8rem',
                }}
              >
                {g}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            No favorite genres yet.
          </p>
        )}
      </section>

      {/* ============================================================ */}
      {/* Genre statistics — totals                                    */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Activity totals (from GET /api/profile/genre-statistics)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total liked',    value: totals.liked    ?? 0 },
            { label: 'Total watched',  value: totals.watched  ?? 0 },
            { label: 'Total disliked', value: totals.disliked ?? 0 },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                padding: '1rem',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
                {card.label}
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', color: '#fff', fontWeight: 600 }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Genre statistics — per-genre breakdown                       */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Per-genre preference scores
        </h2>
        {statistics.length ? (
          <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  <th style={{ textAlign: 'left',  padding: '0.75rem 1rem', color: '#888', fontWeight: 500 }}>Genre</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#888', fontWeight: 500 }}>Score</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#888', fontWeight: 500 }}>Liked</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#888', fontWeight: 500 }}>Watched</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#888', fontWeight: 500 }}>Disliked</th>
                </tr>
              </thead>
              <tbody>
                {statistics.map((row, idx) => (
                  <tr key={row.genre} style={{ borderTop: idx === 0 ? 'none' : '1px solid #2a2a2a' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff' }}>{row.genre}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'right' }}>{row.score}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'right' }}>{row.liked}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'right' }}>{row.watched}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'right' }}>{row.disliked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            No genre activity yet.
          </p>
        )}
      </section>

      {/* ============================================================ */}
      {/* Raw API responses (debugging / verification)                 */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 0.75rem' }}>
          Raw API responses
        </h2>
        <details style={{ border: '1px solid #2a2a2a', borderRadius: '12px', padding: '0.75rem 1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#fff' }}>GET /api/profile response</summary>
          <pre style={{ margin: '0.75rem 0 0', padding: '0.75rem', background: '#0e0e0e', color: '#a7f3d0', borderRadius: '8px', overflow: 'auto', fontSize: '0.8rem' }}>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
        <details style={{ border: '1px solid #2a2a2a', borderRadius: '12px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
          <summary style={{ cursor: 'pointer', color: '#fff' }}>GET /api/profile/genre-statistics response</summary>
          <pre style={{ margin: '0.75rem 0 0', padding: '0.75rem', background: '#0e0e0e', color: '#a7f3d0', borderRadius: '8px', overflow: 'auto', fontSize: '0.8rem' }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </details>
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