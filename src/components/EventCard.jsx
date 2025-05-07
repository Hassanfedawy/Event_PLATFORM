"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Function to get category color based on category name
const getCategoryColor = (category) => {
  const categoryColors = {
    'Conference': 'bg-blue-100 text-blue-800',
    'Workshop': 'bg-purple-100 text-purple-800',
    'Seminar': 'bg-green-100 text-green-800',
    'Networking': 'bg-yellow-100 text-yellow-800',
    'Concert': 'bg-pink-100 text-pink-800',
    'Exhibition': 'bg-indigo-100 text-indigo-800',
    'Sports': 'bg-red-100 text-red-800',
    'Other': 'bg-gray-100 text-gray-800',
  };

  return categoryColors[category] || categoryColors['Other'];
};

export default function EventCard({ event, isBooked }) {
  const { data: session } = useSession();
  const [booking, setBooking] = useState(false);
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBooking = async () => {
    if (!session) {
      toast.error('Please sign in to book this event');
      router.push('/auth/signin');
      return;
    }

    setBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      if (response.ok) {
        toast.success('Event booked successfully!');
        // Redirect to success page
        router.push('/events/booking-success');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to book event');
      }
    } catch (error) {
      toast.error('An error occurred while booking the event');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="relative h-48 sm:h-52 w-full">
        <Link href={`/events/${event.id}`} className="cursor-pointer block h-full">
          <Image
            src={event.imageUrl || '/event-placeholder.jpg'}
            alt={event.title}
            fill
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      <div className="p-4 sm:p-6 flex-grow">
        <div className="flex flex-wrap justify-between items-start mb-3 sm:mb-4 gap-2">
          <Link href={`/events/${event.id}`} className="cursor-pointer">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">{event.title}</h3>
          </Link>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(event.category)}`}>
            {event.category || 'Other'}
          </span>
        </div>
        <div className="flex items-center mb-2 sm:mb-3">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{formatDate(event.date)}</p>
        </div>
        <div className="flex items-center mb-2 sm:mb-3">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{event.venue}</p>
        </div>
        <div className="flex items-center mb-3 sm:mb-4">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
          </svg>
          <p className="font-semibold text-blue-600 dark:text-blue-400">${event.price.toFixed(2)}</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3 text-sm">{event.description}</p>

        <div className="mt-auto">
          <Link
            href={`/events/${event.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center mb-4"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {isBooked ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-center py-2.5 sm:py-3 rounded-md font-medium border border-green-200 dark:border-green-800">
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Booked
            </span>
          </div>
        ) : (
          <button
            onClick={handleBooking}
            disabled={booking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-4 rounded-md font-medium transition-colors duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {booking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
                Book Now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}