import React from 'react';

const LoadingSpinner = ({ message = "Loading page..." }) => {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label="loading"></div>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
