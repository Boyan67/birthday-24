import { notFound } from "next/navigation"
import { getGuest } from "@/lib/data"
import { RsvpButtons } from "@/components/rsvp-buttons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar, Music } from "lucide-react"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedEmoji } from "@/components/animated-emoji"

export default async function InvitePage({ params }: { params: Promise<{ guestId: string }> }) {
  const guest = await getGuest((await params).guestId)

  if (!guest) {
    notFound()
  }

  const eventDetails = {
    name: "Боян",
    date: "30 Април · 19:30",
    location: "Блок 25, Малинова Долина, София",
    mapUrl: "https://maps.google.com/?q=Блок+25+Малинова+Долина+София",
  }

  return (
    <div className="container max-w-md mx-auto md:mt-20">
      <AnimatedCard>
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white text-center">
          <div className="mb-2">
            <AnimatedEmoji emoji="🎉" animation="bounce" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Поканени сте на рождения ден на {eventDetails.name}!</h1>
          <p className="font-light">Специална покана за {guest.name}</p>
        </div>

        <div className="p-6 bg-white">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-pink-500 flex-shrink-0" />
              <p className="text-gray-700">{eventDetails.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-pink-500 flex-shrink-0" />
              <p className="text-gray-700">{eventDetails.location}</p>
            </div>

            <a href={eventDetails.mapUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                Виж на картата
              </Button>
            </a>
          </div>

          <RsvpButtons guest={guest} />

          <div className="mt-8 text-center">
            <Link href={`/suggest-a-song/${guest.id}`} className="inline-flex items-center">
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
                <Music className="mr-2 h-5 w-5" />
                Предложи песен
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}
