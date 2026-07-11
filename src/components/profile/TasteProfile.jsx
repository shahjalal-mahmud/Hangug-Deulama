/* src/components/profile/TasteProfile.jsx
   The page's signature element: a ranked "taste profile" built from
   GET /api/profile/genre-statistics. Order is real here (sorted by
   score), so numbering the rows encodes actual information rather than
   decorating a flat list. Bar fill reuses the primary→secondary gradient
   already established by .btn-gradient / .match-badge elsewhere in the
   app, so the chart reads as part of the same visual system. */

const titleCase = (s) => (s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : s);

const TotalPill = ({ icon, label, value, className }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
    <span className="material-symbols-outlined text-[15px]">{icon}</span>
    {value} {label}
  </span>
);

const GenreRow = ({ rank, genre, score, liked, watched, disliked, maxScore, isFavorite }) => {
  const widthPct = maxScore > 0 ? Math.max(4, Math.round((score / maxScore) * 100)) : 0;
  const isTop = rank <= 3;

  return (
    <div className="py-3.5 first:pt-0 last:pb-0 border-b border-border-subtle last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-none text-xs font-semibold ${
            isTop ? 'bg-secondary/15 text-secondary' : 'bg-surface-container-high text-text-tertiary'
          }`}
        >
          {isTop ? <span className="material-symbols-outlined text-[15px]">emoji_events</span> : rank}
        </div>

        <span className="font-medium text-text-primary truncate">{titleCase(genre)}</span>

        {isFavorite && (
          <span className="material-symbols-outlined text-[15px] text-secondary" title="One of your favorite genres">
            star
          </span>
        )}

        <span className="ml-auto font-display text-sm font-semibold text-text-primary tabular-nums">
          {score}
        </span>
      </div>

      <div className="h-2 rounded-full bg-surface-container-high mt-2.5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${widthPct}%`,
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          }}
        />
      </div>

      <div className="flex items-center gap-4 mt-2 pl-10">
        <TotalPill icon="favorite" label="liked" value={liked ?? 0} className="text-primary" />
        <TotalPill icon="visibility" label="watched" value={watched ?? 0} className="text-tertiary" />
        <TotalPill icon="close" label="disliked" value={disliked ?? 0} className="text-danger" />
      </div>
    </div>
  );
};

const TasteProfile = ({ statistics, totals, favoriteGenres = [] }) => {
  const ranked = [...statistics].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const maxScore = ranked.reduce((m, r) => Math.max(m, r.score ?? 0), 0);
  const favoriteSet = new Set(favoriteGenres.map((g) => g.toLowerCase()));

  return (
    <section className="surface-card rounded-2xl p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
        <div>
          <p className="eyebrow mb-1">Taste profile</p>
          <h2 className="font-display text-xl font-semibold text-text-primary">Your genre affinity</h2>
        </div>
        {(totals?.liked || totals?.watched || totals?.disliked) ? (
          <div className="flex items-center gap-4">
            <TotalPill icon="favorite" label="liked" value={totals.liked ?? 0} className="text-primary" />
            <TotalPill icon="visibility" label="watched" value={totals.watched ?? 0} className="text-tertiary" />
            <TotalPill icon="close" label="disliked" value={totals.disliked ?? 0} className="text-danger" />
          </div>
        ) : null}
      </div>
      <p className="text-sm text-text-secondary mb-5">
        Ranked by how strongly each genre matches what you like, watch, and skip.
      </p>

      {ranked.length ? (
        <div>
          {ranked.map((row, idx) => (
            <GenreRow
              key={row.genre}
              rank={idx + 1}
              genre={row.genre}
              score={row.score}
              liked={row.liked}
              watched={row.watched}
              disliked={row.disliked}
              maxScore={maxScore}
              isFavorite={favoriteSet.has(String(row.genre).toLowerCase())}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <span className="material-symbols-outlined text-3xl text-text-tertiary">auto_graph</span>
          <p className="text-text-primary font-medium mt-2">No genre activity yet</p>
          <p className="text-text-tertiary text-sm mt-1 max-w-xs mx-auto">
            Like, watch, or skip a few dramas and your taste profile will build itself here.
          </p>
        </div>
      )}
    </section>
  );
};

export default TasteProfile;