import { forwardRef, useImperativeHandle, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import GenreBadge from '../ui/GenreBadge';
import RecommendationBadge from './RecommendationBadge';
import { parseGenres } from '../../utils/dramaHelpers';

const SWIPE_THRESHOLD = 110;
const ROTATION_FACTOR = 0.05;

const SwipeCard = forwardRef(
  ({ drama, depth = 0, isTop = false, matchScore, isBookmarked, onBookmark, onSwipe }, ref) => {
    const cardRef = useRef(null);
    const dragState = useRef({ startX: 0, startY: 0, dragging: false });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [exiting, setExiting] = useState(null);

    const genres = parseGenres(drama.genre);
    const isUpcoming = !drama.imdb_rating || drama.imdb_rating === 0;

    const commitExit = (direction) => {
      const exitX = direction === 'like' ? 600 : direction === 'dislike' ? -600 : 0;
      const exitY = direction === 'watched' ? -700 : 60;
      setExiting(direction);
      setOffset({ x: exitX, y: exitY });
      window.setTimeout(() => onSwipe(direction), 260);
    };

    useImperativeHandle(ref, () => ({
      triggerSwipe: (direction) => {
        if (exiting) return;
        commitExit(direction);
      },
    }));

    // Peek cards behind the top one — static, no interactivity.
    if (!isTop) {
      return (
        <div
          className="absolute inset-0 surface-card rounded-3xl overflow-hidden"
          style={{
            transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.045})`,
            zIndex: 10 - depth,
            opacity: 1 - depth * 0.18,
          }}
          aria-hidden="true"
        >
          <ImageWithSkeleton src={drama.banner_url || drama.poster} alt="" className="w-full h-full" />
          <div className="absolute inset-0 bg-background/40" />
        </div>
      );
    }

    const handlePointerDown = (e) => {
      if (exiting) return;
      dragState.current = { startX: e.clientX, startY: e.clientY, dragging: true };
      cardRef.current?.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e) => {
      if (!dragState.current.dragging) return;
      setOffset({
        x: e.clientX - dragState.current.startX,
        y: e.clientY - dragState.current.startY,
      });
    };

    const handlePointerUp = () => {
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;

      const { x, y } = offset;
      if (x > SWIPE_THRESHOLD) commitExit('like');
      else if (x < -SWIPE_THRESHOLD) commitExit('dislike');
      else if (y < -SWIPE_THRESHOLD) commitExit('watched');
      else setOffset({ x: 0, y: 0 });
    };

    const rotation = offset.x * ROTATION_FACTOR;
    const likeOpacity = Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1);
    const dislikeOpacity = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 1);
    const watchedOpacity = Math.min(Math.max(-offset.y / SWIPE_THRESHOLD, 0), 1);

    return (
      <div
        ref={cardRef}
        className="absolute inset-0 surface-card rounded-3xl overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
          transition: dragState.current.dragging ? 'none' : 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 20,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="relative w-full h-full">
          <ImageWithSkeleton src={drama.banner_url || drama.poster} alt={drama.title} className="w-full h-full" />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/30 to-transparent" />

          {/* Swipe feedback overlays */}
          <div
            className="absolute inset-0 bg-emerald-500/25 flex items-start justify-end p-6"
            style={{ opacity: likeOpacity }}
            aria-hidden="true"
          >
            <span className="border-2 border-emerald-400 text-emerald-300 font-display font-bold text-xl px-3 py-1 rounded-lg rotate-12 uppercase tracking-wider">
              Like
            </span>
          </div>
          <div
            className="absolute inset-0 bg-accent/25 flex items-start justify-start p-6"
            style={{ opacity: dislikeOpacity }}
            aria-hidden="true"
          >
            <span className="border-2 border-accent text-accent font-display font-bold text-xl px-3 py-1 rounded-lg -rotate-12 uppercase tracking-wider">
              Pass
            </span>
          </div>
          <div
            className="absolute inset-0 bg-sky-500/20 flex items-end justify-center p-6"
            style={{ opacity: watchedOpacity }}
            aria-hidden="true"
          >
            <span className="border-2 border-sky-400 text-sky-300 font-display font-bold text-xl px-3 py-1 rounded-lg uppercase tracking-wider">
              Watched
            </span>
          </div>

          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {isUpcoming ? (
              <span className="bg-background/70 backdrop-blur-sm text-text-secondary text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-md">
                Upcoming
              </span>
            ) : (
              <span className="bg-background/70 backdrop-blur-sm text-text-primary text-xs font-medium px-2.5 py-1 rounded-md">
                ★ {drama.imdb_rating}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Save for later'}
              aria-pressed={isBookmarked}
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors duration-300
                ${isBookmarked ? 'bg-accent text-white' : 'bg-background/70 text-text-secondary hover:text-text-primary'}`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
          </div>

          <RecommendationBadge score={matchScore} className="absolute top-4 left-4" />

          <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-3">
            <div>
              <Link
                to={`/drama/${drama.drama_id}`}
                onPointerDown={(e) => e.stopPropagation()}
                className="font-display text-2xl font-semibold text-text-primary leading-tight hover:text-accent transition-colors duration-300"
              >
                {drama.title}
              </Link>
              <p className="text-text-tertiary text-xs mt-1">{drama.release_year}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 3).map((g) => (
                <GenreBadge key={g} genre={g} />
              ))}
            </div>

            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{drama.storyline}</p>

            {drama.stars && (
              <p className="text-text-tertiary text-xs">
                <span className="text-text-secondary">Starring</span> {drama.stars}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SwipeCard.displayName = 'SwipeCard';

export default memo(SwipeCard);