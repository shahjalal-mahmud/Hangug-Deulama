const DetailsSkeleton = () => (
  <div aria-busy="true" aria-live="polite">
    <div className="h-[55vh] md:h-[68vh] min-h-[420px] w-full bg-surface-elevated animate-pulse" />
    <div className="px-5 md:px-16 max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-8 space-y-6">
        <div className="h-4 w-24 bg-surface-elevated rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
          <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-surface-elevated rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 rounded-full bg-surface-elevated animate-pulse" />
          ))}
        </div>
      </div>
      <div className="md:col-span-4">
        <div className="h-40 rounded-2xl bg-surface-elevated animate-pulse" />
      </div>
    </div>
  </div>
);

export default DetailsSkeleton;