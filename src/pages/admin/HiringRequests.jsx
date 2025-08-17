import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Button from '../../components/ui/Button';
import { FaDownload } from 'react-icons/fa';

const HiringRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'recruitmentRequests'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
      } catch (error) {
        console.error('Error fetching hiring requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const exportToCsv = () => {
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Position', 'Job Description', 'Skills', 'Employment Type', 'Compensation', 'Additional Info', 'Date'];
    const csvData = requests.map(req => [
      req.companyName,
      req.contactPerson,
      req.email,
      req.phone,
      req.position,
      req.jobDescription?.replace(/,/g, ' ').replace(/\n/g, ' '),
      req.skills,
      req.employmentType,
      req.compensation,
      req.additionalInfo,
      req.createdAt && req.createdAt.toDate ? req.createdAt.toDate().toLocaleString() : ''
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hiring-requests-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hiring Requests</h1>
        <Button onClick={exportToCsv} size="sm">
          <FaDownload className="mr-1" /> Export
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold">Requests</h2>
          </div>
          {loading ? (
            <div className="p-4 text-center">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No requests found.</div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === req.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedRequest(req)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold">{req.companyName}</p>
                      <p className="text-sm text-gray-500 truncate">{req.position}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {req.createdAt && req.createdAt.toDate ? req.createdAt.toDate().toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedRequest ? (
            <div className="h-full flex flex-col">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="font-semibold">Request Details</h2>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company Name</p>
                      <p className="font-semibold">{selectedRequest.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                      <p className="font-semibold">{selectedRequest.contactPerson}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                        {selectedRequest.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Position</p>
                    <p className="font-semibold">{selectedRequest.position}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Job Description</p>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedRequest.jobDescription}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Skills</p>
                    <p>{selectedRequest.skills}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                    <p>{selectedRequest.employmentType}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Compensation</p>
                    <p>{selectedRequest.compensation}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Additional Info</p>
                    <p>{selectedRequest.additionalInfo}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                    <p>{selectedRequest.createdAt && selectedRequest.createdAt.toDate ? selectedRequest.createdAt.toDate().toLocaleString() : ''}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-gray-500">
              <div>
                <h3 className="text-lg font-medium">No request selected</h3>
                <p className="mt-1">Select a request from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringRequests;
