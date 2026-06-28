/* src/components/home/HeroSection.jsx */
import { useEffect, useState } from 'react';
import { useDrama } from '../../context/DramaContext';
import { parseGenres } from '../../utils/dramaHelpers';
import Button from '../ui/Button';
import GenreBadge from '../ui/GenreBadge';
import SpotlightRail from './SpotlightRail';

const ROTATE_MS = 7000;

/* The page's one bold move: a rotating backdrop hero instead of a flat
   text block. Auto-advances through the top-rated pool, pauses on hover,
   and is fully driven by a thumbnail rail so it never feels like a
   black-box carousel. */
const HeroSection = ({ items = [], loading }) => {
  const { toggleBookmark, getDramaStatus } = useDrama();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const greeting = new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  // Clamp index if the underlying list shrinks (e.g. on first load).
  const active = items[index] || items[0];

  if (loading || !active) {
    return (
      <section className="px-5 md:px-16 mb-14">
        <div
          className="h-110 sm:h-130 md:h-150 rounded-2xl bg-surface-elevated animate-pulse"
          aria-hidden="true"
        />
      </section>
    );
  }

  const genres = parseGenres(active.genre);
  const status = getDramaStatus(active.drama_id);

  return (
    <section className="px-5 md:px-16 mb-14" aria-label="Spotlight">
      <p className="eyebrow text-text-tertiary mb-3">
        {greeting} <span className="text-text-tertiary/50 mx-1">·</span>
        <span className="text-accent">지금 주목할 드라마 · SPOTLIGHT</span>
      </p>

      <div
        className="relative h-110 sm:h-130 md:h-150 rounded-2xl overflow-hidden surface-card film-grain"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          key={active.drama_id}
          src={active.banner_url || active.poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-hero-fade"
        />

        {/* Two-axis gradient: enough contrast for text bottom-left,
            still lets the image breathe top-right. */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-background/5" />
        <div className="absolute inset-0 bg-linear-to-r from-background/75 via-background/15 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {active.imdb_rating && (
              <span className="bg-gold-soft text-gold text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide">
                ★ {active.imdb_rating}
              </span>
            )}
            <span className="text-text-tertiary text-xs">{active.release_year}</span>
            {genres.slice(0, 2).map((g) => (
              <GenreBadge key={g} genre={g} />
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-text-primary leading-[1.05] max-w-2xl">
            {active.title}
          </h1>

          {active.stars && (
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mt-3 line-clamp-2">
              {active.stars}
            </p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button to={`/drama/${active.drama_id}`} size="lg">
              View Details
            </Button>
            <button
              type="button"
              onClick={() => toggleBookmark(active.drama_id)}
              aria-pressed={status.isBookmarked}
              aria-label={
                status.isBookmarked
                  ? `Remove ${active.title} from my list`
                  : `Add ${active.title} to my list`
              }
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm
                         flex items-center justify-center transition-colors duration-300 ease-cinematic
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <span className="material-symbols-outlined text-text-primary text-xl leading-none">
                {status.isBookmarked ? 'check' : 'add'}
              </span>
            </button>
          </div>

          <SpotlightRail items={items} activeIndex={index} onSelect={setIndex} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;