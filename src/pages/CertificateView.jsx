import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const CertificateView = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const certRef = doc(db, 'certificates', id);
        const certSnap = await getDoc(certRef);
        if (certSnap.exists()) {
          setCertificate(certSnap.data());
        } else {
          setError('Certificate not found.');
        }
      } catch (err) {
        setError('Error loading certificate.');
      }
      setLoading(false);
    };
    fetchCertificate();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  if (!certificate) return null;

  // Always show certificate ID, download, and share options
  const certId = certificate.certId || id;
  const certUrl = window.location.href;
  const imageUrl = certificate.templateUrl;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded shadow p-6 max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Certificate of Completion</h1>
        <img src={imageUrl} alt="Certificate Template" className="mx-auto mb-4 max-h-80" />
        <div className="mb-2 text-lg font-semibold">{certificate.name}</div>
        <div className="mb-2">Course: <span className="font-medium">{certificate.course}</span></div>
        <div className="mb-2">Completion Date: <span className="font-medium">{certificate.completionDate}</span></div>
        <div className="mb-2 text-base font-semibold text-blue-700">
          Certificate ID: <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-900">{certId}</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <a
            href={imageUrl}
            download={`certificate-${certId}.png`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Certificate
          </a>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: 'My Certificate',
                  text: 'Check out my certificate!',
                  url: certUrl
                });
              } else {
                await navigator.clipboard.writeText(certUrl);
                alert('Certificate link copied to clipboard!');
              }
            }}
          >
            Share Certificate
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Share on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
