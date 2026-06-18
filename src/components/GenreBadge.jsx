/* src/components/GenreBadge.jsx */
const GenreBadge = ({ genre }) => {
  const colorMap = {
    'Romance': 'badge-primary',
    'Comedy': 'badge-secondary',
    'Drama': 'badge-accent',
    'Action': 'badge-error',
    'Thriller': 'badge-warning',
    'Mystery': 'badge-info',
    'Fantasy': 'badge-success',
    'Sci-Fi': 'badge-neutral',
    'Family': 'badge-primary',
    'Mental Health': 'badge-secondary',
    'Historical': 'badge-accent',
    'Horror': 'badge-error',
    'Legal': 'badge-warning',
    'Revenge': 'badge-info',
  };

  return (
    <span className={`badge ${colorMap[genre] || 'badge-ghost'} badge-sm`}>
      {genre}
    </span>
  );
};

export default GenreBadge;