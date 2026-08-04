/* src/components/details/SynopsisSection.jsx
   The storyline paragraph with a "Read more" / "Read less" toggle for
   long descriptions. We measure the text element's natural height and
   only show the toggle when the synopsis actually overflows the
   collapsed cap.

   @see docs/components/ui/SectionHeader.jsx
   @see docs/pages/DramaDetails.jsx */

import { useState, useRef, useEffect } from 'react';
import SectionHeader from '../ui/SectionHeader';

const COLLAPSED_HEIGHT = 84; // px, roughly 3-4 lines at body-md

const SynopsisSection = ({ storyline }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef(null);

  // NOTE: scrollHeight is the natural (un-clipped) height of the
  // paragraph. We compare it to COLLAPSED_HEIGHT + a 4px buffer to
  // decide whether the synopsis actually overflows. Without this
  // measurement we'd always render a "Read more" button even on
  // short synopses, which is dead UI.
  useEffect(() => {
    if (textRef.current) {
      setOverflows(textRef.current.scrollHeight > COLLAPSED_HEIGHT + 4);
    }
  }, [storyline]);

  return (
    <div>
      <SectionHeader id="synopsis-heading" title="Synopsis" />
      <p
        ref={textRef}
        className="text-text-secondary leading-relaxed transition-all duration-500 ease-cinematic overflow-hidden"
        style={{ maxHeight: expanded ? '1000px' : `${COLLAPSED_HEIGHT}px` }}
      >
        {storyline}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-accent text-xs font-medium uppercase tracking-wider mt-2
                     hover:underline focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent/60 rounded"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default SynopsisSection;