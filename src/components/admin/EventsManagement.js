import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  where,
  limit
} from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadImageToCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { FaEdit, FaTrash, FaCalendarAlt, FaImage, FaSpinner, FaStar } from 'react-icons/fa';

function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    registrationUrl: '',
    eventType: 'workshop',
    capacity: '',
    isOnline: false,
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filterStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let eventsQuery;
      const today = new Date();
      
      if (filterStatus === 'upcoming') {
        eventsQuery = query(
          collection(db, 'events'),
          where('date', '>=', today),
          orderBy('date', 'asc')
        );
      } else if (filterStatus === 'past') {
        eventsQuery = query(
          collection(db, 'events'),
          where('date', '<', today),
          orderBy('date', 'desc')
        );
      } else {
        eventsQuery = query(
          collection(db, 'events'),
          orderBy('date', 'desc')
        );
      }
      
      const snapshot = await getDocs(eventsQuery);
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));
      
      setEvents(eventsList);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // If toggling online status, update the location field
    if (name === 'isOnline' && checked) {
      setFormData(prev => ({
        ...prev,
        location: 'Online'
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      
      // Create a preview for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          previewUrl: reader.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      registrationUrl: '',
      eventType: 'workshop',
      capacity: '',
      isOnline: false,
      isFeatured: false
    });
    setImageFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    const eventDate = event.date ? new Date(event.date) : new Date();
    
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: eventDate.toISOString().split('T')[0],
      time: eventDate.toTimeString().split(' ')[0].substring(0, 5),
      location: event.location || '',
      registrationUrl: event.registrationUrl || '',
      eventType: event.eventType || 'workshop',
      capacity: event.capacity || '',
      isOnline: event.isOnline || false,
      isFeatured: event.isFeatured || false
    });
    setImageFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setEvents(events.filter(event => event.id !== eventId));
      alert("Event deleted successfully");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      setUploadProgress(10); // Starting progress
      
      // Upload to Cloudinary with progress tracking
      const uploadResult = await uploadImageToCloudinary(imageFile, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadProgress(100);
      return uploadResult;
    } catch (err) {
      console.error("Upload error:", err);
      setUploadProgress(0);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imageData = null;
      
      // Upload image if a new one is selected
      if (imageFile) {
        imageData = await uploadImage();
        if (!imageData) {
          alert("Image upload failed. Please try again.");
          setSubmitting(false);
          return;
        }
      }
      
      // Create event date by combining date and time
      const [year, month, day] = formData.date.split('-').map(num => parseInt(num));
      const [hours, minutes] = formData.time.split(':').map(num => parseInt(num));
      const eventDate = new Date(year, month - 1, day, hours, minutes);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDate,
        location: formData.isOnline ? 'Online' : formData.location,
        registrationUrl: formData.registrationUrl,
        eventType: formData.eventType,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        isOnline: formData.isOnline,
        isFeatured: formData.isFeatured,
        updatedAt: serverTimestamp()
      };
      
      // Add image data if available
      if (imageData) {
        eventData.imageUrl = imageData.url;
        eventData.image = {
          url: imageData.url,
          thumbnailUrl: imageData.thumbnailUrl,
          smallUrl: imageData.smallUrl,
          mediumUrl: imageData.mediumUrl,
          largeUrl: imageData.largeUrl
        };
      }
      
      if (selectedEvent) {
        // Update existing event
        await updateDoc(doc(db, 'events', selectedEvent.id), eventData);
        alert("Event updated successfully");
      } else {
        // Add new event
        eventData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'events'), eventData);
        alert("Event added successfully");
      }
      
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Error saving event");
    } finally {
      setSubmitting(false);
    }
  };

  // JSX part of the component
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-semibold">Events Management</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>
        </div>
        <button
          onClick={handleAddEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Event
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.date?.toLocaleDateString() || 'No date'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.date?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {event.imageUrl ? (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img src={event.imageUrl} alt={event.title} className="h-10 w-10 rounded-md object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{event.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{event.location || 'Online'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {event.registrationUrl ? (
                        <a 
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Link
                        </a>
                      ) : (
                        'None'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="webinar">Webinar</option>
                      <option value="conference">Conference</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="meetup">Meetup</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (leave blank for unlimited)
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                  
                  <div className="flex space-x-6 mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isOnline"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={handleToggleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-700">
                        Online Event
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleToggleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                        Featured Event
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Physical location or 'Online'"
                      disabled={formData.isOnline}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="registrationUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Registration URL
                    </label>
                    <input
                      type="url"
                      id="registrationUrl"
                      name="registrationUrl"
                      value={formData.registrationUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/register"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image
                    </label>
                    {formData.imageUrl && (
                      <div className="mb-2">
                        <img src={formData.imageUrl} alt="Event" className="h-32 w-auto object-cover rounded-md" />
                      </div>
                    )}
                    {formData.previewUrl && !formData.imageUrl && (
                      <div className="mb-2">
                        <img src={formData.previewUrl} alt="Preview" className="h-32 w-auto object-cover rounded-md" />
                        <p className="text-xs text-gray-500 mt-1">Preview (not uploaded yet)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      `${selectedEvent ? 'Update' : 'Create'} Event`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsManagement;
