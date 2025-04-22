export type Guest = {
  id: string
  name: string
  rsvp: "yes" | "no" | null
  drink_preference?: string
}

export type SongSuggestion = {
  guest_id: string
  title: string
  artist: string
  message: string
}

export type GuestData = {
  guests: Guest[]
  songSuggestions: SongSuggestion[]
}
