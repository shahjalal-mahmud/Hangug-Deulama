/* src/components/home/HeroSection.jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import * as dramasApi from '../../api/dramas';
import { parseGenres, pickImage } from '../../utils/dramaHelpers';

const ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 50;

/* The page's one bold move: a full-bleed, edge-to-edge spotlight banner
   that sits behind the translucent navbar (rather than a boxed card
   below it), auto-advancing through the real Top 10 highest-rated
   dramas pulled straight from the backend. Every control — arrows,
   swipe, arrow keys — resets the same 5s clock, so the next slide is
   never a surprise. */
const HeroSection = ({ items: fallbackItems = [], loading: catalogLoading }) => {
  const [slides, setSlides] = useState([]);
  const [fetchState, setFetchState] = useState('loading'); // loading | success | error
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(null);
  const sectionRef = useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const greeting = new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  /* Pull the real Top 10 by rating from the backend. Falls back to
     whatever the catalog already handed us (first 10) if the request
     fails, so the hero never just goes blank. */
  useEffect(() => {
    let cancelled = false;
    const fetchSpotlight = async () => {
      try {
        const res = await dramasApi.listDramas({ limit: 10, sort: 'imdb_rating', order: 'desc' });
        if (cancelled) return;
        const list = Array.isArray(res.data?.dramas) ? res.data.dramas : [];
        if (list.length) {
          setSlides(list);
          setFetchState('success');
        } else {
          setFetchState('error');
        }
      } catch {
        if (!cancelled) setFetchState('error');
      }
    };
    fetchSpotlight();
    return () => {
      cancelled = true;
    };
  }, []);

  // If the backend call failed, use the catalog's own items as soon as
  // they're available (covers both "failed immediately" and "catalog
  // was still loading when it failed" cases).
  useEffect(() => {
    if (fetchState === 'error' && slides.length === 0 && fallbackItems.length) {
      setSlides(fallbackItems.slice(0, 10));
    }
  }, [fetchState, fallbackItems, slides.length]);

  const total = slides.length;
  const active = slides[index] || null;

  const goTo = useCallback(
    (next) => {
      if (total <= 1) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Every change to `index` — auto, manual, swipe, keyboard — restarts
  // this exact 5s window, so the next advance is always predictable.
  useEffect(() => {
    if (paused || total <= 1 || reducedMotion) return;
    const timer = setTimeout(() => goNext(), ROTATE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, total, reducedMotion]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  const genres = useMemo(() => (active ? parseGenres(active) : []), [active]);

  const showSkeleton = (catalogLoading || fetchState === 'loading') && total === 0;

  if (showSkeleton) {
    return (
      <section className="relative w-full h-[78vh] min-h-[520px] md:h-screen md:min-h-0 overflow-hidden">
        <div className="absolute inset-0 bg-bg-elevated animate-pulse" aria-hidden="true" />
      </section>
    );
  }

  if (!active) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[78vh] min-h-[520px] md:h-screen md:min-h-0 overflow-hidden select-none
                 focus-visible:outline-none"
      aria-roledescription="carousel"
      aria-label="Top rated dramas spotlight"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Screen-reader announcement of the current slide, independent of
          the visual crossfade below. */}
      <p className="sr-only" aria-live="polite">
        {`Showing ${index + 1} of ${total}: ${active.title}`}
      </p>

      {/* Crossfading backdrop stack */}
      {slides.map((drama, i) => (
        <div
          key={drama.drama_id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-[1100ms] ease-cinematic',
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
          aria-hidden={i !== index}
        >
          <img
            src={pickImage(drama)}
            alt=""
            className={clsx(
              'w-full h-full object-cover',
              i === index && !reducedMotion && 'animate-ken-burns'
            )}
          />
        </div>
      ))}

      {/* Legibility gradients: darken the bottom for the text block, the
          top for the transparent navbar, a soft left wash for balance. */}
      <div className="absolute inset-0 z-20 bg-linear-to-t from-bg-base via-bg-base/45 to-transparent" />
      <div className="absolute inset-0 z-20 bg-linear-to-b from-black/55 via-black/15 to-transparent h-48" />
      <div className="absolute inset-0 z-20 bg-linear-to-r from-bg-base/70 via-transparent to-transparent" />

      {/* Prev / Next controls */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous drama"
            className="absolute z-30 left-3 md:left-6 top-1/2 -translate-y-1/2
                       w-10 h-10 md:w-12 md:h-12 rounded-full
                       bg-black/30 backdrop-blur-md border border-white/10 text-text-primary
                       flex items-center justify-center
                       hover:bg-black/50 hover:scale-105 active:scale-95
                       transition-all duration-300 ease-cinematic
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next drama"
            className="absolute z-30 right-3 md:right-6 top-1/2 -translate-y-1/2
                       w-10 h-10 md:w-12 md:h-12 rounded-full
                       bg-black/30 backdrop-blur-md border border-white/10 text-text-primary
                       flex items-center justify-center
                       hover:bg-black/50 hover:scale-105 active:scale-95
                       transition-all duration-300 ease-cinematic
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </>
      )}

      {/* Content overlay */}
      <div className="absolute left-0 bottom-0 z-30 w-full md:max-w-3xl px-5 sm:px-8 md:px-14 lg:px-16 pb-8 sm:pb-10 md:pb-16 lg:pb-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-text-tertiary mb-3">
            {greeting} <span className="text-text-tertiary/50 mx-1">·</span>
            <span className="text-secondary">지금 주목할 드라마 · SPOTLIGHT</span>
          </p>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1
                         text-[11px] font-bold uppercase tracking-wider
                         bg-linear-to-r from-primary via-primary-container to-secondary
                         bg-clip-text text-transparent shadow-lg"
            >
              <span className="material-symbols-outlined text-[14px]">emoji_events</span>
              Top {index + 1} Rated
            </span>
            {active.imdb_rating && (
              <span className="bg-gold-soft text-gold text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide">
                ★ {active.imdb_rating}
              </span>
            )}
            <span className="text-text-tertiary text-xs">{active.release_year}</span>
            {genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-1 rounded-md bg-white/5 border border-border
                           text-[10px] font-medium uppercase tracking-wider text-text-secondary"
              >
                {g}
              </span>
            ))}
          </div>

          <h1
            key={active.drama_id}
            className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-text-primary
                       leading-[1.05] animate-fade-up"
          >
            {active.title}
          </h1>

          {active.stars && (
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mt-3 line-clamp-2">
              {active.stars}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;