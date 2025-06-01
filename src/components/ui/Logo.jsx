import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', className = '', linkTo = '/' }) => {
  // Size variants
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
    full: 'h-full w-full',
  };

  return (
    <Link to={linkTo} className={`inline-flex items-center ${className}`}>
      <img 
        src="/logo-3d.png" 
        alt="Mentneo Logo" 
        className={`${sizes[size]} object-contain`} 
      />
    </Link>
  );
};

export default Logo;
