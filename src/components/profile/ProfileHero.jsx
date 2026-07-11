/* src/components/profile/ProfileHero.jsx
   Identity header. Deliberately reuses .glass-overlay + .film-grain — the
   same treatment the marketing hero uses elsewhere in the app — so the
   profile page reads as the same product rather than a bolted-on admin
   screen. The avatar ring reuses the exact primary→secondary gradient
   from .btn-gradient, tying the page's one accent together. Avatar
   fallback (missing image or a broken backend URL) is handled centrally
   by the Avatar component. */

import Avatar from '../ui/Avatar';

const ProfileHero = ({ name, email, avatarSrc, topGenreLabel, onEdit, onLogout }) => (
  <header className="relative overflow-hidden rounded-2xl border border-border film-grain">
    <div className="glass-overlay absolute inset-0" />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(60% 90% at 100% 0%, color-mix(in srgb, var(--color-secondary) 12%, transparent) 0%, transparent 70%)',
      }}
    />

    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
      <div
        className="w-28 h-28 rounded-full p-0.75 flex-none"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-surface">
          <Avatar src={avatarSrc} alt={name} className="w-full h-full rounded-full" />
        </div>
      </div>

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="eyebrow mb-1">My account</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary truncate">
          {name || 'Unknown user'}
        </h1>
        <p className="text-sm text-text-secondary mt-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
          <span>{email}</span>
          {topGenreLabel && (
            <>
              <span className="text-text-tertiary">·</span>
              <span className="inline-flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                {topGenreLabel} enthusiast
              </span>
            </>
          )}
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
          <button type="button" onClick={onEdit} className="btn-gradient btn-gradient-sm">
            Edit profile
          </button>
          <button type="button" onClick={onLogout} className="btn-gradient-ghost btn-gradient-sm">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default ProfileHero;