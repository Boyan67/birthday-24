"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong!</h1>
      <p className="text-gray-600 max-w-md mb-6">
        We&apos;re having trouble connecting to the database. This could be due to a temporary issue.
      </p>
      <div className="space-y-4">
        <Button onClick={() => reset()} className="bg-purple-600 hover:bg-purple-700">
          Try again
        </Button>
        <div>
          <a href="/api/init-db" className="text-purple-600 hover:underline">
            Initialize Database
          </a>
        </div>
      </div>
    </div>
  )
}
