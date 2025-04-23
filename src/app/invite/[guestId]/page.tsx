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
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white text-center">
          <div className="mb-2">
            <AnimatedEmoji emoji="🎉" animation="bounce" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Поканени сте на рождения ден на {eventDetails.name}!</h1>
          <p className="font-light">Специална покана за <strong>{guest.name}✨</strong></p>
        </div>

        <div className="p-6 bg-white">
          <div className="space-y-4 mb-6 text-lg font-medium">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-pink-500 flex-shrink-0"/>
              <p className="text-gray-950">{eventDetails.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-pink-500 flex-shrink-0"/>
              <p className="text-gray-950">{eventDetails.location}</p>
            </div>
            <a href={eventDetails.mapUrl} target="_blank" rel="noopener noreferrer"
               className="text-nowrap py-1.5 px-2 border rounded text-sm flex justify-center border-gray-300 text-gray-700 hover:bg-gray-50">
              Виж на картата
            </a>
          </div>

          <RsvpButtons guest={guest}/>

          <div className="mt-8 text-center">
            <Link href={`/suggest-a-song/${guest.id}`} className="inline-flex items-center text-purple-600 text-base hover:bg-purple-50 flex gap-1 font-medium py-2 px-5">

                <Music className="mr-2 h-4.5 w-4.5" />
                Предложи песен

            </Link>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}
