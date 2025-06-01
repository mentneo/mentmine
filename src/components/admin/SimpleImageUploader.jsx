import React, { useState, useRef } from 'react';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { FaUpload, FaSpinner, FaImage, FaTimes } from 'react-icons/fa';

const SimpleImageUploader = ({ onImageUploaded, currentImage, label = 'Image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    
    setIsUploading(true);
    setError(null);
    setProgress(10);
    
    try {
      // Try three different upload methods if necessary
      let result;
      try {
        // First try with the standard uploadImageToCloudinary
        result = await uploadImageToCloudinary(file, setProgress);
      } catch (firstError) {
        console.warn("First upload attempt failed, trying direct fetch:", firstError);
        setProgress(20);
        
        // If that fails, try a direct fetch approach
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'cryptchat');
        formData.append('folder', 'mentneo_images');
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/davjxvz8w/image/upload`,
          { method: 'POST', body: formData }
        );
        
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        
        const cloudinaryResponse = await response.json();
        
        result = {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
          format: cloudinaryResponse.format
        };
      }
      
      console.log("Upload complete:", result);
      
      if (onImageUploaded) {
        onImageUploaded(result);
      }
      
      setPreview(result.url);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Preview area */}
      {preview && (
        <div className="mb-2 relative">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg shadow-sm border border-gray-200"
          />
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Upload button */}
      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={isUploading}
        className={`relative flex items-center justify-center px-4 py-2 
                    ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                    text-white rounded transition-colors`}
      >
        {isUploading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Uploading... {progress > 0 && `(${progress}%)`}
          </>
        ) : (
          <>
            {preview ? <FaImage className="mr-2" /> : <FaUpload className="mr-2" />}
            {preview ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <FaTimes className="mr-1" /> {error}
        </div>
      )}
    </div>
  );
};

export default SimpleImageUploader;
