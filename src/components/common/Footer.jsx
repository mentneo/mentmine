```jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    email: "official@mentneo.com",
    phone: "+91-9876543210",
    address: "Bengaluru, Karnataka, India"
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__contact">
          <h3>Contact Us</h3>
          <p>Email: {contactInfo.email}</p>
          <p>Phone: {contactInfo.phone}</p>
          <p>Address: {contactInfo.address}</p>
        </div>
        <div className="footer__copyright">
          <p>&copy; {currentYear} Mentneo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```