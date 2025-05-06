'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export default function ImageUpload({ initialImage, onImageUpload }) {
  const [image, setImage] = useState(initialImage || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file);
      console.log('ImageUpload component - Cloudinary URL received:', cloudinaryUrl);

      if (!cloudinaryUrl) {
        setError('Failed to get image URL from server');
        console.error('No URL returned from uploadImageToCloudinary');
        return;
      }

      // Revoke the preview URL to free memory
      URL.revokeObjectURL(previewUrl);

      // Set the Cloudinary URL and notify parent
      setImage(cloudinaryUrl);
      console.log('ImageUpload component - Calling onImageUpload with URL:', cloudinaryUrl);

      // Make sure we're passing the URL to the parent component
      if (typeof onImageUpload === 'function') {
        // Add a small delay to ensure the state update completes
        setTimeout(() => {
          onImageUpload(cloudinaryUrl);
          console.log('ImageUpload component - URL passed to parent after delay:', cloudinaryUrl);

          // Add a data attribute to the image for backup retrieval
          const imgElement = document.querySelector('img[alt="Event preview"]');
          if (imgElement) {
            imgElement.dataset.cloudinaryUrl = cloudinaryUrl;
          }
        }, 100);
      } else {
        console.error('onImageUpload is not a function:', onImageUpload);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Event Image
      </label>

      <div className="mt-1 flex flex-col items-center">
        {image ? (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={image}
              alt="Event preview"
              fill
              className="object-cover rounded-md"
              data-cloudinary-url={image}
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-md text-sm shadow-md"
            >
              Change
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center cursor-pointer mb-4"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {uploading ? 'Uploading...' : 'Click to upload an image'}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>
    </div>
  );
}
