import { app, auth, db, analytics } from './config';
import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'davjxvz8w';
const CLOUDINARY_UPLOAD_PRESET = 'cryptchat';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// Cloudinary helpers
const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Function to optimize image URL with Cloudinary transformations
const getOptimizedImageUrl = (cloudinaryUrl, options = {}) => {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }
  
  const defaultOptions = {
    width: options.width || 'auto',
    height: options.height || 'auto',
    quality: options.quality || 'auto',
    format: options.format || 'auto',
  };
  
  // Find the upload part of the URL
  const uploadIndex = cloudinaryUrl.indexOf('/upload/');
  if (uploadIndex === -1) return cloudinaryUrl;
  
  // Construct transformation string
  const transformations = [
    `q_${defaultOptions.quality}`,
    defaultOptions.width !== 'auto' ? `w_${defaultOptions.width}` : '',
    defaultOptions.height !== 'auto' ? `h_${defaultOptions.height}` : '',
    defaultOptions.format !== 'auto' ? `f_${defaultOptions.format}` : '',
  ].filter(Boolean).join(',');
  
  // Insert transformations into URL
  return `${cloudinaryUrl.substring(0, uploadIndex + 8)}${transformations}/${cloudinaryUrl.substring(uploadIndex + 8)}`;
};

// Auth related functions
const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
const logoutUser = () => signOut(auth);
const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Firestore helpers
const createDocument = (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  return addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

const updateDocument = (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

const deleteDocument = (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return deleteDoc(docRef);
};

const getDocument = (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return getDoc(docRef);
};

const getCollection = (collectionName, queryConstraints = []) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queryConstraints);
  return getDocs(q);
};

// Analytics helper
const trackEvent = (eventName, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

export {
  app,
  auth,
  db,
  analytics,
  // Auth functions
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  onAuthStateChanged,
  // Firestore functions
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getCollection,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  // Analytics
  trackEvent,
  // Cloudinary functions
  uploadImageToCloudinary,
  getOptimizedImageUrl,
  CLOUDINARY_CLOUD_NAME
};
