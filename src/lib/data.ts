import type { Guest, SongSuggestion } from "./types"
import { directQuery } from "./db"
import { unstable_cache } from "next/cache"

// Get all guests with caching
export const getData = unstable_cache(
  async () => {
    try {
      console.log("Fetching all data...")
      const guestsResult = await directQuery("SELECT * FROM guests")
      const suggestionsResult = await directQuery("SELECT * FROM song_suggestions")

      console.log(`Retrieved ${guestsResult.rowCount} guests and ${suggestionsResult.rowCount} song suggestions`)

      return {
        guests: guestsResult.rows as Guest[],
        songSuggestions: suggestionsResult.rows as SongSuggestion[],
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      return { guests: [], songSuggestions: [] }
    }
  },
  ['all-data'],
  { tags: ['guests', 'songs'], revalidate: 60 } // Revalidate every 10 seconds
)

// Get a guest by ID with caching
export const getGuest = unstable_cache(
  async (guestId: string): Promise<Guest | undefined> => {
    try {
      console.log(`Fetching guest with ID: ${guestId}`)
      const result = await directQuery("SELECT * FROM guests WHERE id = $1", [guestId])

      if (result.rowCount === 0) {
        console.log(`No guest found with ID: ${guestId}`)
        return undefined
      }

      console.log(`Found guest: ${result.rows[0].name}`)
      return result.rows[0] as Guest
    } catch (error) {
      console.error("Error fetching guest:", error)
      return undefined
    }
  },
  ['guest-by-id'],
  { tags: ['guests'], revalidate: 60 } // Revalidate every 10 seconds
)

// Update a guest's RSVP status
export async function updateRsvp(guestId: string, rsvp: "yes" | "no"): Promise<Guest | null> {
  try {
    console.log(`Updating RSVP for guest ${guestId} to ${rsvp}`)
    const result = await directQuery("UPDATE guests SET rsvp = $1 WHERE id = $2 RETURNING *", [rsvp, guestId])

    if (result.rowCount === 0) {
      console.log(`No guest found with ID: ${guestId} for RSVP update`)
      return null
    }

    console.log(`Updated RSVP for guest: ${result.rows[0].name}`)
    return result.rows[0] as Guest
  } catch (error) {
    console.error("Error updating RSVP:", error)
    return null
  }
}

// Update a guest's drink preference
export async function updateDrinkPreference(guestId: string, drinkPreference: string): Promise<Guest | null> {
  try {
    console.log(`Updating drink preference for guest ${guestId} to ${drinkPreference}`)
    const result = await directQuery("UPDATE guests SET drink_preference = $1 WHERE id = $2 RETURNING *", [
      drinkPreference,
      guestId,
    ])

    if (result.rowCount === 0) {
      console.log(`No guest found with ID: ${guestId} for drink preference update`)
      return null
    }

    console.log(`Updated drink preference for guest: ${result.rows[0].name}`)
    return result.rows[0] as Guest
  } catch (error) {
    console.error("Error updating drink preference:", error)
    return null
  }
}

// Add a song suggestion
export async function addSongSuggestion(suggestion: SongSuggestion): Promise<SongSuggestion | null> {
  try {
    console.log(`Adding song suggestion for guest ${suggestion.guestId}: ${suggestion.title}`)
    const result = await directQuery(
      "INSERT INTO song_suggestions (guest_id, title, artist, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [suggestion.guestId, suggestion.title, suggestion.artist, suggestion.message],
    )

    if (result.rowCount === 0) {
      console.log(`Failed to add song suggestion`)
      return null
    }

    console.log(`Added song suggestion: ${result.rows[0].title}`)
    return result.rows[0] as SongSuggestion
  } catch (error) {
    console.error("Error adding song suggestion:", error)
    return null
  }
}

// Get song suggestions by guest ID with caching
export const getSongSuggestionsByGuest = unstable_cache(
  async (guestId: string): Promise<SongSuggestion[]> => {
    try {
      console.log(`Fetching song suggestions for guest ${guestId}`)
      const result = await directQuery("SELECT * FROM song_suggestions WHERE guest_id = $1 ORDER BY created_at DESC", [
        guestId,
      ])

      console.log(`Found ${result.rowCount} song suggestions for guest ${guestId}`)
      return result.rows as SongSuggestion[]
    } catch (error) {
      console.error("Error fetching song suggestions:", error)
      return []
    }
  },
  ['songs-by-guest-id'],
  { tags: ['songs'], revalidate: 60 } // Revalidate every 10 seconds
)
