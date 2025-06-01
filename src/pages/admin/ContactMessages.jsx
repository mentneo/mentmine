import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEnvelope, FaEnvelopeOpen, FaDownload } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/contact-messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`/api/contact-messages/${id}/read`, { method: 'PUT' });
      setMessages(messages.map(message => {
        if (message.id === id) {
          return { ...message, read: true };
        }
        return message;
      }));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
        setMessages(messages.filter(message => message.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'];
    const csvData = messages.map(msg => [
      msg.name,
      msg.email,
      msg.subject,
      msg.message.replace(/,/g, ' ').replace(/\n/g, ' '),
      new Date(msg.createdAt).toLocaleString(),
      msg.read ? 'Read' : 'Unread'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-messages-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(msg => filter === 'read' ? msg.read : !msg.read);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="flex items-center space-x-3">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button 
              className={`px-3 py-1 text-sm ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>
          <Button onClick={exportToCsv} size="sm">
            <FaDownload className="mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold">Messages</h2>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages found.</div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  } ${!message.read ? 'font-semibold' : ''}`}
                  onClick={() => viewMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{message.name}</p>
                      <p className="text-sm text-gray-500 truncate">{message.subject || 'No subject'}</p>
                    </div>
                    <div className="flex items-center">
                      {!message.read && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="font-semibold">Message Details</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className={`p-2 rounded-full ${selectedMessage.read ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                    disabled={selectedMessage.read}
                  >
                    {selectedMessage.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-red-600 rounded-full hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">From</p>
                      <p className="font-semibold">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Subject</p>
                    <p className="font-semibold">{selectedMessage.subject || 'No subject'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Received on</p>
                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <Button onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                  Reply via Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-gray-500">
              <div>
                <FaEnvelope className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No message selected</h3>
                <p className="mt-1">Select a message from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
