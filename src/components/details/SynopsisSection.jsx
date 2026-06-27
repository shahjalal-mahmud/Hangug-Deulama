import { useState, useRef, useEffect } from 'react';
import SectionHeader from '../ui/SectionHeader';

const COLLAPSED_HEIGHT = 84; // px, roughly 3-4 lines at body-md

const SynopsisSection = ({ storyline }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef(null);

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