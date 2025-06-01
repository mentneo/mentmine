import React from 'react';
import { Navbar, Footer } from '../components';
import About from '../components/About';

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;
