import React from 'react';
import {
  Navbar,
  Footer,
  HeroSection,
  FeaturedCourses,
  UpcomingEvents,
  TestimonialsSection,
  PartnerSection,
  CTASection,
  TeamSection
} from '../components';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturedCourses />
      <UpcomingEvents />
      <TeamSection />
      <TestimonialsSection />
      <PartnerSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;
