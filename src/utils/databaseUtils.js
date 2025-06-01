import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Safely convert Firebase timestamp to JavaScript Date
 * @param {Object} timestamp - Firebase timestamp or null/undefined
 * @returns {Date|null} - JavaScript Date or null if invalid
 */
const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  // Check if it's already a Date object
  if (timestamp instanceof Date) return timestamp;
  
  // Check if it has a toDate method (Firebase Timestamp)
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // Check if it's a number (seconds since epoch)
  if (typeof timestamp === 'number') {
    return new Date(timestamp * 1000); // Convert seconds to milliseconds
  }
  
  // Return null for invalid timestamps
  return null;
};

/**
 * Fetch all courses from Firestore with client-side filtering
 * @param {Object} options - Filter and sort options
 * @returns {Promise<Array>} - Array of courses
 */
export const fetchCourses = async (options = {}) => {
  try {
    const { featured = null, enrollmentOpen = null, limit = null, sort = 'createdAt' } = options;
    
    // Get all courses without any server filtering
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    // Convert to array and safely handle timestamps
    let courses = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Safely convert timestamps
        createdAt: convertTimestamp(data.createdAt) || new Date(0),
        updatedAt: convertTimestamp(data.updatedAt) || new Date(0)
      };
    });
    
    // Apply filters on the client side
    if (featured !== null) {
      courses = courses.filter(course => course.featured === featured);
    }
    
    if (enrollmentOpen !== null) {
      courses = courses.filter(course => course.enrollmentOpen === enrollmentOpen);
    }
    
    // Sort based on the provided field
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    
    courses.sort((a, b) => {
      // Handle missing fields
      if (!a.hasOwnProperty(sortField) && !b.hasOwnProperty(sortField)) {
        return 0;
      }
      
      if (!a.hasOwnProperty(sortField)) {
        return sortOrder * 1; // Missing field in a, put at end if ascending
      }
      
      if (!b.hasOwnProperty(sortField)) {
        return sortOrder * -1; // Missing field in b, put at end if ascending
      }
      
      // Compare dates
      if (a[sortField] instanceof Date && b[sortField] instanceof Date) {
        return sortOrder * (b[sortField] - a[sortField]);
      }
      
      // Compare strings
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        return sortOrder * a[sortField].localeCompare(b[sortField]);
      }
      
      // Compare numbers and other types
      return sortOrder * ((a[sortField] || 0) - (b[sortField] || 0));
    });
    
    // Apply limit if provided
    if (limit && limit > 0) {
      courses = courses.slice(0, limit);
    }
    
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to load courses. Please try again later.');
  }
};

/**
 * Fetch course by ID
 * @param {string} courseId - Course ID 
 * @returns {Promise<Object|null>} - Course data or null if not found
 */
export const fetchCourseById = async (courseId) => {
  try {
    const courseSnapshot = await getDoc(doc(db, 'courses', courseId));
    if (!courseSnapshot.exists()) {
      return null;
    }
    
    const data = courseSnapshot.data();
    const courseData = {
      id: courseSnapshot.id,
      ...data,
      // Safely convert timestamps
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    };
    
    return courseData;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw new Error('Failed to load course details. Please try again later.');
  }
};

export default { fetchCourses, fetchCourseById };
