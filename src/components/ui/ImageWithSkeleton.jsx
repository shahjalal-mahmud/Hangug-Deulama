import { useState } from 'react';

const ImageWithSkeleton = ({ src, alt, className = '', imgClassName = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-surface-elevated ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-linear-to-br from-surface-elevated to-surface"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;