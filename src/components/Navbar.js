import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/logo-3d.png" 
            alt="Mentneo Logo" 
            className="h-12 w-auto hover:scale-105 transition-transform duration-300"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(104, 109, 224, 0.4))'
            }}
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
          <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Courses</Link>
          <Link to="/events" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Events</Link>
          <Link to="/for-students" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">For Students</Link>
          <Link to="/hire-with-us" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Hire With Us</Link>
          
          {/* Call Us Button */}
          <a 
            href="tel:+919182146476" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call Us
          </a>
          
          <a 
            href="https://mentlearn.in/login" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Login
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">Home</Link>
            <Link to="/about" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">About</Link>
            <Link to="/courses" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">Courses</Link>
            <Link to="/events" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">Events</Link>
            <Link to="/for-students" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">For Students</Link>
            <Link to="/hire-with-us" className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md">Hire With Us</Link>
            
            <a 
              href="tel:+919182146476" 
              className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call: +91 9182146476
            </a>
            
            <a 
              href="https://mentlearn.in/login" 
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
