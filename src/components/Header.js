import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src={getImageUrl('/logo-3d.png')} 
        alt="Mentneo Logo" 
        className="h-10 w-auto"
      />
    </Link>
  );
};

export default Logo;