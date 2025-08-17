import { Helmet } from 'react-helmet';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Navbar, 
  Hero, 
  Features, 
  Footer, 
  Testimonials,
  FeaturedCourses,
  Events
} from '../components';
import PortfolioPage from './PortfolioPage';

function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  // Animation classes for fade/slide in
  const anim = 'transition-all duration-700 ease-in-out transform';

  return (
    <>
      <Helmet>
        <title>Mentneo - Learn. Build. Dominate.</title>
        <meta name="description" content="Mentneo: Empowering learners with top courses, mentors, and career opportunities. Learn, build, and dominate your future." />
        <meta property="og:title" content="Mentneo - Learn. Build. Dominate." />
        <meta property="og:description" content="Mentneo: Empowering learners with top courses, mentors, and career opportunities." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentneo.com/" />
        <meta property="og:image" content="https://mentneo.com/MENTNEO.png" />
      </Helmet>
      {/* Floating theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed z-50 top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-300 rounded-full shadow-lg p-3 transition-colors hover:bg-yellow-200 dark:hover:bg-gray-700"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-500`}>
        <Navbar />
        <div className={`${anim} ${theme === 'dark' ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}> {/* Hero always animates in */}
          <Hero onCtaClick={scrollToFeatures} />
        </div>
        <section id="features" className={`${anim} ${theme === 'dark' ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'}`}>
          <Features />
        </section>
        <div className={`${anim} ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-100 scale-100'}`}>
          <FeaturedCourses />
        </div>
        <section id="portfolio" className={`${anim} ${theme === 'dark' ? 'opacity-100 -translate-y-0' : 'opacity-100 -translate-y-0'}`}>
          <PortfolioPage />
        </section>
        <div className={`${anim} ${theme === 'dark' ? 'opacity-100' : 'opacity-100'}`}>
          <Testimonials />
        </div>
        <div className={`${anim} ${theme === 'dark' ? 'opacity-100' : 'opacity-100'}`}>
          <Events limit={3} showViewAll={true} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
