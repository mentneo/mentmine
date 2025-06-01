import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChalkboardTeacher, FaClock } from 'react-icons/fa';
import { fetchCourses } from '../utils/databaseUtils';
import { getOptimizedImageUrl } from '../utils/cloudinary';

function FeaturedCourses({ maxCourses = 3 }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to load courses with filter
        let featuredCourses = [];
        try {
          featuredCourses = await fetchCourses({
            featured: true,
            enrollmentOpen: true,
            limit: maxCourses,
            sort: '-createdAt'
          });
        } catch (err) {
          console.error("Error with filtered query:", err);
          
          // Fallback: try to load all courses and filter in code
          const allCourses = await fetchCourses();
          featuredCourses = allCourses
            .filter(course => course.featured && course.enrollmentOpen !== false)
            .slice(0, maxCourses);
        }
        
        setCourses(featuredCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedCourses();
  }, [maxCourses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4" data-aos="fade-up">Featured Courses</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Enhance your skills with our industry-focused tech courses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
            >
              <div className="h-48 overflow-hidden">
                {course.imageUrl ? (
                  <img 
                    src={
                      course.image?.smallUrl || 
                      getOptimizedImageUrl(course.imageUrl, { width: 600, height: 400, crop: 'fill' })
                    } 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaBook className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{course.title || "Untitled Course"}</h3>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'All Levels'}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description || "No description available"}</p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <div className="flex items-center mr-4">
                    <FaClock className="mr-1" />
                    <span className="text-sm">{course.duration || "Self-paced"}</span>
                  </div>
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="mr-1" />
                    <span className="text-sm">{course.instructor || "Mentneo Instructor"}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-blue-600">
                    {course.price ? `₹${parseInt(course.price).toLocaleString()}` : 'Free'}
                  </div>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/courses" 
            className="inline-block px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors"
            data-aos="fade-up"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCourses;
