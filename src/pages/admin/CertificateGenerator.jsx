import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const CertificateGenerator = () => {
  // Use the provided certificate template as default
  const defaultTemplate = '/certificate-template.png'; // Place your template image in public folder with this name
  const [templateUrl, setTemplateUrl] = useState(defaultTemplate);
  const [student, setStudent] = useState({ name: '', course: '', email: '', completionDate: '' });
  const [generating, setGenerating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [error, setError] = useState('');

  // Handle template upload (Cloudinary)
  const handleTemplateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await uploadImageToCloudinary(file);
      setTemplateUrl(result.url);
    } catch (err) {
      setError('Failed to upload template.');
    }
  };

  // Handle student input
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Generate certificate (placeholder logic)
  const handleGenerate = async () => {
    if (!templateUrl) {
      setError('Please upload a certificate template image before generating.');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      // Here you would use Canvas API or html2canvas to generate the certificate image/PDF
      // For now, just use the template image as a placeholder
      const certData = {
        ...student,
        templateUrl,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'certificates'), certData);
  const verificationUrl = `https://mentneo.com/certificates/${docRef.id}`;
  setCertificateUrl(verificationUrl);
  setCertificateId(docRef.id);
      // Optionally update the document with the verificationUrl and certId
      // await updateDoc(docRef, { verificationUrl, certId: docRef.id });
    } catch (err) {
      setError('Failed to generate certificate.');
    }
    setGenerating(false);
  };

  const certificateRef = useRef();
  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Certificate Generator</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Upload Certificate Template (PNG/JPG):</label>
        <input type="file" accept="image/*" onChange={handleTemplateUpload} />
        {templateUrl && <img src={templateUrl} alt="Template Preview" className="mt-2 max-h-40" />}
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Student Name:</label>
          <input name="name" className="border p-2 w-full" value={student.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Course:</label>
          <input name="course" className="border p-2 w-full" value={student.course} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Student Email:</label>
          <input name="email" className="border p-2 w-full" value={student.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Completion Date:</label>
          <input name="completionDate" type="date" className="border p-2 w-full" value={student.completionDate} onChange={handleChange} />
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Certificate'}
      </button>
  {/* Certificate Preview removed as requested */}
      {certificateUrl && (
        <div className="mt-4">
          <p className="font-medium">Certificate generated!</p>
          <div className="mb-2 text-base font-semibold text-blue-700">
            Certificate ID: <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-900">{certificateId}</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <a href={certificateUrl} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" target="_blank" rel="noopener noreferrer">
              View Certificate
            </a>
            <button
              className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-900"
              onClick={() => {
                const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;
                window.open(linkedInUrl, '_blank');
              }}
            >
              Share on LinkedIn
            </button>
            <button
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: 'My Certificate',
                    text: 'Check out my certificate!',
                    url: certificateUrl
                  });
                } else {
                  await navigator.clipboard.writeText(certificateUrl);
                  alert('Certificate link copied to clipboard!');
                }
              }}
            >
              Share Certificate
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default CertificateGenerator;
