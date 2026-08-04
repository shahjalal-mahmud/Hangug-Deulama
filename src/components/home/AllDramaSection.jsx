/* src/components/home/AllDramaSection.jsx
   Full-catalog browse grid anchoring the bottom of the homepage — the
   "there's more than what's in the rails above" section. Reuses the
   existing grid-style DramaCard (poster + title + rating + genre chips)
   since that card, not the rail card, is built for a dense grid layout.
   Paginates client-side with a Load More button; the whole catalog is
   already fetched once by DramaContext (limit=100), so this just reveals
   more of what's already in memory rather than re-fetching.

   @see docs/ARCHITECTURE.md#sec-drama-context
   @see docs/components/drama/DramaCard.jsx
   @see docs/api/dramas.js (listDramas, limit=100) */

import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import DramaCard from '../drama/DramaCard';
import SkeletonCard from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';

const PAGE_SIZE = 12;

const AllDramaSection = ({ items, loading }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section className="px-5 md:px-16 mb-20" aria-labelledby="all-dramas-heading">
      <SectionHeader
        id="all-dramas-heading"
        eyebrow="전체 목록 · BROWSE ALL"
        title="All Dramas"
        subtitle={!loading ? `${items.length} titles in the library` : undefined}
      />

      {!loading && items.length === 0 ? (
        <EmptyState
          icon="theaters"
          title="No dramas found"
          description="The catalog is empty right now. Check back soon."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : visibleItems.map((drama) => <DramaCard key={drama.drama_id} drama={drama} />)}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-9">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-7 py-2.5 rounded-full border border-border text-text-primary text-sm font-medium
                           hover:bg-surface-container hover:border-border-strong transition-colors duration-300
                           ease-cinematic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AllDramaSection;