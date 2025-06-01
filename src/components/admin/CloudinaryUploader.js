import React, { useEffect, useState } from 'react';

function CloudinaryUploader({ onUploadSuccess, onUploadError, onUploadProgress }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    // Load the Cloudinary Upload Widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const openWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script not loaded");
      return;
    }
    
    const uploadOptions = {
      cloudName: 'davjxvz8w',
      uploadPreset: 'ml_default',
      folder: 'mentneo_images',
      sources: ['local', 'url', 'camera'],
      multiple: false,
      resource_type: 'image',
      clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      maxImageFileSize: 10000000, // 10MB
    };
    
    const callback = (error, result) => {
      if (error) {
        console.error('Upload error:', error);
        if (onUploadError) onUploadError(error);
        return;
      }
      
      if (result.event === 'success') {
        const imageData = {
          url: result.info.secure_url,
          publicId: result.info.public_id,
          width: result.info.width,
          height: result.info.height,
          format: result.info.format,
          thumbnailUrl: getOptimizedImageUrl(result.info.secure_url, { width: 150, height: 150, crop: 'fill' }),
          smallUrl: getOptimizedImageUrl(result.info.secure_url, { width: 400, height: 300, crop: 'fill' }),
          mediumUrl: getOptimizedImageUrl(result.info.secure_url, { width: 800 }),
          largeUrl: getOptimizedImageUrl(result.info.secure_url, { width: 1200 })
        };
        
        if (onUploadSuccess) onUploadSuccess(imageData);
      }
      
      if (result.event === 'progress' && onUploadProgress) {
        onUploadProgress(result.loaded / result.total * 100);
      }
    };
    
    const widget = window.cloudinary.createUploadWidget(uploadOptions, callback);
    widget.open();
  };

  function getOptimizedImageUrl(imageUrl, options = {}) {
    if (!imageUrl) return '';
    
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return imageUrl;
    
    const transformations = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (!options.crop && (options.width || options.height)) transformations.push('c_limit');
    transformations.push('q_auto', 'f_auto');
    
    const publicId = urlParts.slice(uploadIndex + 1).join('/');
    return `https://res.cloudinary.com/davjxvz8w/image/upload/${transformations.join(',')}/${publicId}`;
  }
  
  return (
    <button
      onClick={openWidget}
      disabled={!scriptLoaded}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
    >
      Upload Image
    </button>
  );
}

export default CloudinaryUploader;
