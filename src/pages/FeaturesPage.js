import React from 'react';
import { Navbar, Footer } from '../components';
import { 
  FaGraduationCap, FaUsers, FaLaptopCode, FaChalkboardTeacher,
  FaCertificate, FaCode, FaHandsHelping, FaChartLine,
  FaMobile, FaDatabase, FaCloud, FaReact
} from 'react-icons/fa';

function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Our Features</h1>
            <p className="text-xl text-blue-100" data-aos="fade-up" data-aos-delay="200">
              Discover what makes Mentneo the perfect choice for your tech education journey
            </p>
          </div>
        </div>
      </div>
      
      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center" data-aos="zoom-in" data-aos-delay="100">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaChalkboardTeacher />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-700">Learn from industry professionals with years of real-world experience.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center" data-aos="zoom-in" data-aos-delay="200">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaLaptopCode />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Project-Based Learning</h3>
              <p className="text-gray-700">Apply your knowledge to real projects that you can add to your portfolio.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center" data-aos="zoom-in" data-aos-delay="300">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaHandsHelping />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Career Support</h3>
              <p className="text-gray-700">Get guidance on resume building, interview preparation, and job placement.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center" data-aos="zoom-in" data-aos-delay="400">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaCertificate />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Recognized Certification</h3>
              <p className="text-gray-700">Earn certificates that are recognized by top tech companies.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Offerings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">Our Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up">
              <div className="text-blue-600 text-3xl mb-4">
                <FaCode />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Full-Stack Web Development</h3>
              <p className="text-gray-700 mb-4">
                Master both front-end and back-end technologies to become a complete web developer. Learn HTML, CSS, JavaScript, React, Node.js, and more.
              </p>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  24 weeks intensive program
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  5 major projects
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Job guarantee program
                </li>
              </ul>
              <a href="#" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Learn More</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="text-blue-600 text-3xl mb-4">
                <FaReact />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Front-End Development</h3>
              <p className="text-gray-700 mb-4">
                Specialize in creating beautiful, interactive user interfaces with modern frameworks like React, Vue.js and more.
              </p>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  16 weeks focused curriculum
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  4 portfolio-worthy projects
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  UX/UI design principles
                </li>
              </ul>
              <a href="#" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Learn More</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="text-blue-600 text-3xl mb-4">
                <FaDatabase />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Back-End Development</h3>
              <p className="text-gray-700 mb-4">
                Focus on server-side logic, databases, APIs, and application architecture using Node.js, Python, and more.
              </p>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  18 weeks comprehensive program
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Database design & optimization
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  API development mastery
                </li>
              </ul>
              <a href="#" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Learn More</a>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="#" className="inline-block bg-blue-800 text-white py-3 px-8 rounded-md hover:bg-blue-900 transition-colors text-lg">View All Courses</a>
          </div>
        </div>
      </section>
      
      {/* Learning Experience */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">The Mentneo Learning Experience</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-up">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Live Interactive Classes</h3>
                  <p className="text-gray-700">
                    Unlike pre-recorded videos, our live classes allow you to interact directly with instructors, ask questions in real-time, and engage with your peers. This creates a dynamic learning environment that mimics the best aspects of in-person education.
                  </p>
                </div>
                <div className="md:w-1/2 bg-blue-100 rounded-lg p-6">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img src="/path/to/live-classes.jpg" alt="Live Interactive Classes" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row-reverse items-center gap-6" data-aos="fade-up">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Hands-on Projects</h3>
                  <p className="text-gray-700">
                    Theory is important, but practical application is where true learning happens. That's why our courses include multiple hands-on projects that solve real-world problems. These projects become part of your portfolio, demonstrating your skills to potential employers.
                  </p>
                </div>
                <div className="md:w-1/2 bg-blue-100 rounded-lg p-6">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img src="/path/to/projects.jpg" alt="Hands-on Projects" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-up">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Personalized Mentoring</h3>
                  <p className="text-gray-700">
                    Every student receives one-on-one mentoring sessions with industry experts who provide personalized guidance, feedback on your work, and career advice. This individualized attention helps you overcome challenges and accelerate your learning.
                  </p>
                </div>
                <div className="md:w-1/2 bg-blue-100 rounded-lg p-6">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img src="/path/to/mentoring.jpg" alt="Personalized Mentoring" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Ready to Start Your Tech Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join thousands of successful students who have transformed their careers with Mentneo.
          </p>
          <div data-aos="fade-up" data-aos-delay="200">
            <a href="#" className="inline-block bg-white text-blue-900 py-3 px-8 rounded-md hover:bg-blue-50 transition-colors text-lg font-bold">Explore Courses</a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default FeaturesPage;
