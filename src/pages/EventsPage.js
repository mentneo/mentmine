import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Navbar, Footer } from '../components';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaFilter } from 'react-icons/fa';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const eventTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'webinar', name: 'Webinars' },
    { id: 'conference', name: 'Conferences' },
    { id: 'hackathon', name: 'Hackathons' },
    { id: 'meetup', name: 'Meetups' }
  ];
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        const today = new Date();
        const eventsQuery = query(
          collection(db, 'events'),
          where('date', '>=', today),
          orderBy('date', 'asc')
        );
        
        const snapshot = await getDocs(eventsQuery);
        const eventsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate()
        }));
        
        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
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
  
  const handleTypeChange = (type) => {
    setFilterType(type);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter events
  const filteredEvents = events.filter(event => {
    // Type filter
    if (filterType !== 'all' && event.eventType !== filterType) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Join us for insightful workshops, webinars, and networking opportunities
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2 w-full md:w-auto">
            {eventTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === type.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredEvents.length} upcoming {filteredEvents.length === 1 ? 'event' : 'events'}
            {(filterType !== 'all' || searchQuery) && ' with current filters'}
          </p>
        </div>
        
        {/* Events Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <Link 
                to={`/events/${event.id}`}
                key={event.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
              >
                <div className="relative h-48 overflow-hidden">
                  {event.imageUrl ? (
                    <img 
                      src={event.image?.smallUrl || event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaCalendar className="text-gray-400 text-4xl" />
                    </div>
                  )}
                  {event.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-yellow-900">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="text-white text-xs font-medium bg-blue-600 px-2 py-1 rounded">
                      {event.eventType?.charAt(0).toUpperCase() + event.eventType?.slice(1) || 'Event'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                  
                  <div className="flex flex-col space-y-2 mb-3">
                    <div className="flex items-start">
                      <FaCalendar className="text-blue-600 mt-1 mr-2" />
                      <span className="text-gray-700">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-start">
                      <FaClock className="text-blue-600 mt-1 mr-2" />
                      <span className="text-gray-700">{formatTime(event.date)}</span>
                    </div>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-blue-600 mt-1 mr-2" />
                      <span className="text-gray-700">{event.location || 'Online'}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                  
                  <div className="mt-auto">
                    {event.registrationUrl ? (
                      <a 
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Register Now <FaExternalLinkAlt className="ml-1" />
                      </a>
                    ) : (
                      <span className="text-gray-500">Registration details coming soon</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaCalendar className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No upcoming events found</h3>
            <p className="text-gray-500">Check back later for new events or try a different filter</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default EventsPage;
