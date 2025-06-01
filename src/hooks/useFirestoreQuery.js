import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Custom hook for Firestore queries that avoids index errors by 
 * fetching all documents and filtering/sorting on the client side
 * 
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Object} options - Query options
 * @returns {Object} - Query state
 */
const useFirestoreQuery = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Destructure options
  const { 
    filters = {}, 
    orderBy = '-createdAt', 
    limit = 50,
    transformDoc = (doc) => doc
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all documents from the collection
        const querySnapshot = await getDocs(collection(db, collectionName));
        
        // Convert to array of documents with IDs
        let documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert timestamps to Date objects
          createdAt: doc.data().createdAt?.toDate?.() || new Date(0),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date(0),
          date: doc.data().date?.toDate?.() || null
        }));
        
        // Apply filters
        if (filters) {
          Object.entries(filters).forEach(([field, value]) => {
            // Skip undefined or null filters
            if (value === undefined || value === null) return;
            
            // Handle array contains
            if (Array.isArray(value) && field.endsWith('_array_contains')) {
              const actualField = field.replace('_array_contains', '');
              documents = documents.filter(doc => 
                Array.isArray(doc[actualField]) && 
                value.some(val => doc[actualField].includes(val))
              );
            }
            // Handle inequality
            else if (typeof value === 'object' && value !== null) {
              if (value.operator === '>') {
                documents = documents.filter(doc => doc[field] > value.value);
              } else if (value.operator === '>=') {
                documents = documents.filter(doc => doc[field] >= value.value);
              } else if (value.operator === '<') {
                documents = documents.filter(doc => doc[field] < value.value);
              } else if (value.operator === '<=') {
                documents = documents.filter(doc => doc[field] <= value.value);
              } else if (value.operator === '!=') {
                documents = documents.filter(doc => doc[field] !== value.value);
              }
            }
            // Handle equality (default)
            else {
              documents = documents.filter(doc => doc[field] === value);
            }
          });
        }
        
        // Apply sorting
        if (orderBy) {
          const desc = orderBy.startsWith('-');
          const field = desc ? orderBy.substring(1) : orderBy;
          
          documents.sort((a, b) => {
            // Handle dates
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
        if (limit > 0) {
          documents = documents.slice(0, limit);
        }
        
        // Apply any transformations
        if (transformDoc) {
          documents = documents.map(transformDoc);
        }
        
        setData(documents);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(`Failed to load data from ${collectionName}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [collectionName, JSON.stringify(filters), orderBy, limit]);
  
  return { data, loading, error };
};

export default useFirestoreQuery;
