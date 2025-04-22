import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getData } from "@/lib/data"
import { Wine, Beer, Coffee, Martini, CoffeeIcon as Cocktail, Music, Database } from "lucide-react"
import { setupDatabase } from "@/lib/actions"
import { checkDatabaseConnection } from "@/lib/db"
import {RefreshButton} from "@/components/refresh-button";

export default async function Home() {
  // Initialize the database
  await setupDatabase()

  // Check database connection
  const connectionStatus = await checkDatabaseConnection()

  // Fetch data and ensure we have arrays even if the database returns null/undefined
  const data = await getData()
  const guests = Array.isArray(data.guests) ? data.guests : []
  const songSuggestions = Array.isArray(data.songSuggestions) ? data.songSuggestions : []

  // Helper function to get drink icon
  const getDrinkIcon = (preference: string) => {
    switch (preference) {
      case "wine":
        return <Wine className="h-4 w-4 text-red-500" />
      case "beer":
        return <Beer className="h-4 w-4 text-amber-500" />
      case "cocktail":
        return <Cocktail className="h-4 w-4 text-pink-500" />
      case "martini":
        return <Martini className="h-4 w-4 text-blue-500" />
      case "non-alcoholic":
        return <Coffee className="h-4 w-4 text-brown-500" />
      default:
        return <p>{preference}</p>
    }
  }

  // Get song count for each guest
  const getSongCount = (guestId: string) => {
    return songSuggestions.filter((song) => song.guestId === guestId).length
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Boyan&apos;s Birthday Invitation Manager
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This is the admin page where you can view and manage your guest list. In a real application, this would be
          password protected.
        </p>

        {/* Database connection status */}
        <div className="mt-4 flex justify-center">
          <div
            className={`flex items-center px-4 py-2 rounded-full text-sm ${connectionStatus.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <Database className="h-4 w-4 mr-2" />
            {connectionStatus.connected ? "Database connected" : "Database connection issue"}
            <RefreshButton />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Guest List</h2>

        {guests.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">No guests found. The database may still be initializing.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/setup">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Check Database Setup
                </Button>
              </Link>
              <Link href="/api/debug">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  View Debug Info
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">RSVP Status</th>
                  <th className="py-3 px-4 text-left">Drink Preference</th>
                  <th className="py-3 px-4 text-left">Songs</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{guest.name}</td>
                    <td className="py-3 px-4">
                      {guest.rsvp === "yes" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Attending
                        </span>
                      )}
                      {guest.rsvp === "no" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not Attending
                        </span>
                      )}
                      {guest.rsvp === null && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {guest.drink_preference ? (
                        <div className="flex items-center gap-2">
                          {getDrinkIcon(guest.drink_preference)}
                          <span className="capitalize">{guest.drink_preference}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getSongCount(guest.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-purple-500" />
                          <span>
                            {getSongCount(guest.id)} song{getSongCount(guest.id) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No songs</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link href={`/invite/${guest.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            View Invite
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Song Suggestions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Song Suggestions</h2>

        {songSuggestions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No song suggestions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Guest</th>
                  <th className="py-3 px-4 text-left">Song</th>
                  <th className="py-3 px-4 text-left">Artist</th>
                  <th className="py-3 px-4 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {songSuggestions.map((song, index) => {
                  const guest = guests.find((g) => g.id === song.guestId)
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{guest?.name || "Unknown"}</td>
                      <td className="py-3 px-4 font-medium">{song.title}</td>
                      <td className="py-3 px-4">{song.artist || "—"}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600 truncate max-w-xs">{song.message || "—"}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
