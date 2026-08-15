 /* src/components/discover/SwipeDeck.jsx
   The main swipe experience on the Discover page. Orchestrates a
   stack of SwipeCards (the top one is interactive, the others are
   static "peeking" decorations), the action button row, the
   progress bar, and the keyboard shortcuts.

   @see docs/ARCHITECTURE.md#sec-drama-context
   @see docs/components/discover/SwipeCard.jsx */

import { useRef, useEffect, useCallback } from 'react';
import SwipeCard from './SwipeCard';
import ActionButtons from './ActionButtons';
import SwipeProgress from './SwipeProgress';
import KeyboardHints from './KeyboardHints';
import EmptyState from '../ui/EmptyState';
import { getMatchScore } from '../../utils/dramaHelpers';

const STACK_SIZE = 3;

const SwipeDeck = ({
  queue,
  likedGenres,
  totalDecided,
  totalDramas,
  onLike,
  onDislike,
  onWatched,
  onBookmark,
  onFavorite,
  bookmarkedDramas,
  favoriteDramas,
}) => {
  const topCardRef = useRef(null);

  // NOTE: triggerSwipe reaches through the ref to call the top card's
  // imperative method. We use a ref-funnel instead of a callback prop
  // because the swipe animation (translate + fade-out) lives inside
  // SwipeCard, and the buttons above shouldn't have to re-implement
  // it just to fire a programmatic swipe.
  const triggerSwipe = useCallback(
    (direction) => {
      if (!queue.length) return;
      topCardRef.current?.triggerSwipe(direction);
    },
    [queue.length]
  );

  const bookmarkTop = useCallback(() => {
    if (queue[0]) onBookmark(queue[0].drama_id);
  }, [queue, onBookmark]);

  const favoriteTop = useCallback(() => {
    if (queue[0]) onFavorite(queue[0].drama_id);
  }, [queue, onFavorite]);

  // NOTE: the keyboard handler is mounted on `window` (not on the
  // SwipeCard) so the user can press arrow keys without first clicking
  // the card. We bail out early if the user is typing in an input
  // or select — otherwise every keystroke would also swipe.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'ArrowRight') triggerSwipe('like');
      else if (e.key === 'ArrowLeft') triggerSwipe('dislike');
      else if (e.key === 'ArrowUp') triggerSwipe('watched');
      else if (e.key.toLowerCase() === 'b') bookmarkTop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerSwipe, bookmarkTop]);

  if (!queue.length) {
    return (
      <div className="py-6">
        <EmptyState
          icon="auto_awesome"
          title="You're all caught up"
          description="You've been through every drama in the catalog. Check back soon for new additions."
        />
      </div>
    );
  }

  // NOTE: `stack` is the top 3 cards (the front one is interactive, the
  // other two are decorative peeks behind it). Rendering the rest of
  // the queue would be wasted DOM — the user only ever sees the top 3.
  const stack = queue.slice(0, STACK_SIZE);
  const topDrama = stack[0];

  return (
    <div className="flex flex-col items-center gap-7 pb-14">
      <SwipeProgress decided={totalDecided} total={totalDramas} remaining={queue.length} />

      <div className="relative w-full max-w-sm h-130 sm:h-140">
        {stack.map((drama, i) => (
          <SwipeCard
            key={drama.drama_id}
            ref={i === 0 ? topCardRef : null}
            drama={drama}
            depth={i}
            isTop={i === 0}
            matchScore={getMatchScore(drama, likedGenres)}
            isBookmarked={bookmarkedDramas.includes(drama.drama_id)}
            isFavorited={favoriteDramas.includes(drama.drama_id)}
            onBookmark={() => onBookmark(drama.drama_id)}
            onFavorite={() => onFavorite(drama.drama_id)}
            onSwipe={(direction) => {
              if (direction === 'like') onLike(drama.drama_id);
              else if (direction === 'dislike') onDislike(drama.drama_id);
              else if (direction === 'watched') onWatched(drama.drama_id);
            }}
          />
        ))}
      </div>

      <ActionButtons
        onDislike={() => triggerSwipe('dislike')}
        onWatched={() => triggerSwipe('watched')}
        onLike={() => triggerSwipe('like')}
        onBookmark={bookmarkTop}
        onFavorite={favoriteTop}
        isBookmarked={bookmarkedDramas.includes(topDrama?.drama_id)}
        isFavorited={favoriteDramas.includes(topDrama?.drama_id)}
      />

      <KeyboardHints />
    </div>
  );
};

export default SwipeDeck;