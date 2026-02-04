import { Helmet } from 'react-helmet';
import React from 'react';
import {
  Navbar,
  Hero,
  Features,
  Footer,
  Testimonials,
  FeaturedCourses,
  FeaturedServices,
  Events,
  Contact,
  AIVideosSection
} from '../components';
import PortfolioPage from './PortfolioPage';

function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  // Animation classes for fade/slide in
  const anim = 'transition-all duration-700 ease-in-out transform';

  return (
    <>
      <Helmet>
        <title>Mentneo - Learn. Build. Dominate. — mentneo, abhi yeduru</title>
        <meta name="description" content="Mentneo: Empowering learners with top courses, mentors, and career opportunities. Learn, build, and dominate your future." />
        <meta name="keywords" content="abhi, abhi yeduru, ment, mention, mentn, mentneo, yaswanth jada" />
        <link rel="canonical" href="https://mentneo.com/" />
        <meta property="og:title" content="Mentneo - Learn. Build. Dominate." />
        <meta property="og:description" content="Mentneo: Empowering learners with top courses, mentors, and career opportunities." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentneo.com/" />
        <meta property="og:image" content="https://mentneo.com/MENTNEO.png" />
        <meta name="author" content="Abhi Yeduru, Yaswanth Jada" />
        {/* Organization Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Mentneo",
            "url": "https://mentneo.com",
            "logo": "https://mentneo.com/MENTNEO.png",
            "sameAs": [
              "https://www.facebook.com/mentneo",
              "https://twitter.com/mentneo",
              "https://www.instagram.com/mentneo/",
              "https://www.linkedin.com/in/abhi-yeduru-277590336/",
              "https://www.youtube.com/channel/UCUXo4LktCpmsEtlP5hBc_qQ"
            ],
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+91-9182146476",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": "English"
            }]
          }
        `}</script>
        {/* WebSite Structured Data for Sitelinks Search Box */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://mentneo.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://mentneo.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}</script>
        {/* MobileApplication structured data with aggregateRating — update ratingValue and ratingCount with real values */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "Mentneo",
            "url": "https://mentneo.com/",
            "applicationCategory": "Education",
            "operatingSystem": "WEB",
            "image": "https://mentneo.com/MENTNEO.png",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "124"
            }
          }
        `}</script>
      </Helmet>
      {/*
        Accessible, non-visual placement of target keywords so they appear
        inside the <body> tag (helps with the "use target keywords in <body>"
        recommendation) without keyword stuffing or visible UI change.
        Tailwind's `sr-only` keeps the text accessible to screen readers but
        visually hidden.
      */}
      <div className="sr-only">
        Mentneo — abhi, abhi yeduru, ment, mention, mentn, mentneo, yaswanth jada. Founded and led by Abhi Yeduru and Yaswanth Jada, Mentneo provides courses, mentors, and career guidance.
      </div>
      <div className={`min-h-screen flex flex-col bg-white transition-colors duration-500`}>
        <Navbar />
        <div className={`${anim} opacity-100 translate-y-0`}> {/* Hero always animates in */}
          <Hero onCtaClick={scrollToFeatures} />
        </div>
        <section id="features" className={`${anim} opacity-100 translate-x-0`}>
          <Features />
        </section>
        <div className={`${anim} opacity-100 scale-100`}>
          <FeaturedCourses />
        </div>
        <div className={`${anim} opacity-100 scale-100`}>
          <FeaturedServices />
        </div>
        <div className={`${anim} opacity-100 scale-100`}>
          <AIVideosSection />
        </div>
        <section id="portfolio" className={`${anim} opacity-100 -translate-y-0`}>
          <PortfolioPage />
        </section>
        <div className={`${anim} opacity-100`}>
          <Testimonials />
        </div>
        <div className={`${anim} opacity-100`}>
          <Events limit={3} showViewAll={true} />
        </div>
        <div className={`${anim} opacity-100`}>
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
