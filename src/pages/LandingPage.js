import React from 'react';
import { 
  Navbar, 
  Hero, 
  Features, 
  Footer, 
  Testimonials,
  FeaturedCourses,
  Events,
  TeamSection
} from '../components';

function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero onCtaClick={scrollToFeatures} />
      
      <section id="features">
        <Features />
      </section>
      
      <FeaturedCourses />
      
      <TeamSection />
      
      <Testimonials />
      
      <Events limit={3} showViewAll={true} />
      
      <Footer />
    </div>
  );
}

export default LandingPage;
