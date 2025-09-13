import React, { useState, useEffect } from 'react';

const CreatorsPage = () => {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Update document title for SEO
    document.title = "Become a Creator | Mentneo";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join Mentneo Creators Mode. Share your knowledge, build your brand, and earn with Mentneo. Apply now to become a creator partner!');
    }
    
    // Add canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.origin + '/creators');
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Import firebase services
      const { db } = await import('../firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Save to Firestore
      await addDoc(collection(db, 'creatorSubmissions'), {
        ...form,
        timestamp: serverTimestamp()
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-4 font-poppins">
      {/* Hero Banner at the top */}
      <div className="w-full bg-gradient-to-r from-blue-800 to-purple-800 text-white py-12 px-4 mb-12 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Mentneo Creators Mode</h2>
          <p className="text-xl md:text-2xl mb-6">Share your knowledge, build your brand, and earn with Mentneo</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg px-6 py-4 rounded-lg">
              <p className="text-3xl font-bold">100K+</p>
              <p>Students Reached</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg px-6 py-4 rounded-lg">
              <p className="text-3xl font-bold">₹50K+</p>
              <p>Average Creator Earnings</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg px-6 py-4 rounded-lg">
              <p className="text-3xl font-bold">500+</p>
              <p>Creator Partners</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center font-poppins">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center">�� Mentneo Creators Mode</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">Turn Your Talent into Income with Mentneo</p>
        <div className="mb-6 text-left w-full">
          <h2 className="text-xl font-bold mb-2">✨ Why Join Creators Mode?</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Add your own courses to Mentneo's learning platform.</li>
            <li>Collaborate with other creators, educators, and institutions.</li>
            <li>Become an official partner of Mentneo.</li>
            <li>Reach thousands of students who are learning at an affordable price.</li>
            <li>Earn revenue from every enrollment.</li>
          </ul>
          <h2 className="text-xl font-bold mb-2">📌 How It Works</h2>
          <ol className="list-decimal ml-6 text-gray-700 mb-4">
            <li>Sign up as a Mentneo Creator.</li>
            <li>Upload your course material (videos, notes, quizzes, etc.).</li>
            <li>Set your pricing & details.</li>
            <li>Get featured on Mentneo's platform and start earning!</li>
          </ol>
          <hr className="my-4" />
          <h2 className="text-xl font-bold mb-2">⚖️ Terms & Conditions</h2>
          <ol className="list-decimal ml-6 text-gray-700 mb-4">
            <li>Original Content – All uploaded courses must be your own or you must have full rights to use them.</li>
            <li>No Copyright Violations – Plagiarized or stolen material will be removed.</li>
            <li>Revenue Sharing – Mentneo will share revenue as per the agreed percentage plan.</li>
            <li>Content Quality – Courses must maintain minimum audio, video, and learning quality standards.</li>
            <li>Student First Policy – Creators must engage ethically and not mislead students.</li>
            <li>Removal Rights – Mentneo reserves the right to remove any course that violates community guidelines.</li>
          </ol>
          <hr className="my-4" />
          <h2 className="text-xl font-bold mb-2">👉 Ready to be a Creator?</h2>
          <p className="text-gray-700 mb-4">Join Mentneo Creators Mode today and start building your career, brand, and income with us.</p>
        </div>
        <div className="w-full mt-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Apply as a Creator</h2>
          {submitted ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p className="font-semibold">Thank you for your interest in becoming a Mentneo Creator!</p>
              <p>We've received your application and our team will review it shortly. You'll hear back from us within 2-3 business days.</p>
            </div>
          ) : (
            <form className="flex flex-col gap-4 bg-blue-50 p-6 rounded-lg shadow-inner font-poppins" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  id="name"
                  name="name" 
                  type="text" 
                  required 
                  placeholder="Your Name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  id="email"
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Your Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Professional Role</label>
                <input 
                  id="role"
                  name="role" 
                  type="text" 
                  required 
                  placeholder="Teacher, Student, Professional..." 
                  value={form.role} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tell Us About Your Course</label>
                <textarea 
                  id="message"
                  name="message" 
                  required 
                  placeholder="Share details about your course, expertise, or what you'd like to teach..." 
                  value={form.message} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transform transition hover:scale-105"
              >
                Submit Application
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                By submitting, you agree to our Terms & Conditions and Privacy Policy
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorsPage;
