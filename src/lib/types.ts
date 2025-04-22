export type Guest = {
  id: string
  name: string
  rsvp: "yes" | "no" | null
  drinkPreference?: string
}

export type SongSuggestion = {
  guestId: string
  title: string
  artist: string
  message: string
}

export type GuestData = {
  guests: Guest[]
  songSuggestions: SongSuggestion[]
}
