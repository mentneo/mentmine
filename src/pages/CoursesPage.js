import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components';
import { fetchCourses } from '../utils/databaseUtils';
import { getOptimizedImageUrl } from '../utils/cloudinary';
import { FaStar, FaBook, FaClock, FaChalkboardTeacher, FaGraduationCap, FaFilter } from 'react-icons/fa';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'mobile-development', name: 'Mobile Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'cloud-computing', name: 'Cloud Computing' },
    { id: 'devops', name: 'DevOps' },
    { id: 'cybersecurity', name: 'Cybersecurity' }
  ];
  
  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];
  
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        // Use our utility function
        const allCourses = await fetchCourses({
          enrollmentOpen: true, // Only show courses with enrollment open
          sort: '-createdAt' // Show newest first
        });
        
        setCourses(allCourses);
        setError(null);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setFilterMenuOpen(false);
  };
  
  const handleLevelChange = (level) => {
    setActiveLevel(level);
    setFilterMenuOpen(false);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    // Category filter
    if (activeCategory !== 'all' && course.category !== activeCategory) {
      return false;
    }
    
    // Level filter
    if (activeLevel !== 'all' && course.level !== activeLevel) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOption) {
      case 'featured':
        return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'price-low':
        return parseInt(a.price) - parseInt(b.price);
      case 'price-high':
        return parseInt(b.price) - parseInt(a.price);
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Learn industry-relevant skills with our comprehensive tech courses
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0 w-full lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full lg:w-96 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
            {/* Mobile Filter Toggle */}
            <button 
              className="lg:hidden flex items-center bg-gray-100 py-2 px-4 rounded-md text-gray-700"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <FaFilter className="mr-2" />
              Filter Options
            </button>
            
            {/* Mobile Filter Dropdown */}
            {filterMenuOpen && (
              <div className="lg:hidden absolute mt-12 z-10 bg-white w-72 rounded-md shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div 
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`cursor-pointer p-2 rounded-md ${
                          activeCategory === category.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Level</h3>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <div 
                        key={level.id}
                        onClick={() => handleLevelChange(level.id)}
                        className={`cursor-pointer p-2 rounded-md ${
                          activeLevel === level.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {level.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Desktop Filter Options */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative group">
                <button className={`px-3 py-2 rounded-md ${
                  activeCategory !== 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-800'
                }`}>
                  {categories.find(c => c.id === activeCategory)?.name || 'All Categories'}
                </button>
                <div className="absolute hidden group-hover:block z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`cursor-pointer p-2 ${
                        activeCategory === category.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative group">
                <button className={`px-3 py-2 rounded-md ${
                  activeLevel !== 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-800'
                }`}>
                  {levels.find(l => l.id === activeLevel)?.name || 'All Levels'}
                </button>
                <div className="absolute hidden group-hover:block z-10 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                  {levels.map(level => (
                    <div 
                      key={level.id}
                      onClick={() => handleLevelChange(level.id)}
                      className={`cursor-pointer p-2 ${
                        activeLevel === level.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {level.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <div className="ml-auto">
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="bg-gray-100 border-0 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'}
            {(activeCategory !== 'all' || activeLevel !== 'all' || searchQuery) && ' with current filters'}
          </p>
        </div>
        
        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : sortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" data-aos="fade-up">
                <Link to={`/courses/${course.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    {course.imageUrl ? (
                      <img src={course.image?.smallUrl || course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaBook className="text-gray-400 text-4xl" />
                      </div>
                    )}
                    {course.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-yellow-900 flex items-center">
                        <FaStar className="mr-1" /> Featured
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {categories.find(c => c.id === course.category)?.name || course.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full ml-2">
                      {levels.find(l => l.id === course.level)?.name || course.level}
                    </span>
                  </div>
                  
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-700 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center mr-4">
                      <FaClock className="mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="mr-1" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-700">
                      ₹{parseInt(course.price).toLocaleString()}
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
        ) : (
          <div className="text-center py-16">
            <FaBook className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default CoursesPage;
