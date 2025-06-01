import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Navbar, Footer } from '../components';
import { FaClock, FaGraduationCap, FaChalkboardTeacher, FaList, FaStar, FaLock } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseRef = doc(db, 'courses', id);
        const courseSnap = await getDoc(courseRef);
        
        if (!courseSnap.exists()) {
          setError("Course not found");
          return;
        }
        
        const courseData = {
          id: courseSnap.id,
          ...courseSnap.data()
        };
        
        // Sanitize course data to prevent XSS
        if (courseData.description) {
          courseData.description = sanitizeHTML(courseData.description);
        }
        
        if (courseData.syllabus && Array.isArray(courseData.syllabus)) {
          courseData.syllabus = courseData.syllabus.map(module => ({
            ...module,
            title: sanitizeHTML(module.title || ''),
            content: sanitizeHTML(module.content || '')
          }));
        }
        
        setCourse(courseData);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  // Simple HTML sanitization to prevent XSS attacks
  const sanitizeHTML = (html) => {
    if (!html) return '';
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // Generate a secure enrollment URL that includes auth info if user is logged in
  const getEnrollmentUrl = () => {
    const baseUrl = `https://mentlearn.in/courses/${id}`;
    if (user && user.uid) {
      // Create a time-limited token for secure redirects
      const timestamp = Date.now();
      const userEmail = encodeURIComponent(user.email || '');
      
      // Note: In a real implementation, you might want to sign this token with a secret
      // or use a more secure method like Firebase Auth custom tokens
      return `${baseUrl}?uid=${user.uid}&email=${userEmail}&ts=${timestamp}`;
    }
    return baseUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8">
            <strong className="font-bold">Error!</strong>{' '}
            <span className="block sm:inline">{error || "Course not found"}</span>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Courses
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Add a prominent Mentneo branding at the top */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                MENT<span className="text-yellow-400">NEO</span>
              </span>
            </h1>
            <p className="mt-2 text-xl text-blue-100">Your Gateway to Elite Tech Education</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 pr-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap items-center mb-6 text-sm md:text-base">
                <div className="flex items-center mr-4 mb-2">
                  <FaChalkboardTeacher className="mr-2" />
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <FaClock className="mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaGraduationCap className="mr-2" />
                  <span>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
                </div>
              </div>
              <p className="text-lg opacity-90 mb-6">{course.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a 
                  href={getEnrollmentUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-blue-900 hover:bg-blue-100 px-6 py-3 rounded-md font-bold flex items-center"
                >
                  {!isAuthChecking && !user && <FaLock className="mr-2" />}
                  Enroll Now: ₹{parseInt(course.price).toLocaleString()}
                </a>
                <a 
                  href={`https://mentlearn.in/chat${user ? `?uid=${user.uid}` : ''}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-6 py-3 rounded-md font-bold flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Chat with Us
                </a>
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-gray-200">
                  {course.imageUrl ? (
                    <img 
                      src={course.image?.largeUrl || course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <FaGraduationCap className="text-gray-500 text-5xl" />
                    </div>
                  )}
                </div>
                <div className="p-6 text-gray-800">
                  <h3 className="text-xl font-bold mb-4 text-blue-900">Course Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{course.syllabus?.length || 0} comprehensive modules</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Hands-on projects and assignments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Certificate upon completion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>24/7 doubt clearing support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {/* Add another Mentneo brand reference */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Course Curriculum</h2>
          <div className="text-lg font-bold text-blue-600">
            MENT<span className="text-yellow-500">NEO</span> <span className="text-gray-500 font-normal text-sm">Learning Path</span>
          </div>
        </div>
        
        {course.syllabus && course.syllabus.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {course.syllabus.map((module, index) => (
                <li key={module.id || index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                      <p className="mt-2 text-gray-600">{module.content}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Course curriculum details will be available soon.</p>
          </div>
        )}
        
        <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
          <a 
            href={getEnrollmentUrl()}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold flex items-center"
          >
            {!isAuthChecking && !user && <FaLock className="mr-2" />}
            Enroll Now with <span className="ml-1 font-extrabold">MENT<span className="text-yellow-300">NEO</span></span>
          </a>
          <a 
            href={`https://mentlearn.in/chat${user ? `?uid=${user.uid}` : ''}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-md font-bold flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Discuss with Mentor
          </a>
        </div>
      </div>
      
      {/* Add a brand banner before footer */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            MENT<span className="text-yellow-400">NEO</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            Elevating tech education with industry-focused courses designed for the future
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default CourseDetailPage;
