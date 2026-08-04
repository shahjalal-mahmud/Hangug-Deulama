/* src/components/home/GenrePills.jsx
   GenreBadge — a tiny chip that renders a single genre label. Kept
   file-local to this folder because the same component is also defined
   in components/ui/GenreBadge.jsx (the canonical one); this copy is
   here as a thin preset styled for the home rails specifically.

   @see docs/components/ui/GenreBadge.jsx */

const GenreBadge = ({ genre }) => (
  <span
    className="px-2 py-1 rounded-md bg-white/5 border border-border
               text-[10px] font-medium uppercase tracking-wider text-text-secondary"
  >
    {genre}
  </span>
);

export default GenreBadge;