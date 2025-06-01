import React, { useState } from 'react';
import { simpleUpload } from '../../utils/cloudinary';
import { FaUpload, FaImage, FaSpinner, FaTimes, FaCheck } from 'react-icons/fa';

/**
 * Simple image uploader component for admin
 */
function ImageUploader({ onImageUploaded, className, buttonText = 'Upload Image', currentImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      // Show preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setUploadProgress(30);

      // Upload to Cloudinary
      const result = await simpleUpload(file);
      setUploadProgress(100);
      
      // Pass result to parent component
      if (onImageUploaded) {
        onImageUploaded(result);
      }
      
      // Update preview to cloudinary URL
      setPreviewUrl(result.url);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    // Create a temporary file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileChange;
    input.click();
  };

  return (
    <div className={className}>
      {/* Preview area */}
      {previewUrl && (
        <div className="mb-3 relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md" 
          />
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 disabled:bg-blue-400 w-full transition-colors`}
      >
        {isUploading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Uploading... {uploadProgress > 0 && `(${uploadProgress}%)`}
          </>
        ) : uploadProgress === 100 ? (
          <>
            <FaCheck className="mr-2" />
            Upload Complete
          </>
        ) : (
          <>
            {previewUrl ? <FaImage className="mr-2" /> : <FaUpload className="mr-2" />}
            {previewUrl ? 'Change Image' : buttonText}
          </>
        )}
      </button>

      {/* Error message */}
      {uploadError && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <FaTimes className="mr-1" />
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
