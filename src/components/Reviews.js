import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

function Reviews({ limit = 6, showForm = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    course: '',
    approved: false // Reviews need admin approval before showing
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Only get approved reviews
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('approved', '==', true),
          orderBy('createdAt', 'desc'),
          limit ? limit : 100
        );
        
        const reviewSnapshot = await getDocs(reviewsQuery);
        const reviewsList = reviewSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setReviews(reviewsList);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [limit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setFormData({
        name: '',
        email: '',
        rating: 5,
        comment: '',
        course: '',
        approved: false
      });
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div 
              key={review.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FaQuoteLeft className="text-blue-200 text-2xl mr-2" />
                </div>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-800">{review.name}</p>
                {review.course && (
                  <p className="text-gray-500 text-sm">{review.course} Student</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600">No reviews available yet.</p>
        </div>
      )}
      
      {showForm && (
        <div className="mt-12 bg-blue-50 p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Share Your Experience</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="course" className="block text-gray-700 font-medium mb-2">
                Course You Took (Optional)
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">
                Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="text-2xl focus:outline-none"
                  >
                    <FaStar 
                      className={`${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Your review has been submitted successfully and will be displayed after approval.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                There was an error submitting your review. Please try again.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Reviews;
