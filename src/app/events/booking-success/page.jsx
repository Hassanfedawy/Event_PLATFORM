import Link from "next/link";

export const metadata = {
  title: "Booking Successful | Event Platform",
  description: "Your event has been successfully booked.",
};

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600 dark:text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Booking Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your event has been successfully booked. Thank you for using our platform!
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="bg-foreground text-background py-3 px-6 rounded-md font-medium hover:opacity-90"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
