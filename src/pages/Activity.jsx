/* src/pages/Activity.jsx */
import { useState } from 'react';
import { useDrama } from '../context/DramaContext';
import DramaCard from '../components/drama/DramaCard';
import EmptyState from '../components/EmptyState';

const Activity = () => {
  const { dramas, likedDramas, dislikedDramas, watchedDramas } = useDrama();
  const [activeTab, setActiveTab] = useState('liked');

  const getDramas = (ids) => {
    return dramas.filter(d => ids.includes(d.id));
  };

  const renderContent = () => {
    let dramasList = [];
    let title = '';
    let emptyMessage = '';

    switch (activeTab) {
      case 'liked':
        dramasList = getDramas(likedDramas);
        title = 'Liked Dramas';
        emptyMessage = 'You haven\'t liked any dramas yet. Start discovering!';
        break;
      case 'disliked':
        dramasList = getDramas(dislikedDramas);
        title = 'Disliked Dramas';
        emptyMessage = 'You haven\'t disliked any dramas yet.';
        break;
      case 'watched':
        dramasList = getDramas(watchedDramas);
        title = 'Watched Dramas';
        emptyMessage = 'You haven\'t watched any dramas yet.';
        break;
      default:
        dramasList = [];
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {dramasList.length === 0 ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <EmptyState 
              title="Nothing Here Yet"
              message={emptyMessage}
              icon="📋"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dramasList.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Activity</h1>
      
      <div className="tabs tabs-boxed">
        <button 
          className={`tab ${activeTab === 'liked' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          ❤️ Liked ({likedDramas.length})
        </button>
        <button 
          className={`tab ${activeTab === 'disliked' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('disliked')}
        >
          ✖️ Disliked ({dislikedDramas.length})
        </button>
        <button 
          className={`tab ${activeTab === 'watched' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          👁️ Watched ({watchedDramas.length})
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Activity;