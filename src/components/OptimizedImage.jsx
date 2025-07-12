import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className = "", 
  loading = "lazy",
  fetchpriority = "auto",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Only use WebP if explicitly provided or if we're sure it exists
  const webpSource = webpSrc;
  
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // If no WebP source is provided, just use the regular img tag
  if (!webpSource) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        fetchpriority={fetchpriority}
        onLoad={handleLoad}
        onError={() => setHasError(true)}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
        {...props}
      />
    );
  }

  // If WebP source is provided, use picture element with fallback
  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        srcSet={webpSource} 
        type="image/webp" 
      />
      
      {/* Fallback image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        fetchpriority={fetchpriority}
        onLoad={handleLoad}
        onError={() => setHasError(true)}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage; 