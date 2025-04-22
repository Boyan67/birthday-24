import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Invitation Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The invitation you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
