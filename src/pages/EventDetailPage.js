import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Navbar, Footer } from '../components';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, 'events', id);
        const eventSnap = await getDoc(eventRef);
        
        if (!eventSnap.exists()) {
          setError("Event not found");
          return;
        }
        
        const eventData = {
          id: eventSnap.id,
          ...eventSnap.data(),
          date: eventSnap.data().date?.toDate()
        };
        
        setEvent(eventData);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
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
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8">
            <strong className="font-bold">Error!</strong>{' '}
            <span className="block sm:inline">{error || "Event not found"}</span>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Events
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
      
      <div className="bg-gray-100 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 md:h-96">
              {event.imageUrl ? (
                <img 
                  src={event.image?.largeUrl || event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaCalendarAlt className="text-gray-400 text-6xl" />
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <div className="mb-2">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {event.eventType?.charAt(0).toUpperCase() + event.eventType?.slice(1) || 'Event'}
                  </span>
                  {event.isFeatured && (
                    <span className="inline-block bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm ml-2">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center text-sm md:text-base mb-8 text-gray-600">
                <div className="flex items-center mr-6 mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <FaClock className="mr-2 text-blue-600" />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  <span>{event.location || 'TBD'}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <div className="prose max-w-none mb-8">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
              
              {event.capacity && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Capacity</h2>
                  <p className="text-gray-700">{event.capacity} attendees</p>
                </div>
              )}
              
              <div className="flex justify-center mt-8">
                {event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Register Now <FaExternalLinkAlt className="ml-2" size={14} />
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium cursor-not-allowed"
                  >
                    Registration Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/events')}
              className="text-blue-600 hover:text-blue-800"
            >
              &larr; Back to Events
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default EventDetailPage;
