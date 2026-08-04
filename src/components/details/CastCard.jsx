/* src/components/details/CastCard.jsx
   One entry in the cast carousel. Renders a colored circle with the
   actor's initials (since the catalog has no actor photos), with the
   background hue deterministically derived from the name so the same
   actor always shows up in the same color across the app.

   @see docs/utils/dramaHelpers.js (hashToHue, getInitials)
   @see docs/components/details/CastSection.jsx */

import { hashToHue, getInitials } from '../../utils/dramaHelpers';

// NOTE: hashing the name into a hue means we never need to ask a
// designer to pick colors per actor. The trade-off is that two
// similarly-named actors could clash — acceptable for a small
// catalog, and we can revisit once real photos are available.
const CastCard = ({ name }) => {
  const hue = hashToHue(name);

  return (
    <div className="flex-none w-24 text-center">
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2
                   border border-border-strong"
        style={{ backgroundColor: `hsl(${hue}, 28%, 18%)`, color: `hsl(${hue}, 60%, 78%)` }}
        aria-hidden="true"
      >
        <span className="font-display text-lg font-semibold">{getInitials(name)}</span>
      </div>
      <p className="text-text-primary text-xs font-medium leading-tight line-clamp-2">{name}</p>
    </div>
  );
};

export default CastCard;