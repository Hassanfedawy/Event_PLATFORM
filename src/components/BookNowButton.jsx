'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function BookNowButton({ eventId }) {
  const { data: session } = useSession();
  const [booking, setBooking] = useState(false);
  const router = useRouter();

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
          eventId,
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
    <button
      onClick={handleBooking}
      disabled={booking}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
  );
}
