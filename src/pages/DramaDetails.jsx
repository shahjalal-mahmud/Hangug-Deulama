/* src/pages/DramaDetails.jsx */
import { useParams, Link } from 'react-router-dom';
import { useDrama } from '../context/DramaContext';
import GenreBadge from '../components/ui/GenreBadge';
import EmptyState from '../components/ui/EmptyState';

const DramaDetails = () => {
  const { id } = useParams();
  const { dramas, getDramaById } = useDrama();
  const drama = getDramaById(parseInt(id));
  const genres = drama ? drama.genre.split(',').map(g => g.trim()) : [];
  const stars = drama ? drama.stars.split(',').map(s => s.trim()) : [];

  if (!drama) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState 
          title="Drama Not Found"
          message="Sorry, we couldn't find the drama you're looking for."
          icon="🔍"
        />
      </div>
    );
  }

  // Get similar dramas (same genre)
  const similarDramas = dramas
    .filter(d => 
      d.drama_id !== drama.drama_id && 
      d.genre.split(',').some(g => drama.genre.split(',').includes(g.trim()))
    )
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-64 sm:h-80">
        <img 
          src={drama.banner_url} 
          alt={drama.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent" />
      </div>

      {/* Drama Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img 
            src={drama.banner_url} 
            alt={drama.title}
            className="w-full rounded-xl shadow-xl"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{drama.title}</h1>
          
          <div className="flex flex-wrap gap-2 items-center">
            {genres.map((g, idx) => (
              <GenreBadge key={idx} genre={g} />
            ))}
            <span className="badge badge-ghost">📅 {drama.release_year}</span>
            <span className="badge badge-secondary">⭐ {drama.imdb_rating || 'N/A'}/10</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Stars</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {stars.map((star, idx) => (
                <span key={idx} className="badge badge-outline">{star}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Synopsis</h3>
            <p className="text-base-content/80 leading-relaxed">
              {drama.storyline}
            </p>
          </div>

          <Link to="/discover" className="btn btn-primary">
            ← Back to Discover
          </Link>
        </div>
      </div>

      {/* Similar Dramas */}
      {similarDramas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Similar Dramas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarDramas.map((d) => (
              <div key={d.drama_id} className="drama-card">
                <figure>
                  <img 
                    src={d.banner_url} 
                    alt={d.title}
                    className="w-full aspect-2/3 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-sm">{d.title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {d.genre.split(',').slice(0, 2).map((g, idx) => (
                      <GenreBadge key={idx} genre={g.trim()} />
                    ))}
                  </div>
                  <div className="card-actions justify-end">
                    <Link to={`/drama/${d.drama_id}`} className="btn btn-primary btn-xs">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DramaDetails;