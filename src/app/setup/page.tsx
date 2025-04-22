import { initializeDatabase, checkDatabaseConnection } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SetupPage() {
  // Check database connection
  const connectionStatus = await checkDatabaseConnection()

  // Initialize database if requested
  const searchParams = new URL(process.env.VERCEL_URL || "http://localhost:3000").searchParams
  const initialize = searchParams.get("initialize") === "true"

  let initResult = null
  if (initialize) {
    initResult = await initializeDatabase()
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Database Connection Status</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">
          {JSON.stringify(connectionStatus, null, 2)}
        </pre>

        {connectionStatus.connected ? (
          <div className="flex items-center text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Database is connected
          </div>
        ) : (
          <div className="flex items-center text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Database connection failed
          </div>
        )}
      </div>

      {initResult && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Initialization Result</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(initResult, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <Link href="/setup?initialize=true">
          <Button className="w-full">Initialize Database</Button>
        </Link>

        <Link href="/api/debug">
          <Button variant="outline" className="w-full">
            View Database Debug Info
          </Button>
        </Link>

        <Link href="/">
          <Button variant="ghost" className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
