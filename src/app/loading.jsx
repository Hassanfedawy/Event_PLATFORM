export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto pt-8 md:pt-16">
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full md:flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full md:w-64 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-gray-700 animate-pulse"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
