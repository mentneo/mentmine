import React from 'react';
import { Navbar, Footer } from '../components';
import Reviews from '../components/Reviews';

function ReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Student Reviews</h1>
          <p className="text-gray-600 mb-8">See what our students have to say about their experience with Mentneo</p>
          
          <Reviews limit={null} showForm={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ReviewsPage;
