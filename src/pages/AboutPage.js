import React from 'react';
import { Navbar, Footer } from '../components';
import About from '../components/About';
import { Helmet } from 'react-helmet';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Mentneo</title>
        <meta name="description" content="Learn more about Mentneo, our mission, vision, and the team empowering learners worldwide." />
        <meta property="og:title" content="About Us | Mentneo" />
        <meta property="og:description" content="Learn more about Mentneo, our mission, vision, and the team empowering learners worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentneo.com/about" />
        <meta property="og:image" content="https://mentneo.com/MENTNEO.png" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <About />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default AboutPage;
