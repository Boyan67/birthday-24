export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading</h2>
      <p className="text-gray-500 text-center max-w-md">
        Connecting to the database and initializing the application...
      </p>
    </div>
  )
}
