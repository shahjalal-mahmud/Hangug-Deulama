/* src/components/EmptyState.jsx */
const EmptyState = ({ title, message, icon }) => {
  return (
    <div className="empty-state">
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-base-content/70">{message}</p>
    </div>
  );
};

export default EmptyState;