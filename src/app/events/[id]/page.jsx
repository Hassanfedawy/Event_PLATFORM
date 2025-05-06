import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEventById, isEventBookedByUser } from "@/lib/eventService";
import Image from "next/image";
import Link from "next/link";
import BookNowButton from "@/components/BookNowButton";
import { notFound } from "next/navigation";

// Function to get category color based on category name
const getCategoryColor = (category) => {
  const categoryColors = {
    'Conference': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Workshop': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Seminar': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Networking': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Concert': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Exhibition': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'Sports': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return categoryColors[category] || categoryColors['Other'];
};

export async function generateMetadata({ params }) {
  const event = await getEventById(params.id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | Event Details`,
    description: event.description,
  };
}

export default async function EventDetailsPage({ params }) {
  const session = await getServerSession(authOptions);
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  let isBooked = false;
  if (session?.user?.id) {
    isBooked = await isEventBookedByUser(event.id, session.user.id);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const availableTickets = event.availableTickets
    ? event.availableTickets - (event.bookings?.length || 0)
    : 100 - (event.bookings?.length || 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Events
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-gray-700">
          <div className="relative h-96 w-full">
            <Image
              src={event.imageUrl || '/event-placeholder.jpg'}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <span className={`inline-block mb-3 text-sm font-medium px-3 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                {event.category || 'Other'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{event.title}</h1>
              <p className="text-white/90 mb-2 drop-shadow-md flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
                {formatDate(event.date)}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
              <div className="flex-1">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">About This Event</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{event.description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Venue</h2>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300">{event.venue}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Organizer</h2>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300">{event.creator.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg w-full md:w-80 flex flex-col border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${event.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"></path>
                    </svg>
                    <p className="text-gray-600 dark:text-gray-300">
                      {availableTickets} tickets available
                    </p>
                  </div>
                </div>

                {isBooked ? (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 py-3 px-4 rounded-md text-center font-medium mb-4 border border-green-200 dark:border-green-800 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    You have booked this event
                  </div>
                ) : (
                  <BookNowButton eventId={event.id} />
                )}

                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-md">
                  <p className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    One ticket per booking
                  </p>
                  <p className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    No payment required
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
