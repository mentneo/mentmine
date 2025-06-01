import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { isSupported, getAnalytics } from 'firebase/analytics';
import { uploadToCloudinary, getOptimizedImageUrl } from '../utils/cloudinary';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5TM1O1F1T49UKMbUG0nI7k19FHk6Cvr0",
  authDomain: "mentor-app-238c6.firebaseapp.com",
  projectId: "mentor-app-238c6",
  storageBucket: "mentor-app-238c6.firebasestorage.app",
  messagingSenderId: "943754909900",
  appId: "1:943754909900:web:cef25346ffae73d2e20a69",
  measurementId: "G-8T3CMHE740"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } else {
    console.log('Firebase Analytics is not supported in this environment');
  }
}).catch(err => {
  console.error('Error checking Firebase Analytics support:', err);
});

/**
 * Helper to simplify Firebase queries and avoid index errors
 * @param {CollectionReference} collectionRef - Firestore collection reference
 * @param {Object} filters - Filter conditions
 * @param {string} orderByField - Field to order by
 * @param {number} limitCount - Number of documents to fetch
 * @returns {Promise<Array>} - Filtered and sorted documents
 */
const getFilteredDocs = async (collectionRef, filters = {}, orderByField = 'createdAt', limitCount = 50) => {
  try {
    // Get all documents from the collection - no filtering or sorting at query level
    const snapshot = await getDocs(collectionRef);
    
    // Convert to array of documents with IDs
    let documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert timestamps to Date objects
      createdAt: doc.data().createdAt?.toDate?.() || new Date(0),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(0),
      date: doc.data().date?.toDate?.() || null
    }));
    
    // Apply filters in JavaScript
    if (filters) {
      Object.entries(filters).forEach(([field, value]) => {
        documents = documents.filter(doc => doc[field] === value);
      });
    }
    
    // Sort results
    if (orderByField) {
      const desc = orderByField.startsWith('-');
      const field = desc ? orderByField.substring(1) : orderByField;
      
      documents.sort((a, b) => {
        // Handle special case for dates
        if (a[field] instanceof Date && b[field] instanceof Date) {
          return desc ? b[field] - a[field] : a[field] - b[field];
        }
        
        // Handle strings
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return desc ? 
            b[field].localeCompare(a[field]) : 
            a[field].localeCompare(b[field]);
        }
        
        // Handle numbers and other types
        return desc ? 
          (b[field] || 0) - (a[field] || 0) : 
          (a[field] || 0) - (b[field] || 0);
      });
    }
    
    // Apply limit
    if (limitCount > 0) {
      documents = documents.slice(0, limitCount);
    }
    
    return documents;
  } catch (error) {
    console.error("Error fetching filtered documents:", error);
    throw error;
  }
};

// Export the uploadImageToCloudinary function with fixed progress handling
const uploadImageToCloudinary = async (file, progressCallback = null) => {
  try {
    // Handle different types of progress callbacks
    if (typeof progressCallback === 'function') {
      // If it's a function, pass it directly
      return await uploadToCloudinary(file, progressCallback);
    } else if (progressCallback !== null && progressCallback !== undefined) {
      // If it's any other value, use a simple object with no progress tracking
      return await uploadToCloudinary(file);
    }
    // Default case: no progress tracking
    return await uploadToCloudinary(file);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export { 
  app, 
  auth, 
  db, 
  storage, 
  analytics, 
  uploadImageToCloudinary, 
  getOptimizedImageUrl,
  getFilteredDocs 
};
