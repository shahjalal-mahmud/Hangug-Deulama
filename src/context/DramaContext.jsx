/* src/context/DramaContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import dramasData from '../data/dramas.json';

const DramaContext = createContext();

export const useDrama = () => {
  const context = useContext(DramaContext);
  if (!context) {
    throw new Error('useDrama must be used within a DramaProvider');
  }
  return context;
};

export const DramaProvider = ({ children }) => {
  const [dramas] = useState(dramasData);
  const [likedDramas, setLikedDramas] = useState([]);
  const [dislikedDramas, setDislikedDramas] = useState([]);
  const [watchedDramas, setWatchedDramas] = useState([]);
  const [loading, setLoading] = useState(false);

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
    localStorage.setItem('likedDramas', JSON.stringify(likedDramas));
  }, [likedDramas]);

  useEffect(() => {
    localStorage.setItem('dislikedDramas', JSON.stringify(dislikedDramas));
  }, [dislikedDramas]);

  useEffect(() => {
    localStorage.setItem('watchedDramas', JSON.stringify(watchedDramas));
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
    return dramas.find(drama => drama.drama_id === id);
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