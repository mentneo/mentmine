/**
 * Image utility functions for Mentneo
 */

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'davjxvz8w';
const CLOUDINARY_UPLOAD_PRESET = 'mentneo_uploads';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload an image to Cloudinary with progress tracking
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<Object>} - Upload result with URLs
 */
export const uploadImage = async (file, onProgress) => {
  if (!file) return null;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    if (onProgress) {
      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_API_URL, true);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve({
              url: data.secure_url,
              publicId: data.public_id,
              width: data.width,
              height: data.height,
              format: data.format,
              // Add optimized variants
              thumbnailUrl: getOptimizedImageUrl(data.secure_url, { width: 150, height: 150, crop: 'fill' }),
              smallUrl: getOptimizedImageUrl(data.secure_url, { width: 400, crop: 'fill' }),
              mediumUrl: getOptimizedImageUrl(data.secure_url, { width: 800 }),
              largeUrl: getOptimizedImageUrl(data.secure_url, { width: 1200 })
            });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
      });
    } else {
      // Use fetch API if no progress tracking needed
      const response = await fetch(CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        // Add optimized variants
        thumbnailUrl: getOptimizedImageUrl(data.secure_url, { width: 150, height: 150, crop: 'fill' }),
        smallUrl: getOptimizedImageUrl(data.secure_url, { width: 400, crop: 'fill' }),
        mediumUrl: getOptimizedImageUrl(data.secure_url, { width: 800 }),
        largeUrl: getOptimizedImageUrl(data.secure_url, { width: 1200 })
      };
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

/**
 * Generate optimized image URL with Cloudinary transformations
 * @param {string} imageUrl - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Extract public ID from the URL
  const urlParts = imageUrl.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');
  if (uploadIndex === -1) return imageUrl;
  
  // Default transformations
  const transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (!options.crop && (options.width || options.height)) transformations.push('c_limit');
  transformations.push('q_auto', 'f_auto'); // Auto quality and format
  
  // Construct the new URL with transformations
  const publicId = urlParts.slice(uploadIndex + 1).join('/');
  return `${CLOUDINARY_BASE_URL}/${transformations.join(',')}/${publicId}`;
};

/**
 * Get image placeholder URL for lazy loading
 * @param {string} imageUrl - Original Cloudinary URL
 * @returns {string} - Low quality placeholder URL
 */
export const getPlaceholderUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, { width: 30, height: 30, crop: 'fill', quality: 30 });
};

export default {
  uploadImage,
  getOptimizedImageUrl,
  getPlaceholderUrl,
  CLOUDINARY_CLOUD_NAME
};
