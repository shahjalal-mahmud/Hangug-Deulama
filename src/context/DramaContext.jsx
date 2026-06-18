/* src/context/DramaContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import dramasData from '../data/dramas.json?url';

const DramaContext = createContext();

export const useDrama = () => {
  const context = useContext(DramaContext);
  if (!context) {
    throw new Error('useDrama must be used within a DramaProvider');
  }
  return context;
};

export const DramaProvider = ({ children }) => {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedDramas, setLikedDramas] = useState([]);
  const [dislikedDramas, setDislikedDramas] = useState([]);
  const [watchedDramas, setWatchedDramas] = useState([]);

  // Load dramas data
  useEffect(() => {
    const loadDramas = async () => {
      try {
        // Try importing directly
        const data = await import('../data/dramas.json');
        setDramas(data.default);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dramas:', error);
        // Fallback: fetch the JSON file
        try {
          const response = await fetch('/src/data/dramas.json');
          const data = await response.json();
          setDramas(data);
          setLoading(false);
        } catch (fetchError) {
          console.error('Error fetching dramas:', fetchError);
          setLoading(false);
        }
      }
    };
    loadDramas();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedDramas');
    const savedDisliked = localStorage.getItem('dislikedDramas');
    const savedWatched = localStorage.getItem('watchedDramas');
    
    if (savedLiked) setLikedDramas(JSON.parse(savedLiked));
    if (savedDisliked) setDislikedDramas(JSON.parse(savedDisliked));
    if (savedWatched) setWatchedDramas(JSON.parse(savedWatched));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (likedDramas.length > 0 || localStorage.getItem('likedDramas')) {
      localStorage.setItem('likedDramas', JSON.stringify(likedDramas));
    }
  }, [likedDramas]);

  useEffect(() => {
    if (dislikedDramas.length > 0 || localStorage.getItem('dislikedDramas')) {
      localStorage.setItem('dislikedDramas', JSON.stringify(dislikedDramas));
    }
  }, [dislikedDramas]);

  useEffect(() => {
    if (watchedDramas.length > 0 || localStorage.getItem('watchedDramas')) {
      localStorage.setItem('watchedDramas', JSON.stringify(watchedDramas));
    }
  }, [watchedDramas]);

  const likeDrama = (dramaId) => {
    if (!likedDramas.includes(dramaId)) {
      setLikedDramas([...likedDramas, dramaId]);
      if (dislikedDramas.includes(dramaId)) {
        setDislikedDramas(dislikedDramas.filter(id => id !== dramaId));
      }
    }
  };

  const dislikeDrama = (dramaId) => {
    if (!dislikedDramas.includes(dramaId)) {
      setDislikedDramas([...dislikedDramas, dramaId]);
      if (likedDramas.includes(dramaId)) {
        setLikedDramas(likedDramas.filter(id => id !== dramaId));
      }
    }
  };

  const watchDrama = (dramaId) => {
    if (!watchedDramas.includes(dramaId)) {
      setWatchedDramas([...watchedDramas, dramaId]);
    }
  };

  const getDramaById = (id) => {
    return dramas.find(drama => drama.id === id);
  };

  const getDramaStatus = (dramaId) => {
    return {
      isLiked: likedDramas.includes(dramaId),
      isDisliked: dislikedDramas.includes(dramaId),
      isWatched: watchedDramas.includes(dramaId),
    };
  };

  const value = {
    dramas,
    loading,
    likedDramas,
    dislikedDramas,
    watchedDramas,
    likeDrama,
    dislikeDrama,
    watchDrama,
    getDramaById,
    getDramaStatus,
  };

  return (
    <DramaContext.Provider value={value}>
      {children}
    </DramaContext.Provider>
  );
};