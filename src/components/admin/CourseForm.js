import React, { useState } from 'react';
import { uploadImageToCloudinary } from './utils/cloudinary'; // Adjust the import based on your file structure

const ImageUploader = ({ onImageUploaded, currentImageUrl }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    try {
      const uploadedImage = await uploadImageToCloudinary(image, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      
      setUploading(false);
      setImage(null);
      setPreviewUrl('');
      
      // Call the parent callback with the uploaded image data
      onImageUploaded(uploadedImage);
    } catch (error) {
      setUploading(false);
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className="image-uploader">
      {previewUrl && (
        <div className="mb-2">
          <img
            src={previewUrl}
            alt="Image preview"
            className="rounded-md"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
      />
      
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 w-full inline-flex justify-center rounded-md border border-transparent
          bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:pointer-events-none
        "
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUploader;