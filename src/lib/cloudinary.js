// This file contains the Cloudinary configuration
// Using the environment variables from .env file:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
// CLOUDINARY_API_KEY
// CLOUDINARY_API_SECRET

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const uploadImageToCloudinary = async (file) => {
  if (!cloudinaryConfig.cloudName) {
    console.error('Cloudinary configuration is missing. Cloud name:', cloudinaryConfig.cloudName);
    throw new Error('Cloudinary configuration is missing');
  }

  console.log('Starting image upload process for file:', file.name);

  // Since we're using client-side upload, we'll create a server endpoint
  // to handle the upload with the API key and secret
  try {
    // Convert file to base64 for sending to our API
    const base64Data = await fileToBase64(file);
    console.log('File converted to base64, sending to API...');

    // Send to our server endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        filename: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Upload API returned error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Cloudinary upload response:', data);

    if (!data.url) {
      console.error('No URL returned from upload API:', data);
      throw new Error('No URL returned from upload API');
    }

    console.log('Successfully received image URL:', data.url);
    return data.url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
