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
  bookmarkedDramas,
}) => {
  const topCardRef = useRef(null);

  const triggerSwipe = useCallback((direction) => {
    topCardRef.current?.triggerSwipe(direction);
  }, []);

  const bookmarkTop = useCallback(() => {
    if (queue[0]) onBookmark(queue[0].drama_id);
  }, [queue, onBookmark]);

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
      <EmptyState
        icon="auto_awesome"
        title="You're all caught up"
        description="No dramas match your current filters. Try a different genre or clear your search."
      />
    );
  }

  const stack = queue.slice(0, STACK_SIZE);
  const topDrama = stack[0];

  return (
    <div className="flex flex-col items-center gap-8 pb-10">
      <SwipeProgress decided={totalDecided} total={totalDramas} />

      <div className="relative w-full max-w-sm h-[560px]">
        {stack.map((drama, i) => (
          <SwipeCard
            key={drama.drama_id}
            ref={i === 0 ? topCardRef : null}
            drama={drama}
            depth={i}
            isTop={i === 0}
            matchScore={getMatchScore(drama, likedGenres)}
            isBookmarked={bookmarkedDramas.includes(drama.drama_id)}
            onBookmark={() => onBookmark(drama.drama_id)}
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
        isBookmarked={bookmarkedDramas.includes(topDrama?.drama_id)}
      />

      <KeyboardHints />
    </div>
  );
};

export default SwipeDeck;