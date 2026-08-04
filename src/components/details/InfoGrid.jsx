/* src/components/details/InfoGrid.jsx
   Two-column facts grid on the details page (Director, Network, Episodes,
   etc.). Filters out any item whose `value` is missing before rendering
   so the page stays clean even when the catalog leaves some fields blank.

   @see docs/pages/DramaDetails.jsx */

const InfoGrid = ({ items }) => {
  // NOTE: filtering out empty values here instead of at the call site
  // means DramaDetails.jsx can pass the full record straight through
  // without knowing which fields are guaranteed to be present.
  const visibleItems = items.filter((item) => item.value);
  if (!visibleItems.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 py-6 border-y border-border">
      {visibleItems.map((item) => (
        <div key={item.label}>
          <p className="text-text-tertiary text-[11px] font-medium uppercase tracking-widest mb-1">
            {item.label}
          </p>
          <p className="text-text-primary text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;