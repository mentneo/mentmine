import React from 'react';
import { Navbar, Footer } from '../components';
import { FaGraduationCap, FaRupeeSign, FaUsers, FaLaptopCode, FaChartLine } from 'react-icons/fa';

function AimStudyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Empowering Middle-Class Students</h1>
            <p className="text-xl text-blue-100" data-aos="fade-up" data-aos-delay="200">
              Quality tech education shouldn't be a luxury. It's a pathway to a brighter future that every talented student deserves.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center" data-aos="fade-up">Our Aim</h2>
            
            <div className="bg-blue-50 p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <p className="text-gray-700 text-lg leading-relaxed">
                At Mentneo, we specifically aim to bridge the gap between quality tech education and affordability. 
                We believe that financial constraints should never prevent talented middle-class students from accessing 
                the education they need to build successful careers in the technology sector.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Our programs are designed with middle-class Indian families in mind, offering world-class technology 
                education at a fraction of the cost charged by premium institutes, without compromising on quality or outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Challenges */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">Challenges Facing Middle-Class Students</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Rising Education Costs</h3>
              <p className="text-gray-700">
                The cost of quality technical education has risen dramatically over the last decade, making it increasingly inaccessible 
                for middle-class families who have to weigh educational expenses against other financial obligations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Theory-Heavy Curriculum</h3>
              <p className="text-gray-700">
                Traditional educational institutions often focus heavily on theoretical knowledge while providing limited practical experience, 
                creating a gap between academic learning and industry requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Lack of Industry Connection</h3>
              <p className="text-gray-700">
                Many graduates struggle to find jobs despite having degrees because their education hasn't equipped them with the actual skills 
                and connections needed in today's rapidly evolving tech landscape.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Solution */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">How Mentneo Makes a Difference</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="order-2 lg:order-1" data-aos="fade-right">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaRupeeSign className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Affordable Fee Structure</h3>
                    <p className="text-gray-700">
                      Our courses are 60-70% more affordable than comparable programs, with flexible payment options and EMI plans 
                      specifically designed to accommodate middle-class family budgets.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaLaptopCode className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Practical Skills-First Approach</h3>
                    <p className="text-gray-700">
                      Our curriculum emphasizes practical skills through real-world projects, ensuring students develop the exact capabilities 
                      employers are looking for in today's competitive job market.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUsers className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Industry Partnerships</h3>
                    <p className="text-gray-700">
                      We've built strong relationships with tech companies that recognize our graduates' skills, creating direct pathways to job 
                      opportunities that might otherwise be inaccessible.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaChartLine className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Job-Focused Outcomes</h3>
                    <p className="text-gray-700">
                      Our success is measured by your success. We focus on employment outcomes with dedicated career services, interview preparation, 
                      and ongoing support until you secure your first tech role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2" data-aos="fade-left">
              <div className="bg-blue-50 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
                <div className="text-center">
                  <FaGraduationCap className="text-blue-600 text-6xl mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Impact Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-4xl font-bold text-blue-800">5,000+</p>
                      <p className="text-gray-700">Students Trained</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-800">75%</p>
                      <p className="text-gray-700">From Middle-Class Families</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-800">92%</p>
                      <p className="text-gray-700">Placement Rate</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-800">6 LPA</p>
                      <p className="text-gray-700">Average Starting Salary</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Student Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center" data-aos="fade-up">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="h-20 w-20 rounded-full bg-blue-100 mx-auto mb-4 overflow-hidden">
                {/* Student photo would go here */}
                <div className="h-full w-full bg-gray-300"></div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 text-center mb-2">Rahul Kumar</h3>
              <p className="text-blue-600 text-center text-sm mb-4">Full-Stack Developer @ Amazon</p>
              <p className="text-gray-700">
                "Coming from a middle-class family in Bihar, I never thought I could afford quality tech education. Mentneo's affordable 
                program and EMI option made it possible. Now I work at Amazon with a salary I never dreamed of."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="h-20 w-20 rounded-full bg-blue-100 mx-auto mb-4 overflow-hidden">
                {/* Student photo would go here */}
                <div className="h-full w-full bg-gray-300"></div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 text-center mb-2">Priya Sharma</h3>
              <p className="text-blue-600 text-center text-sm mb-4">Frontend Engineer @ Flipkart</p>
              <p className="text-gray-700">
                "After college, I was struggling to find jobs despite my degree. Mentneo's practical curriculum helped me build real skills 
                and a portfolio that got me noticed. My parents spent less on Mentneo than on my traditional education, but the outcome was far better."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="300">
              <div className="h-20 w-20 rounded-full bg-blue-100 mx-auto mb-4 overflow-hidden">
                {/* Student photo would go here */}
                <div className="h-full w-full bg-gray-300"></div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 text-center mb-2">Avinash Reddy</h3>
              <p className="text-blue-600 text-center text-sm mb-4">Backend Developer @ Swiggy</p>
              <p className="text-gray-700">
                "My father is a teacher and my mother a homemaker. They always prioritized education but couldn't afford expensive bootcamps. 
                Mentneo provided world-class training at a price we could manage, and their job placement support was exceptional."
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="#" className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors" data-aos="fade-up">
              Read More Stories
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Your Background Doesn't Define Your Future</h2>
            <p className="text-xl text-blue-100 mb-8" data-aos="fade-up" data-aos-delay="100">
              Join Mentneo today and take the first step toward a successful tech career, regardless of your economic background.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
              <a href="#" className="bg-white text-blue-900 py-3 px-8 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg">
                Explore Courses
              </a>
              <a href="#" className="border-2 border-white text-white py-3 px-8 rounded-md hover:bg-white hover:text-blue-900 transition-colors text-lg">
                Apply for Scholarship
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default AimStudyPage;
