import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        
        <Link
          href="/"
          className="bg-foreground text-background py-3 px-6 rounded-md font-medium hover:opacity-90"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}
