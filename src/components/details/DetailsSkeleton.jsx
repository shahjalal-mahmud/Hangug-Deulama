/* src/components/details/DetailsSkeleton.jsx
   Loading placeholder rendered while DramaDetails is fetching the drama
   record. The shape mirrors the actual details page so the layout
   doesn't jump when the real data arrives.

   @see docs/pages/DramaDetails.jsx */

// NOTE: we set aria-busy + aria-live so screen readers announce the
// loading state and the eventual transition to real content, instead
// of staying silent during the fetch.
const DetailsSkeleton = () => (
  <div aria-busy="true" aria-live="polite">
    <div className="px-5 md:px-16 max-w-6xl mx-auto pt-28 md:pt-32 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-4">
          <div className="aspect-2/3 w-full max-w-sm mx-auto md:mx-0 rounded-2xl bg-surface-elevated animate-pulse" />
        </div>
        <div className="md:col-span-8 space-y-6">
          <div className="h-3 w-20 bg-surface-elevated rounded animate-pulse" />
          <div className="h-4 w-32 bg-surface-elevated rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-surface-elevated rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-surface-elevated rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-surface-elevated rounded-full animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-28 bg-surface-elevated rounded-full animate-pulse" />
            <div className="h-12 w-12 bg-surface-elevated rounded-full animate-pulse" />
            <div className="h-12 w-12 bg-surface-elevated rounded-full animate-pulse" />
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
            <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-surface-elevated rounded animate-pulse" />
          </div>
          <div className="flex gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-full bg-surface-elevated animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DetailsSkeleton;