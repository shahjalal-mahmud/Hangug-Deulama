/* src/components/profile/ProfileSkeleton.jsx
   Shape-matched loading state for the profile page. Mirrors the final
   layout (hero / stat row / taste profile) instead of a generic spinner,
   so the page doesn't "pop" once data arrives. Uses the same pulse
   treatment as ImageWithSkeleton for visual consistency. */

const pulse = 'animate-pulse bg-linear-to-br from-surface-elevated to-surface';

const ProfileSkeleton = () => (
  <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
    {/* Hero */}
    <div className="rounded-2xl border border-border p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className={`w-28 h-28 rounded-full flex-none ${pulse}`} />
        <div className="flex-1 w-full space-y-3">
          <div className={`h-3 w-24 rounded-full ${pulse}`} />
          <div className={`h-7 w-48 rounded-full ${pulse}`} />
          <div className={`h-3 w-64 rounded-full ${pulse}`} />
          <div className="flex gap-3 pt-2">
            <div className={`h-9 w-32 rounded-full ${pulse}`} />
            <div className={`h-9 w-28 rounded-full ${pulse}`} />
          </div>
        </div>
      </div>
    </div>

    {/* Stat row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`h-24 rounded-2xl border border-border ${pulse}`} />
      ))}
    </div>

    {/* Taste profile */}
    <div className="rounded-2xl border border-border p-6 space-y-4">
      <div className={`h-3 w-32 rounded-full ${pulse}`} />
      <div className={`h-6 w-56 rounded-full ${pulse}`} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`h-14 rounded-xl ${pulse}`} />
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;