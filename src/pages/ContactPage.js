import React from 'react';
import { Navbar, Footer } from '../components';
import Contact from '../components/Contact';

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
