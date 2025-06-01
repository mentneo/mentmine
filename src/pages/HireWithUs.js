import React, { useState } from 'react';
import { Navbar, Footer } from '../components';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaCheck, FaBuilding, FaUsers, FaLaptopCode } from 'react-icons/fa';

function HireWithUs() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    position: '',
    jobDescription: '',
    skills: '',
    employmentType: 'full-time',
    compensation: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'recruitmentRequests'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      
      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        position: '',
        jobDescription: '',
        skills: '',
        employmentType: 'full-time',
        compensation: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Hire Mentneo Graduates</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="200">
            Connect with talented, industry-ready tech professionals trained in the latest technologies.
          </p>
          <div className="flex justify-center gap-4" data-aos="fade-up" data-aos-delay="300">
            <a href="#hiring-form" className="bg-white text-blue-900 hover:bg-blue-100 font-medium py-3 px-6 rounded-md transition-colors">
              Submit Hiring Request
            </a>
            <a href="tel:+919182146476" className="border border-white hover:bg-white hover:text-blue-900 font-medium py-3 px-6 rounded-md transition-colors">
              Call Us Now
            </a>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10" data-aos="fade-up">Why Hire From Mentneo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaLaptopCode className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Practical Skills</h3>
              <p className="text-gray-700">
                Our graduates are trained through real-world projects and industry-relevant curriculum, ensuring they're ready to contribute from day one.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Hands-on experience with modern tech stacks</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Project-based learning approach</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Portfolio of completed projects</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Diverse Talent Pool</h3>
              <p className="text-gray-700">
                Access to candidates with varying experience levels and specializations, making it easier to find the perfect fit for your team.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Full-stack developers</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Front-end specialists</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Back-end developers</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Cost-Effective Hiring</h3>
              <p className="text-gray-700">
                Save on recruitment costs and onboarding time with pre-vetted candidates who are ready to hit the ground running.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>No recruitment agency fees</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Pre-screened candidates</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Reduced onboarding time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hiring Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Our Hiring Process</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center" data-aos="fade-up">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Submit Your Requirements</h3>
                    <p className="text-gray-700">Fill out our hiring form with details about the position and required skills.</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold z-10">1</div>
                  <div className="md:w-1/2 md:pl-8 md:text-left"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="100">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right order-2 md:order-1"></div>
                  <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold z-10 order-1 md:order-2">2</div>
                  <div className="md:w-1/2 md:pl-8 md:text-left order-3">
                    <h3 className="text-xl font-bold mb-2">Candidate Selection</h3>
                    <p className="text-gray-700">We match your requirements with our talented pool of graduates and students.</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="200">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Interview Process</h3>
                    <p className="text-gray-700">Conduct your standard interview process with our pre-screened candidates.</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold z-10">3</div>
                  <div className="md:w-1/2 md:pl-8 md:text-left"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="300">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right order-2 md:order-1"></div>
                  <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold z-10 order-1 md:order-2">4</div>
                  <div className="md:w-1/2 md:pl-8 md:text-left order-3">
                    <h3 className="text-xl font-bold mb-2">Onboard Your New Talent</h3>
                    <p className="text-gray-700">Hire the selected candidates and integrate them into your team.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hiring Form */}
      <section id="hiring-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Submit Your Hiring Request</h2>
          
          <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-lg shadow-md" data-aos="fade-up">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-gray-700 font-medium mb-2">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="position" className="block text-gray-700 font-medium mb-2">Position Title *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="employmentType" className="block text-gray-700 font-medium mb-2">Employment Type *</label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">Required Skills *</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="jobDescription" className="block text-gray-700 font-medium mb-2">Job Description *</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="compensation" className="block text-gray-700 font-medium mb-2">Compensation Range</label>
                <input
                  type="text"
                  id="compensation"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ₹5-8 LPA or $20-25/hour"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="additionalInfo" className="block text-gray-700 font-medium mb-2">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Hiring Request'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Your hiring request has been submitted successfully! Our team will contact you shortly.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  There was an error submitting your request. Please try again or contact us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Need More Information?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Our team is ready to answer any questions about our talent pool and help you find the perfect candidates.
          </p>
          <div data-aos="fade-up" data-aos-delay="200">
            <a href="tel:+919182146476" className="inline-flex items-center bg-white text-blue-900 hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Us: +91 9182146476
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default HireWithUs;
