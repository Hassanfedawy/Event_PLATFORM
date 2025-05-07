'use client';

import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function SignOutButton({ fullWidth = false }) {
  const handleSignOut = () => {
    toast.success("Signed out successfully!");
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`${fullWidth ? 'w-full justify-center' : ''} bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-4 py-2 rounded-md text-sm font-medium shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex items-center`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
      Sign Out
    </button>
  );
}
