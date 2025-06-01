import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
