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