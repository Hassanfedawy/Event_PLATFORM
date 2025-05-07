'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/NavBar';

export default function NavbarWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Check if current path is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  // Don't show navbar on admin pages
  if (isAdminPage) {
    return null;
  }

  if (status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md py-3 sm:py-4 px-4 sm:px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return <Navbar session={session} />;
}
