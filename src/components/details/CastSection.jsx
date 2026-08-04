/* src/components/details/CastSection.jsx
   Horizontally-scrolling cast carousel on the details page. Renders one
   CastCard per name; small enough that we always use the same row of
   initials-and-hue avatars (see CastCard) since the catalog has no
   actor photos.

   @see docs/components/details/CastCard.jsx */

import SectionHeader from '../ui/SectionHeader';
import CastCard from './CastCard';

const CastSection = ({ stars }) => {
  if (!stars.length) return null;

  return (
    <div>
      <SectionHeader id="cast-heading" title="Cast" />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {stars.map((name) => (
          <CastCard key={name} name={name} />
        ))}
      </div>
    </div>
  );
};

export default CastSection;