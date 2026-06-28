/* src/components/home/TrendingSection.jsx */
import SectionHeader from '../ui/SectionHeader';
import DramaPosterCard from '../drama/DramaPosterCard';
import SkeletonCard from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';

const TrendingSection = ({ items, loading }) => {
  return (
    <section className="mb-14" aria-labelledby="trending-heading">
      <div className="px-5 md:px-16">
        <SectionHeader id="trending-heading" eyebrow="지금 인기 · TRENDING NOW" title="Trending Now" />
      </div>

      {!loading && items.length === 0 ? (
        <div className="px-5 md:px-16">
          <EmptyState
            icon="trending_up"
            title="Nothing trending in this genre yet"
            description="Try a different genre or check back soon."
          />
        </div>
      ) : (
        <div
          role="list"
          aria-label="Trending dramas"
          className="flex overflow-x-auto gap-4 no-scrollbar px-5 md:px-16 pb-2 scroll-px-5 snap-x"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((drama, i) => (
                <div role="listitem" key={drama.drama_id} className="snap-start">
                  {/* Rank numerals are honest here — this list really is
                      ordered by rating, so the marker carries information. */}
                  <DramaPosterCard drama={drama} rank={i + 1} />
                </div>
              ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;