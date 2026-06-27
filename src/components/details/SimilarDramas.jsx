import SectionHeader from '../ui/SectionHeader';
import DramaPosterCard from '../drama/DramaPosterCard';
import EmptyState from '../ui/EmptyState';

const SimilarDramas = ({ dramas }) => (
  <div>
    <SectionHeader id="similar-heading" title="More Like This" />
    {dramas.length ? (
      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
        {dramas.map((d) => (
          <DramaPosterCard key={d.drama_id} drama={d} />
        ))}
      </div>
    ) : (
      <EmptyState icon="movie_filter" title="Nothing similar yet" description="We couldn't find other titles sharing this genre." />
    )}
  </div>
);

export default SimilarDramas;