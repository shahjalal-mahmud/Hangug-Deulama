/* src/pages/Home.jsx */
import { Link } from 'react-router-dom';
import { useDrama } from '../context/DramaContext';
import DramaCard from '../components/DramaCard';

const Home = () => {
  const { dramas } = useDrama();
  const featuredDramas = dramas.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] rounded-xl bg-linear-to-r from-primary to-secondary text-white">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover Your Next Favorite K-Drama
            </h1>
            <p className="text-xl mb-8">
              Explore, rate, and track Korean dramas you love. 
              Find your perfect drama match today!
            </p>
            <Link to="/discover" className="btn btn-accent btn-lg">
              Start Discovering
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">👀</div>
              <h3 className="card-title">Discover</h3>
              <p>Swipe through dramas and find your next favorite show based on your preferences</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">❤️</div>
              <h3 className="card-title">Rate & Track</h3>
              <p>Like, dislike, or mark dramas as watched to build your personal drama library</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-5xl">🎯</div>
              <h3 className="card-title">Get Recommendations</h3>
              <p>Receive personalized drama suggestions based on your taste and viewing history</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dramas */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Dramas</h2>
          <Link to="/discover" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDramas.map((drama) => (
            <DramaCard key={drama.id} drama={drama} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-base-200 rounded-xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Drama?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of K-drama fans discovering their next favorite show.
        </p>
        <Link to="/discover" className="btn btn-primary btn-lg">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default Home;