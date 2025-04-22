import { notFound } from "next/navigation"
import { getGuest } from "@/lib/data"
import { SongForm } from "@/components/song-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedEmoji } from "@/components/animated-emoji"

export default async function SuggestSongPage({ params }: { params: Promise<{ guestId: string }> }) {
  const guest = await getGuest((await params).guestId)

  if (!guest) {
    notFound()
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <AnimatedCard>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white text-center">
          <div className="mb-2">
            <AnimatedEmoji emoji="🎶" animation="pulse" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{guest.name}, got a song in mind?</h1>
          <p className="opacity-90">Help us create the perfect playlist for Boyan&apos;s birthday!</p>
        </div>

        <div className="p-6 bg-white">
          <SongForm guestId={guest.id} />

          <div className="mt-8 text-center">
            <Link href={`/invite/${guest.id}`}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to invitation
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}
