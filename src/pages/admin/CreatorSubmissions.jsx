import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

function CreatorSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const submissionsRef = collection(db, 'creatorSubmissions');
        const submissionsQuery = query(submissionsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(submissionsQuery);
        
        const submissionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));
        
        setSubmissions(submissionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching creator submissions:', err);
        setError('Failed to load creator submissions. Please try again.');
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'creatorSubmissions', id));
        setSubmissions(submissions.filter(sub => sub.id !== id));
      } catch (err) {
        setError('Failed to delete submission.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Creator Submissions</h1>
        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-yellow-700">No creator submissions yet. When creators apply through the creator portal, they will appear here.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-blue-800">{submission.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-gray-600">{submission.email}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{submission.role}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on {submission.timestamp.toLocaleDateString()} at {submission.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={`mailto:${submission.email}?subject=Regarding your Mentneo Creator Application&body=Dear ${submission.name},%0A%0AThank you for your interest in becoming a Mentneo Creator.%0A%0A`}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </a>
                  <button 
                    onClick={() => handleDelete(submission.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold mb-2 text-gray-700">Message:</h4>
                <p className="whitespace-pre-wrap text-gray-700">{submission.message}</p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Status: New
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreatorSubmissions;