const SkeletonCard = ({ variant = 'poster' }) => {
  if (variant === 'landscape') {
    return <div className="aspect-video rounded-xl bg-surface-elevated animate-pulse" aria-hidden="true" />;
  }

  return (
    <div className="flex-none w-40 sm:w-48 md:w-56">
      <div className="aspect-[2/3] rounded-xl bg-surface-elevated animate-pulse" aria-hidden="true" />
      <div className="h-3 w-3/4 bg-surface-elevated rounded mt-3 animate-pulse" aria-hidden="true" />
    </div>
  );
};

export default SkeletonCard;