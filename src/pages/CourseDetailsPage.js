import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Footer, Loader } from '../components';

function CourseDetailsPage() {
  const { courseId } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Course Details</h1>
        <p className="text-gray-600 mb-4">Course ID: {courseId}</p>
        <p>This is a placeholder for the course details page. In a real application, this would fetch and display information about the specific course.</p>
      </main>
      <Footer />
    </div>
  );
}

export default CourseDetailsPage;
