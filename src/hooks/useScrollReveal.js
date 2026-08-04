/* src/hooks/useScrollReveal.js
   Replaces the vanilla IntersectionObserver scroll-reveal script from the
   Stitch mock with a reusable hook. Respects prefers-reduced-motion by
   skipping the animation entirely rather than just shortening it.

   @see docs/PROJECT.md#sec-proj-ui-plan */

import { useEffect, useRef, useState } from 'react';

const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // NOTE: when the user prefers reduced motion, we skip the animation
    // entirely and just mark the element visible. This is the right call
    // for accessibility — users who get dizzy from motion don't want a
    // "shorter" fade; they want no fade at all.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // NOTE: once an element has been revealed, we disconnect the observer
    // entirely. A reveal should be a one-time event as the user scrolls
    // down — without disconnect(), the observer would keep firing on
    // every scroll in and out of view, which is wasteful and can cause
    // the animation to replay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
};

export default useScrollReveal;