/* src/components/home/SpotlightRail.jsx */
/* Thumbnail selector beneath the hero — makes the rotation transparent
   and user-controllable instead of a black-box auto-carousel. */
const SpotlightRail = ({ items, activeIndex, onSelect }) => {
  if (!items || items.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Featured dramas"
      className="flex items-center gap-3 mt-7 overflow-x-auto no-scrollbar"
    >
      {items.map((drama, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={drama.drama_id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show ${drama.title}`}
            onClick={() => onSelect(i)}
            className={`relative flex-none w-12 sm:w-14 aspect-2/3 rounded-lg overflow-hidden
                       transition-all duration-300 ease-cinematic focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent/60
                       ${active ? 'ring-2 ring-accent opacity-100' : 'opacity-45 hover:opacity-75 scale-[0.94]'}`}
          >
            <img
              src={drama.poster || drama.banner_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
};

export default SpotlightRail;