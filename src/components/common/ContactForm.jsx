import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const ContactForm = () => {
  return (
    <div className="contact-form">
      {/* ...existing form fields... */}

      <div className="mt-6 flex items-center">
        <FaEnvelope className="text-blue-600 mr-2" />
        <a href="mailto:official@mentneo.com" className="text-blue-600 hover:text-blue-800">
          official@mentneo.com
        </a>
      </div>
    </div>
  );
};

export default ContactForm;