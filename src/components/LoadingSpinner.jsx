import React from 'react';

const LoadingSpinner = ({ message = "Loading page..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] gap-4">
      <div 
        className="w-12 h-12 border-4 border-border-color border-b-accent rounded-full animate-spin" 
        role="status" 
        aria-label="loading"
      ></div>
      <p className="text-text-muted">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
