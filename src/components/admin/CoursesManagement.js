import React, { useState, useEffect, Fragment } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { FaEdit, FaTrash, FaGraduationCap, FaSpinner, FaStar, FaBook, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import CloudinaryUploader from './CloudinaryUploader';

function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    level: 'beginner',
    category: 'web-development',
    instructor: '',
    imageUrl: '',
    syllabus: [],
    featured: false,
    enrollmentOpen: true
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isReordering, setIsReordering] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Syllabus module state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleContent, setModuleContent] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [filterCategory]);

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      let coursesQuery;
      
      if (filterCategory === 'all') {
        coursesQuery = query(
          collection(db, 'courses'),
          orderBy('createdAt', 'desc')
        );
      } else {
        coursesQuery = query(
          collection(db, 'courses'),
          where('category', '==', filterCategory),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(coursesQuery);
      const coursesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCourses(coursesList);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for course form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes for course form
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Add a module to the course syllabus
  const handleAddModule = () => {
    if (!moduleTitle.trim()) return;
    
    setFormData({
      ...formData,
      syllabus: [
        ...formData.syllabus,
        {
          id: Date.now().toString(),
          title: moduleTitle,
          content: moduleContent,
          order: formData.syllabus.length + 1
        }
      ]
    });
    
    setModuleTitle('');
    setModuleContent('');
  };

  // Delete a module from the course syllabus
  const handleDeleteModule = (moduleId) => {
    setFormData({
      ...formData,
      syllabus: formData.syllabus.filter(module => module.id !== moduleId)
    });
  };

  // Open the course addition modal
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: '',
      level: 'beginner',
      category: 'web-development',
      instructor: '',
      imageUrl: '',
      syllabus: [],
      featured: false,
      enrollmentOpen: true
    });
    setUploadProgress(0);
    setModalOpen(true);
  };

  // Edit an existing course
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      price: course.price || '',
      level: course.level || 'beginner',
      category: course.category || 'web-development',
      instructor: course.instructor || '',
      imageUrl: course.imageUrl || '',
      syllabus: course.syllabus || [],
      featured: course.featured || false,
      enrollmentOpen: course.enrollmentOpen !== false
    });
    setUploadProgress(0);
    setModalOpen(true);
  };

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(courses.filter(course => course.id !== courseId));
      alert("Course deleted successfully");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  // Handle course form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate form
    if (!formData.title.trim()) {
      addNotification("Course title is required", "error");
      setSubmitting(false);
      return;
    }
    
    if (!formData.description.trim()) {
      addNotification("Course description is required", "error");
      setSubmitting(false);
      return;
    }
    
    if (formData.price === '' || isNaN(formData.price)) {
      addNotification("Valid price is required", "error");
      setSubmitting(false);
      return;
    }
    
    try {
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration,
        price: formData.price,
        level: formData.level,
        category: formData.category,
        instructor: formData.instructor.trim(),
        syllabus: formData.syllabus,
        featured: formData.featured,
        enrollmentOpen: formData.enrollmentOpen,
        updatedAt: serverTimestamp()
      };
      
      // If we have image data from Cloudinary widget, include it
      if (formData.imageUrl) {
        courseData.imageUrl = formData.imageUrl;
        courseData.image = formData.image;
      }
      
      if (selectedCourse) {
        // Update existing course
        await updateDoc(doc(db, 'courses', selectedCourse.id), courseData);
        addNotification(`Course "${formData.title}" updated successfully`);
      } else {
        // Add new course
        courseData.createdAt = serverTimestamp();
        courseData.enrollments = 0;
        await addDoc(collection(db, 'courses'), courseData);
        addNotification(`Course "${formData.title}" created successfully`);
      }
      
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      addNotification(`Error: ${err.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Add a notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications(current => current.filter(n => n.id !== id));
    }, 3000);
  };

  // Module reordering functionality
  const moveModuleUp = (index) => {
    if (index === 0) return;
    
    const newSyllabus = [...formData.syllabus];
    [newSyllabus[index-1], newSyllabus[index]] = [newSyllabus[index], newSyllabus[index-1]];
    
    // Update order property
    newSyllabus.forEach((module, i) => {
      module.order = i + 1;
    });
    
    setFormData({
      ...formData,
      syllabus: newSyllabus
    });
  };
  
  const moveModuleDown = (index) => {
    if (index === formData.syllabus.length - 1) return;
    
    const newSyllabus = [...formData.syllabus];
    [newSyllabus[index], newSyllabus[index+1]] = [newSyllabus[index+1], newSyllabus[index]];
    
    // Update order property
    newSyllabus.forEach((module, i) => {
      module.order = i + 1;
    });
    
    setFormData({
      ...formData,
      syllabus: newSyllabus
    });
  };

  // Duplicate course functionality
  const handleDuplicateCourse = async (course) => {
    try {
      const duplicatedCourse = {
        ...course,
        title: `${course.title} (Copy)`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        enrollments: 0
      };
      
      // Remove the id field
      const { id, ...courseWithoutId } = duplicatedCourse;
      
      await addDoc(collection(db, 'courses'), courseWithoutId);
      addNotification(`Course "${course.title}" duplicated successfully`);
      fetchCourses();
    } catch (err) {
      console.error("Error duplicating course:", err);
      addNotification(`Error duplicating course: ${err.message}`, "error");
    }
  };

  // Handle search functionality
  useEffect(() => {
    if (!courses) return;
    
    const results = courses.filter(course => 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply sorting
    const sorted = [...results].sort((a, b) => {
      switch (sortOrder) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'newest':
        default:
          return b.createdAt?.seconds - a.createdAt?.seconds;
      }
    });
    
    setFilteredCourses(sorted);
  }, [courses, searchTerm, sortOrder]);

  return (
    <div>
      {/* Notification system */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`mb-2 p-3 rounded-md shadow-md flex justify-between items-center ${
              notification.type === 'error' 
                ? 'bg-red-100 text-red-800 border-l-4 border-red-500' 
                : 'bg-green-100 text-green-800 border-l-4 border-green-500'
            }`}
          >
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotifications(current => current.filter(n => n.id !== notification.id))}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-semibold">Courses Management</h2>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="data-science">Data Science</option>
            <option value="cloud-computing">Cloud Computing</option>
            <option value="devops">DevOps</option>
            <option value="cybersecurity">Cybersecurity</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
          
          <button
            onClick={handleAddCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add New Course
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <div className="col-span-3 flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Alternative approach to avoid the syntax issue: split the rendering logic into separate parts
          <>
            {/* Define the courseList variable before rendering */}
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    {course.imageUrl ? (
                      <img 
                        src={course.image?.smallUrl || course.imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaBook className="text-gray-400 text-4xl" />
                      </div>
                    )}
                    {course.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-yellow-900 flex items-center">
                        <FaStar className="mr-1" /> Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{course.title || "Untitled Course"}</h3>
                      <div className="text-lg font-bold text-blue-600">
                        {course.price ? `₹${parseInt(course.price).toLocaleString()}` : 'Free'}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'All Levels'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full ml-2">
                        {course.duration}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                        course.enrollmentOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.enrollmentOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {course.description || "No description available"}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {course.syllabus?.length || 0} modules
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDuplicateCourse(course)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Duplicate"
                        >
                          <FaCopy size={14} />
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <FaBook className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No courses found matching your search.' : 'No courses found. Add your first course!'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal form - same as existing but with improved module reordering */}
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {selectedCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 8 weeks"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                        Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="web-development">Web Development</option>
                        <option value="mobile-development">Mobile Development</option>
                        <option value="data-science">Data Science</option>
                        <option value="cloud-computing">Cloud Computing</option>
                        <option value="devops">DevOps</option>
                        <option value="cybersecurity">Cybersecurity</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Image
                    </label>
                    
                    {formData.imageUrl && (
                      <div className="mb-2">
                        <img 
                          src={formData.imageUrl} 
                          alt="Course" 
                          className="h-32 w-auto object-cover rounded-md" 
                        />
                      </div>
                    )}
                    
                    <CloudinaryUploader 
                      onUploadSuccess={(imageData) => {
                        setFormData({
                          ...formData,
                          imageUrl: imageData.url,
                          image: {
                            url: imageData.url,
                            thumbnailUrl: imageData.thumbnailUrl,
                            smallUrl: imageData.smallUrl,
                            mediumUrl: imageData.mediumUrl,
                            largeUrl: imageData.largeUrl
                          }
                        });
                        setUploadProgress(100);
                      }}
                      onUploadError={(error) => {
                        console.error("Image upload failed:", error);
                        addNotification("Image upload failed", "error");
                        setUploadProgress(0);
                      }}
                      onUploadProgress={setUploadProgress}
                    />
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Course Syllabus
                      </label>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {formData.syllabus.length} modules
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsReordering(!isReordering)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                        >
                          {isReordering ? "Done" : "Reorder"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="mb-2">
                        <label htmlFor="moduleTitle" className="block text-sm text-gray-700 mb-1">
                          Module Title
                        </label>
                        <input
                          type="text"
                          id="moduleTitle"
                          value={moduleTitle}
                          onChange={(e) => setModuleTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="moduleContent" className="block text-sm text-gray-700 mb-1">
                          Module Content
                        </label>
                        <textarea
                          id="moduleContent"
                          value={moduleContent}
                          onChange={(e) => setModuleContent(e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="w-full bg-blue-100 text-blue-700 py-1 px-4 rounded hover:bg-blue-200 transition-colors"
                      >
                        Add Module
                      </button>
                    </div>
                    
                    {formData.syllabus.length > 0 && (
                      <div className="border border-gray-200 rounded-md">
                        <ul className="divide-y divide-gray-200">
                          {formData.syllabus.map((module, index) => (
                            <li key={module.id} className="p-3 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                  <p className="font-medium text-gray-800">
                                    {index + 1}. {module.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {module.content}
                                  </p>
                                </div>
                                {isReordering ? (
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => moveModuleUp(index)}
                                      disabled={index === 0}
                                      className={`text-gray-500 ${index === 0 ? 'opacity-30' : 'hover:text-gray-700'}`}
                                    >
                                      <FaArrowUp size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveModuleDown(index)}
                                      disabled={index === formData.syllabus.length - 1}
                                      className={`text-gray-500 ${index === formData.syllabus.length - 1 ? 'opacity-30' : 'hover:text-gray-700'}`}
                                    >
                                      <FaArrowDown size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                        Featured Course
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enrollmentOpen"
                        name="enrollmentOpen"
                        checked={formData.enrollmentOpen}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enrollmentOpen" className="ml-2 block text-sm text-gray-700">
                        Enrollment Open
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      `${selectedCourse ? 'Update' : 'Create'} Course`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FaCopy component definition for the duplicate functionality
const FaCopy = ({ size }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 512 512" 
    height={size} 
    width={size} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M464 0H144c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h320c26.51 0 48-21.49 48-48v-48h48c26.51 0 48-21.49 48-48V48c0-26.51-21.49-48-48-48zM362 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h42v224c0 26.51 21.49 48 48 48h224v42a6 6 0 0 1-6 6zm96-96H150a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h308a6 6 0 0 1 6 6v308a6 6 0 0 1-6 6z"></path>
  </svg>
);

// FaArrowUp and FaArrowDown components for module reordering
const FaArrowUp = ({ size }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 448 512" 
    height={size} 
    width={size} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
  </svg>
);

const FaArrowDown = ({ size }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 448 512" 
    height={size} 
    width={size} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
  </svg>
);

export default CoursesManagement;
