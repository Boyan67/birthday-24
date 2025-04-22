"use server"

import { updateRsvp, updateDrinkPreference, addSongSuggestion, getSongSuggestionsByGuest } from "./data"
import type { SongSuggestion } from "./types"
import { revalidatePath } from "next/cache"
import { initializeDatabase, checkDatabaseConnection } from "./db"

// Initialize the database when the server starts
export async function setupDatabase() {
  const connectionStatus = await checkDatabaseConnection()

  if (!connectionStatus.connected) {
    console.log("Database not connected, attempting to initialize...")
    return await initializeDatabase()
  }

  return { success: true, message: "Database already connected" }
}

// Check database connection
export async function checkConnection() {
  return await checkDatabaseConnection()
}

export async function submitRsvp(guestId: string, response: "yes" | "no") {
  const guest = await updateRsvp(guestId, response)
  revalidatePath(`/invite/${guestId}`)
  return guest
}

export async function submitDrinkPreference(guestId: string, drinkPreference: string) {
  const guest = await updateDrinkPreference(guestId, drinkPreference)
  revalidatePath(`/invite/${guestId}`)
  return guest
}

export async function submitSongSuggestion(formData: FormData) {
  const guestId = formData.get("guestId") as string
  const title = formData.get("title") as string
  const artist = formData.get("artist") as string
  const message = formData.get("message") as string

  if (!guestId || !title) {
    return { success: false, error: "Missing required fields" }
  }

  const suggestion: SongSuggestion = {
    guestId,
    title,
    artist,
    message,
  }

  const result = await addSongSuggestion(suggestion)
  revalidatePath(`/suggest-a-song/${guestId}`)

  return { success: !!result }
}

export async function fetchGuestSongs(guestId: string) {
  return await getSongSuggestionsByGuest(guestId)
}
