import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

const CertificateHistory = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', course: '', completionDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const snap = await getDocs(collection(db, 'certificates'));
        setCertificates(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to fetch certificates.');
      }
      setLoading(false);
    };
    fetchCertificates();
  }, []);

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setEditData({
      name: cert.name || '',
      email: cert.email || '',
      course: cert.course || '',
      completionDate: cert.completionDate || '',
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const certRef = doc(db, 'certificates', editingId);
      await updateDoc(certRef, {
        ...editData,
        updatedAt: Timestamp.now(),
      });
      setCertificates(certificates.map(cert => cert.id === editingId ? { ...cert, ...editData } : cert));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update certificate.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Helper to format Firestore Timestamp or string
  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') return dateVal;
    if (dateVal.seconds) {
      const d = new Date(dateVal.seconds * 1000);
      return d.toLocaleDateString();
    }
    return '';
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Certificate History</h2>
      <table className="w-full border rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="p-2 border border-blue-700">ID</th>
            <th className="p-2 border border-blue-700">Name</th>
            <th className="p-2 border border-blue-700">Email</th>
            <th className="p-2 border border-blue-700">Course</th>
            <th className="p-2 border border-blue-700">Completion Date</th>
            <th className="p-2 border border-blue-700">QR</th>
            <th className="p-2 border border-blue-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-100">
          {certificates.map(cert => {
            const certUrl = `https://mentneo.com/certificates/${cert.id}`;
            return (
              <tr key={cert.id} className="hover:bg-blue-50">
                <td className="p-2 border border-blue-100 font-mono text-xs text-blue-900">{cert.id}</td>
                {editingId === cert.id ? (
                  <>
                    <td className="p-2 border border-blue-100"><input name="name" value={editData.name} onChange={handleEditChange} className="border p-1 w-full rounded" /></td>
                    <td className="p-2 border border-blue-100"><input name="email" value={editData.email} onChange={handleEditChange} className="border p-1 w-full rounded" /></td>
                    <td className="p-2 border border-blue-100"><input name="course" value={editData.course} onChange={handleEditChange} className="border p-1 w-full rounded" /></td>
                    <td className="p-2 border border-blue-100"><input name="completionDate" type="date" value={editData.completionDate} onChange={handleEditChange} className="border p-1 w-full rounded" /></td>
                    <td className="p-2 border border-blue-100"></td>
                    <td className="p-2 border border-blue-100">
                      <button className="bg-green-600 text-white px-2 py-1 rounded mr-2 hover:bg-green-700" onClick={handleSave}>Save</button>
                      <button className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500" onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border border-blue-100 text-blue-900">{cert.name}</td>
                    <td className="p-2 border border-blue-100 text-blue-900">{cert.email}</td>
                    <td className="p-2 border border-blue-100 text-blue-900">{cert.course}</td>
                    <td className="p-2 border border-blue-100 text-blue-900">{formatDate(cert.completionDate)}</td>
                    <td className="p-2 border border-blue-100"><QRCodeCanvas value={certUrl} size={48} level="M" includeMargin={false} /></td>
                    <td className="p-2 border border-blue-100">
                      <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" onClick={() => handleEdit(cert)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateHistory;
