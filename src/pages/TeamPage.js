import React from 'react';
import { Navbar, Footer } from '../components';
import Team from '../components/Team';

function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <section className="mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Our Expert Mentors</h1>
            <p className="text-gray-600 mb-8">Learn from industry professionals with years of experience</p>
            
            <Team teamType="mentors" limit={null} />
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Industry Experts</h2>
            <p className="text-gray-600 mb-8">Guest lecturers and consultants who contribute to our curriculum</p>
            
            <Team teamType="experts" limit={null} />
          </section>
          
          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Successful Alumni</h2>
            <p className="text-gray-600 mb-8">Former students who have gone on to achieve great things</p>
            
            <Team teamType="alumni" limit={null} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TeamPage;
