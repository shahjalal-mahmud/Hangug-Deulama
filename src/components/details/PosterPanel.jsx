/* src/components/details/PosterPanel.jsx
   Poster-only left column. No overlay, no gradient, no text on top —
   just the artwork, presented cleanly. Sticks in place on desktop so
   it stays in view as the details column scrolls.

   @see docs/components/details/DetailsHeader.jsx
   @see docs/utils/dramaHelpers.js (pickImage) */

import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import { pickImage } from '../../utils/dramaHelpers';

const PosterPanel = ({ drama }) => (
  <div className="md:sticky md:top-28">
    <div className="aspect-2/3 w-full max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden
                     border border-border-strong shadow-2xl shadow-black/50">
      <ImageWithSkeleton
        src={pickImage(drama)}
        alt={`${drama.title} poster`}
        className="w-full h-full"
      />
    </div>
  </div>
);

export default PosterPanel;