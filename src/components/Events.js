import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit as firebaseLimit } from 'firebase/firestore';
import { db } from '../firebase';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

function Events({ limit = 3, showViewAll = true }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const today = new Date();
        
        // Get upcoming events
        const eventsQuery = query(
          collection(db, 'events'),
          where('date', '>=', today),
          orderBy('date', 'asc'),
          limit ? firebaseLimit(limit) : firebaseLimit(100)
        );
        
        const eventSnapshot = await getDocs(eventsQuery);
        const eventList = eventSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate(), // Convert Firestore timestamp to JS Date
            // Use optimized image URLs if available or fallback to the main imageUrl
            imageUrl: data.image?.smallUrl || data.imageUrl || null,
            thumbnailUrl: data.image?.thumbnailUrl || data.imageUrl || null,
          };
        });
        
        setEvents(eventList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [limit]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">Upcoming Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join us for workshops, webinars, and networking opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
            >
              <Link to={`/events/${event.id}`}>
                <div className="h-48 overflow-hidden">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaCalendar className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {event.eventType?.charAt(0).toUpperCase() + event.eventType?.slice(1) || 'Event'}
                  </span>
                  {event.isOnline && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                      Online
                    </span>
                  )}
                </div>
                
                <Link to={`/events/${event.id}`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                </Link>
                
                <div className="flex flex-col space-y-1 mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendar className="text-blue-500 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-500 mr-2" />
                    <span>{event.location || 'Online'}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Link 
                    to={`/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                  
                  {event.registrationUrl && (
                    <a 
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Register <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showViewAll && (
          <div className="text-center mt-8">
            <Link 
              to="/events" 
              className="inline-block px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors"
              data-aos="fade-up"
            >
              View All Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
