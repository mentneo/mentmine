import React from 'react';

function Loader({ size = 'md', color = 'blue', fullScreen = false }) {
  // Loader sizes
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  // Loader colors
  const colors = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
  };

  const loaderElement = (
    <div className={`${sizes[size]} animate-spin rounded-full border-t-2 border-b-2 ${colors[color]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
}

export default Loader;
