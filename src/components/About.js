import React from 'react';

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2" data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">About Mentneo</h2>
            <p className="text-gray-700 mb-6 text-lg">
              At Mentneo, we're on a mission to democratize high-quality tech education across India. We understand that cost shouldn't be a barrier to learning industry-relevant skills.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              Founded by industry experts with decades of combined experience, we provide affordable full-stack development courses designed to prepare students for real-world challenges in the tech industry.
            </p>
            <p className="text-gray-700 text-lg">
              Our innovative teaching methodology combines theory with hands-on projects, ensuring that every Mentneo graduate enters the workforce with the practical skills and confidence needed to succeed.
            </p>
          </div>
          <div className="md:w-1/2" data-aos="fade-left">
            <div className="rounded-lg overflow-hidden shadow-xl">
              {/* Use a direct path to an image in the public folder */}
              <img 
                src="/logo-3d.png" 
                alt="Students learning at Mentneo" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
