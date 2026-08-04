/* src/components/home/GenreRow.jsx
   Generic horizontal rail for a single genre — used for every genre
   section on the homepage (Rom-Com, Historical, Thriller, Fantasy,
   Action, Horror, Comedy). Reuses the exact same DramaPosterCard as
   Trending Now so the whole homepage feels like one consistent system,
   the way Netflix's row components all share one card.

   @see docs/components/home/TrendingSection.jsx
   @see docs/components/drama/DramaPosterCard.jsx */

import SectionHeader from '../ui/SectionHeader';
import DramaPosterCard from '../drama/DramaPosterCard';
import SkeletonCard from '../ui/SkeletonCard';

const GenreRow = ({ id, eyebrow, title, items, loading, actionTo }) => {
  // Keep the homepage clean and curated — if a genre has no matches in
  // the catalog yet, skip the row entirely rather than showing an empty
  // shelf (this is what Netflix does too).
  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="mb-14" aria-labelledby={id}>
      <div className="px-5 md:px-16">
        <SectionHeader
          id={id}
          eyebrow={eyebrow}
          title={title}
          actionLabel={actionTo ? 'View All' : undefined}
          actionTo={actionTo}
        />
      </div>

      <div
        role="list"
        aria-label={`${title} dramas`}
        className="flex overflow-x-auto gap-4 no-scrollbar px-5 md:px-16 pb-2 scroll-px-5 snap-x"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((drama) => (
              <div role="listitem" key={drama.drama_id} className="snap-start">
                <DramaPosterCard drama={drama} />
              </div>
            ))}
      </div>
    </section>
  );
};

export default GenreRow;