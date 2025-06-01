import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaFilter, FaSearch, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';

function SupportTickets({ messagesData }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter messages based on status and search term
  const filteredMessages = messagesData.filter(message => {
    const matchesSearch = 
      (message.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && message.status === filterStatus;
  });

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await updateDoc(doc(db, 'contactMessages', messageId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Update the selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === messageId) {
        setSelectedTicket({
          ...selectedTicket,
          status: newStatus
        });
      }
      
      // This would typically refresh the data in a real app
      alert(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Error updating ticket status");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTicket) return;
    
    try {
      await updateDoc(doc(db, 'contactMessages', selectedTicket.id), {
        replies: [...(selectedTicket.replies || []), {
          text: reply,
          timestamp: new Date(),
          admin: true // indicates this is an admin reply
        }],
        status: 'responded',
        updatedAt: new Date()
      });
      
      // Update selected ticket in local state
      setSelectedTicket({
        ...selectedTicket,
        replies: [...(selectedTicket.replies || []), {
          text: reply,
          timestamp: new Date(),
          admin: true
        }],
        status: 'responded'
      });
      
      setReply(""); // Clear the reply input
      alert("Reply sent successfully");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'responded':
        return <FaCheck className="text-green-500" />;
      case 'urgent':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Support Tickets</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tickets</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="urgent">Urgent</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tickets List */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-medium">Support Messages</h2>
            </div>
            
            {filteredMessages.length > 0 ? (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedTicket && selectedTicket.id === message.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTicket(message)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{message.name || 'Unknown'}</div>
                      <div className="flex items-center">
                        {getStatusIcon(message.status || 'pending')}
                        <span className={`ml-1 text-xs ${
                          message.status === 'pending' ? 'text-yellow-500' : 
                          message.status === 'responded' ? 'text-green-500' :
                          message.status === 'urgent' ? 'text-red-500' :
                          'text-gray-500'
                        }`}>
                          {message.status || 'pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm truncate">{message.email}</div>
                    <div className="text-gray-500 text-sm mt-1 line-clamp-2">{message.message}</div>
                    <div className="text-gray-400 text-xs mt-2">
                      {message.createdAt ? new Date(message.createdAt).toLocaleString() : 'Unknown date'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No tickets found</div>
            )}
          </div>
        </div>
        
        {/* Ticket Detail */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md h-full">
            {selectedTicket ? (
              <div className="flex flex-col h-full">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-medium">Ticket Details</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(selectedTicket.id, 'urgent')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedTicket.status === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 hover:bg-red-100 hover:text-red-800'
                      }`}
                    >
                      Urgent
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedTicket.id, 'pending')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedTicket.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 hover:bg-yellow-100 hover:text-yellow-800'
                      }`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedTicket.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-lg">{selectedTicket.name || 'Unknown'}</h3>
                      <span className="text-gray-500 text-sm">
                        {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'Unknown date'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{selectedTicket.email}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-800">{selectedTicket.message}</p>
                    </div>
                  </div>
                  
                  {/* Reply history */}
                  {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Previous Replies</h4>
                      {selectedTicket.replies.map((reply, index) => (
                        <div 
                          key={index}
                          className={`mb-2 p-3 rounded-lg ${
                            reply.admin 
                              ? 'bg-blue-100 ml-6' 
                              : 'bg-gray-100 mr-6'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">
                              {reply.admin ? 'Admin' : selectedTicket.name}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {reply.timestamp ? new Date(reply.timestamp.seconds * 1000).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-gray-800">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Reply form */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                      rows="4"
                      required
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Send Reply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p className="text-lg font-medium">Select a ticket to view details</p>
                <p className="text-sm mt-2">Click on any message from the list on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportTickets;
