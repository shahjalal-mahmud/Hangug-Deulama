import SectionHeader from '../ui/SectionHeader';
import LandscapeDramaCard from '../drama/LandscapeDramaCard';
import SkeletonCard from '../ui/SkeletonCard';

const ContinueWatching = ({ items, loading }) => {
  // Nothing in progress and we're not loading — just don't show the section.
  if (!loading && items.length === 0) return null;

  return (
    <section className="px-5 md:px-16 mb-14" aria-labelledby="continue-watching-heading">
      <SectionHeader
        id="continue-watching-heading"
        title="Continue Watching"
        actionLabel="View All"
        actionTo="/activity"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="landscape" />)
          : items.map((drama) => <LandscapeDramaCard key={drama.drama_id} drama={drama} />)}
      </div>
    </section>
  );
};

export default ContinueWatching;