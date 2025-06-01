import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { trackEvent, trackConversion } from '../utils/analytics';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
    subject: 'General Inquiry',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track the event using our analytics utility
      trackEvent('contact_form_started', {
        form_location: 'home_page'
      });

      // Add the message to Firestore with enhanced metadata
      const docRef = await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'pending',
        source: 'website_contact_form',
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
        timeOnPage: Math.floor((new Date() - window.performance.timing.navigationStart) / 1000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Track conversion for the successful form submission
      trackConversion('form_submission', {
        form_type: 'contact',
        form_id: 'homepage_contact',
        message_id: docRef.id
      });
      
      setSubmitStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        message: '', 
        phone: '',
        subject: 'General Inquiry' 
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      
      // Track error using analytics
      trackEvent('contact_form_error', {
        error_message: error.message,
        error_code: error.code || 'unknown'
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
            data-aos="fade-up"
          >
            Get In Touch
          </h2>
          <p 
            className="text-gray-600 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Have questions about our courses or want to learn more about how Mentneo can help you grow your tech career? Reach out to us!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div 
            className="lg:w-1/2"
            data-aos="fade-right"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
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
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Support">Support</option>
                  <option value="Sales">Sales</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus === 'success' && (
                <p className="mt-4 text-green-600">Your message has been sent successfully!</p>
              )}
              
              {submitStatus === 'error' && (
                <p className="mt-4 text-red-600">There was an error sending your message. Please try again.</p>
              )}
            </form>
          </div>
          
          <div 
            className="lg:w-1/2"
            data-aos="fade-left"
          >
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <iframe
                title="Mentneo Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3450909127!2d77.63671661482216!3d13.011937390825956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17659d97c785%3A0x208f3f3977522b8d!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1648573333085!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
