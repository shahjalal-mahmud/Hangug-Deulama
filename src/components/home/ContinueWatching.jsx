/* src/components/home/ContinueWatching.jsx */
import SectionHeader from '../ui/SectionHeader';
import LandscapeDramaCard from '../drama/LandscapeDramaCard';
import SkeletonCard from '../ui/SkeletonCard';
import { useAuth } from '../../context/AuthContext';

const ContinueWatching = ({ items, loading }) => {
  const { isAuthenticated } = useAuth();

  /* This rail is meaningful only for signed-in users — it surfaces
     dramas the user hasn't yet decided on, framed as "stuff you started".
     Guests get nothing here so we don't mislead them with a fake progress
     bar on shows they've never opened. */
  if (!isAuthenticated) return null;
  if (!loading && items.length === 0) return null;

  return (
    <section className="px-5 md:px-16 mb-14" aria-labelledby="continue-watching-heading">
      <SectionHeader
        id="continue-watching-heading"
        eyebrow="이어보기 · RESUME"
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