import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const CertificateView = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const certRef = useRef();
  const [imgLoaded, setImgLoaded] = useState(false);
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

  const certId = certificate.certId || id;
  const certUrl = window.location.href;
  // Use the official template image (should be in public/certificate-template.png)
  const templateUrl = '/certificate-template.png';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded shadow p-6 max-w-4xl w-full text-center">
        {/* Certificate Render Area for Download */}
        <div
          ref={certRef}
          className="relative w-full max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-lg"
          style={{ aspectRatio: '16/9', background: `#fff` }}
        >
          {/* Background template image */}
          <img 
            src={templateUrl} 
            alt="Certificate Template" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
            style={{zIndex:1}} 
            onLoad={() => setImgLoaded(true)}
          />
          {/* Overlayed student name and date in correct position */}
          {imgLoaded && (
            <>
              <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center z-10">
                {/* Name overlay */}
                <div style={{position:'absolute',left:'50%',top:'38%',transform:'translate(-50%,0)',width:'100%'}}>
                  <div className="text-4xl md:text-5xl font-serif font-bold text-center tracking-wide text-black" style={{letterSpacing: '2px'}}>{certificate.name || 'STUDENT NAME'}</div>
                </div>
                {/* Date overlay */}
                <div style={{position:'absolute',left:'50%',top:'60%',transform:'translate(-50%,0)',width:'100%'}}>
                  <div className="text-lg text-center text-gray-700 font-serif">{certificate.completionDate || ''}</div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={async () => {
              if (!certRef.current) return;
              // Wait for image to load before rendering
              const img = certRef.current.querySelector('img');
              if (img && !img.complete) {
                await new Promise(res => { img.onload = res; });
              }
              const canvas = await html2canvas(certRef.current, {useCORS:true, scale:2});
              const link = document.createElement('a');
              link.download = `certificate-${certId}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
            }}
          >
            Download as Image
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={async () => {
              if (!certRef.current) return;
              const img = certRef.current.querySelector('img');
              if (img && !img.complete) {
                await new Promise(res => { img.onload = res; });
              }
              const canvas = await html2canvas(certRef.current, {useCORS:true, scale:2});
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({orientation:'landscape', unit:'pt', format:'a4'});
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
              pdf.save(`certificate-${certId}.pdf`);
            }}
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
