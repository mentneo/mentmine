import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/logo-3d.png" 
                alt="Mentneo" 
                className="h-10 w-auto mr-3"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(104, 109, 224, 0.3))'
                }}
              />
              <span className="ml-2 text-2xl font-bold">Mentneo</span>
            </div>
            <p className="text-blue-200 mb-6">
              Affordable, high-quality tech education for Indian students, bridging the gap between academia and industry needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/mentneo" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com/mentneo" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/mentneo/" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/abhi-yeduru-277590336/" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCUXo4LktCpmsEtlP5hBc_qQ" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-blue-200 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/for-students" className="text-blue-200 hover:text-white transition-colors">For Students</Link></li>
              <li><Link to="/contact" className="text-blue-200 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="https://mentlearn.in/login" className="text-blue-200 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Full-Stack Web Development</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Front-End Development</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Back-End Development</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Mobile App Development</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Cloud Computing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-blue-200">kakinada, kakinada, andhra pradesh</li>
              <li className="text-blue-200">+91 9182146476</li>
              <li className="text-blue-200">official@mentneo.com</li>
              <li className="text-blue-200">Mon-Fri: 9am - 6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 text-center">
          <p className="text-blue-300 text-sm">
            Copyright © Mentneo {currentYear} | All Rights Reserved | <a href="/terms" className="hover:text-white">Terms & Conditions</a> | <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
