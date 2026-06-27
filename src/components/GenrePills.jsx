const GenreBadge = ({ genre }) => (
  <span
    className="px-2 py-1 rounded-md bg-white/5 border border-border
               text-[10px] font-medium uppercase tracking-wider text-text-secondary"
  >
    {genre}
  </span>
);

export default GenreBadge;