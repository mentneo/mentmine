/**
 * Cloudinary integration for image uploads and optimizations
 */

// Cloudinary configuration with your provided values
const CLOUDINARY_CLOUD_NAME = 'dp8bfdbab';  
const CLOUDINARY_UPLOAD_PRESET = 'cryptchat';
const CLOUDINARY_API_KEY = '337739287121541';

/**
 * Generate an optimized Cloudinary URL with transformations
 * @param {string} imageUrl - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  try {
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
    if (options.quality) transformations.push(`q_${options.quality}`);
    else transformations.push('q_auto'); // Auto quality
    transformations.push('f_auto'); // Auto format
    
    // Construct the new URL with transformations
    const publicId = urlParts.slice(uploadIndex + 1).join('/');
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations.join(',')}/${publicId}`;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return imageUrl; // Return original URL if optimization fails
  }
};

/**
 * Simple direct upload function using fetch API
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload result
 */
export const simpleUpload = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('folder', 'mentneo_images');
  
  try {
    console.log('Starting upload with:', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      preset: CLOUDINARY_UPLOAD_PRESET,
      fileType: file.type,
      fileSize: file.size
    });
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Upload success result:', result);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      thumbnailUrl: getOptimizedImageUrl(result.secure_url, { width: 150, height: 150, crop: 'fill' }),
      smallUrl: getOptimizedImageUrl(result.secure_url, { width: 400, height: 300, crop: 'fill' }),
      mediumUrl: getOptimizedImageUrl(result.secure_url, { width: 800 }),
      largeUrl: getOptimizedImageUrl(result.secure_url, { width: 1200 })
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Try both signed and unsigned upload approaches
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload result
 */
export const robustUpload = async (file) => {
  // Try unsigned upload first (with preset only)
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'mentneo_images');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (response.ok) {
      return await response.json();
    }
    
    console.log('Unsigned upload failed, trying with API key...');
    
    // If unsigned failed, try with API key
    const signedFormData = new FormData();
    signedFormData.append('file', file);
    signedFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    signedFormData.append('api_key', CLOUDINARY_API_KEY);
    signedFormData.append('folder', 'mentneo_images');
    
    const signedResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: signedFormData
      }
    );
    
    if (!signedResponse.ok) {
      const errorText = await signedResponse.text();
      throw new Error(`Both upload methods failed: ${errorText}`);
    }
    
    return await signedResponse.json();
  } catch (error) {
    console.error('All upload attempts failed:', error);
    throw error;
  }
};

/**
 * Create a FileInput component and trigger it programmatically
 * @param {Function} onFileSelected - Callback when file is selected
 */
export const createFileInput = (onFileSelected) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  document.body.appendChild(input);
  
  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelected(file);
    }
    document.body.removeChild(input);
  });
  
  input.click();
};

/**
 * Main function to handle image uploads with a simple UI approach
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Upload result
 */
export const uploadImageToCloudinary = (file, progressCallback) => {
  if (file instanceof File) {
    // Direct file upload
    return new Promise(async (resolve, reject) => {
      try {
        progressCallback?.(20);
        const result = await robustUpload(file);
        progressCallback?.(100);
        
        const formattedResult = {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          thumbnailUrl: getOptimizedImageUrl(result.secure_url, { width: 150, height: 150, crop: 'fill' }),
          smallUrl: getOptimizedImageUrl(result.secure_url, { width: 400, height: 300, crop: 'fill' }),
          mediumUrl: getOptimizedImageUrl(result.secure_url, { width: 800 }),
          largeUrl: getOptimizedImageUrl(result.secure_url, { width: 1200 })
        };
        
        resolve(formattedResult);
      } catch (error) {
        reject(error);
      }
    });
  } else {
    // File picker approach
    return new Promise((resolve, reject) => {
      progressCallback?.(10);
      
      createFileInput(async (selectedFile) => {
        try {
          progressCallback?.(30);
          const result = await robustUpload(selectedFile);
          progressCallback?.(100);
          
          const formattedResult = {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            thumbnailUrl: getOptimizedImageUrl(result.secure_url, { width: 150, height: 150, crop: 'fill' }),
            smallUrl: getOptimizedImageUrl(result.secure_url, { width: 400, height: 300, crop: 'fill' }),
            mediumUrl: getOptimizedImageUrl(result.secure_url, { width: 800 }),
            largeUrl: getOptimizedImageUrl(result.secure_url, { width: 1200 })
          };
          
          resolve(formattedResult);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
};

// For backward compatibility
export const uploadToCloudinary = uploadImageToCloudinary;

export default {
  uploadImageToCloudinary,
  simpleUpload,
  robustUpload,
  createFileInput,
  getOptimizedImageUrl,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_KEY
};
