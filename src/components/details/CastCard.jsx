import { hashToHue, getInitials } from '../../utils/dramaHelpers';

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