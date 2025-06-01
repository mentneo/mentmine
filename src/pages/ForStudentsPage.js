import React from 'react';
import { Navbar, Footer } from '../components';

function ForStudentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8" data-aos="fade-up">For Students</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div data-aos="fade-right" data-aos-delay="100">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Why Choose Mentneo?</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Affordable Pricing:</strong> Our courses are priced significantly lower than most boot camps, making quality tech education accessible to all.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Industry-Led Curriculum:</strong> Courses designed by professionals working at top tech companies, focused on the skills employers actually want.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Hands-on Learning:</strong> Build real-world projects that you can add directly to your portfolio, showcasing your skills to potential employers.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Mentor Support:</strong> Get guidance from industry professionals who can help you navigate your learning journey.</span>
                </li>
              </ul>
            </div>
            
            <div data-aos="fade-left" data-aos-delay="200">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Student Benefits</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Flexible Learning:</strong> Study at your own pace with our online platform, accessible 24/7.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Job Placement Assistance:</strong> Resume reviews, interview preparation, and connections to hiring partners.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Community:</strong> Join our vibrant student community for networking, collaboration, and peer learning.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Certification:</strong> Earn industry-recognized certificates upon course completion.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16" data-aos="fade-up">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Student Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <p className="italic text-gray-700 mb-4">"Mentneo's full-stack course completely transformed my career. Within two months of completing it, I landed a job as a junior developer at a startup!"</p>
                <p className="font-semibold">- Rahul S., Bengaluru</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <p className="italic text-gray-700 mb-4">"The affordability of Mentneo's courses made it possible for me to pursue my dream of becoming a web developer without taking on debt."</p>
                <p className="font-semibold">- Priya M., Chennai</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <p className="italic text-gray-700 mb-4">"The projects I built during my course became the portfolio that got me noticed. The practical, hands-on approach really works!"</p>
                <p className="font-semibold">- Amit K., Pune</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center" data-aos="fade-up">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Ready to Start Your Tech Journey?</h2>
            <a 
              href="https://mentlearn.in/register" 
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ForStudentsPage;
