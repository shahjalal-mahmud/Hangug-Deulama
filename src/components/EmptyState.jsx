const EmptyState = ({ icon = 'movie', title, description }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <span className="material-symbols-outlined text-4xl text-text-tertiary mb-3" aria-hidden="true">
      {icon}
    </span>
    <h3 className="font-display text-lg text-text-primary mb-1">{title}</h3>
    {description && <p className="text-text-secondary text-sm max-w-sm">{description}</p>}
  </div>
);

export default EmptyState;