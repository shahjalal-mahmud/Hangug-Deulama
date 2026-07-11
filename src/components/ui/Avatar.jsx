/* src/components/ui/Avatar.jsx
   Renders a profile avatar with two safety nets:
     1. No image on the profile at all      → shows the default asset.
     2. Image path exists but fails to load
        (404, network error, bad backend
        path, etc.)                          → onError swaps to the
                                               default asset too.
   Used anywhere an avatar shows up (hero, edit modal, navbar, ...) so the
   fallback behavior only has to be right in one place. */

import { useEffect, useState } from 'react';
import { DEFAULT_AVATAR_SRC } from '../../utils/avatar';

const Avatar = ({ src, alt, className = '', imgClassName = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // A new src (e.g. after uploading a new photo) deserves a fresh chance
  // to load rather than being stuck on a previous failure.
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const resolvedSrc = !src || errored ? DEFAULT_AVATAR_SRC : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-linear-to-br from-surface-elevated to-surface"
        />
      )}
      <img
        src={resolvedSrc}
        alt={alt || 'Profile avatar'}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};

export default Avatar;