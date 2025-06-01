import React from 'react';

function Hero({ onCtaClick }) {
  return (
    <div className="relative bg-mystic-dark text-mystic-text min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-blue-900 bg-cover bg-center opacity-90"></div>
      
      {/* Subtle particle/star animations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-32 md:py-40 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/5" data-aos="fade-right">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Transform Your Tech Career with Mentneo
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl">
              Affordable, industry-focused tech education designed specifically for Indian students. Learn real-world skills from expert mentors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCtaClick}
                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg text-lg shadow-lg
                hover:bg-blue-50 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Start Learning
              </button>
              <a
                href="tel:+919182146476"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg text-lg
                hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Us
              </a>
            </div>
          </div>
          <div className="md:w-2/5 mt-10 md:mt-0" data-aos="fade-left">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-3"></div>
              <div className="bg-white p-6 rounded-lg shadow-xl relative z-10">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Talk to an Expert</h3>
                <p className="text-gray-600 mb-4">Have questions about our courses or your tech career?</p>
                <div className="flex items-center mb-4 text-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href="tel:+919182146476" className="font-semibold hover:underline">+91 9182146476</a>
                </div>
                <div className="flex items-center mb-4 text-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:mentneo6@gmail.com" className="font-semibold hover:underline">official@mentneo.com</a>
                </div>
                <div className="text-center">
                  <button
                    onClick={onCtaClick}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Explore Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-auto" 
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="#ffffff"
        >
          <path 
            d="M0,60 C200,100 400,20 600,70 C800,120 1000,50 1200,80 C1400,110 1440,60 1440,100 L0,100 Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero;
