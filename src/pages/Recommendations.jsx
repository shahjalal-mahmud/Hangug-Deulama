/* src/pages/Recommendations.jsx */
import { useDrama } from '../context/DramaContext';
import DramaCard from '../components/drama/DramaCard';
import EmptyState from '../components/ui/EmptyState';

const Recommendations = () => {
  const { dramas, likedDramas, watchedDramas } = useDrama();

  // Generate recommendations based on liked dramas
  const getRecommendations = () => {
    if (likedDramas.length === 0) {
      // If no liked dramas, show top rated dramas
      return dramas
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    }

    // Get liked dramas details
    const likedDramasList = dramas.filter(d => likedDramas.includes(d.id));
    
    // Get genres from liked dramas
    const likedGenres = likedDramasList.flatMap(d => d.genre);
    const genreFrequency = {};
    likedGenres.forEach(genre => {
      genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
    });

    // Sort genres by frequency
    const sortedGenres = Object.keys(genreFrequency).sort(
      (a, b) => genreFrequency[b] - genreFrequency[a]
    );
    const topGenres = sortedGenres.slice(0, 3);

    // Find dramas with matching genres, excluding already liked/watched
    const recommended = dramas
      .filter(d => 
        !likedDramas.includes(d.id) && 
        !watchedDramas.includes(d.id)
      )
      .map(d => ({
        ...d,
        matchScore: d.genre.filter(g => topGenres.includes(g)).length
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    return recommended;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Recommendations</h1>
        <p className="text-base-content/70 mt-2">
          Based on your preferences and viewing history
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <EmptyState 
            title="No Recommendations Yet"
            message="Like some dramas to get personalized recommendations!"
            icon="🔍"
          />
        </div>
      ) : (
        <>
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Liked Dramas</div>
              <div className="stat-value">{likedDramas.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Watched Dramas</div>
              <div className="stat-value">{watchedDramas.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Recommendations</div>
              <div className="stat-value">{recommendations.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;