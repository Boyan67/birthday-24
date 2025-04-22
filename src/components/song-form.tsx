"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitSongSuggestion, fetchGuestSongs } from "@/lib/actions"
import { Music, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SongFormProps {
  guestId: string
}

export function SongForm({ guestId }: SongFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [songCount, setSongCount] = useState(0)
  const [suggestedSongs, setSuggestedSongs] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  // Fetch existing song suggestions on component mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await fetchGuestSongs(guestId)
        // Ensure songs is an array before mapping
        if (Array.isArray(songs)) {
          setSuggestedSongs(songs.map((song) => song.title))
          setSongCount(songs.length)
        }
      } catch (error) {
        console.error("Error fetching songs:", error)
      }
    }

    fetchSongs()
  }, [guestId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append("guestId", guestId)

    // Get the song title before potentially resetting the form
    const newTitle = formData.get("title") as string

    const result = await submitSongSuggestion(formData)

    if (result.success) {
      // Reset the form before changing state
      if (formRef.current) {
        formRef.current.reset()
      }

      // Add the new song title to the list
      setSuggestedSongs((prev) => [...prev, newTitle])
      setSongCount((prev) => prev + 1)
      setIsSubmitted(true)
    }

    setIsSubmitting(false)
  }

  const handleSuggestAnother = () => {
    setIsSubmitted(false)
  }

  const formControls = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <div>
      {suggestedSongs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-purple-50 rounded-lg"
        >
          <h3 className="font-medium text-purple-700 mb-2">Your suggested songs:</h3>
          <ul className="space-y-1 text-purple-600">
            {suggestedSongs.map((song, index) => (
              <li key={index} className="flex items-center gap-2">
                <Music className="h-4 w-4 flex-shrink-0" />
                <span>{song}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-3 p-6 bg-purple-50 rounded-lg"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              <Music className="h-10 w-10 text-purple-500" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-medium text-purple-700"
            >
              Thanks for your suggestion!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-purple-600"
            >
              We&apos;ll add it to the playlist for the party.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <Button
                onClick={handleSuggestAnother}
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Suggest Another Song
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            ref={formRef}
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div className="space-y-2" custom={0} variants={formControls}>
              <Label htmlFor="title">
                Song Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter song title"
                required
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </motion.div>

            <motion.div className="space-y-2" custom={1} variants={formControls}>
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                name="artist"
                placeholder="Enter artist name"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </motion.div>

            <motion.div className="space-y-2" custom={2} variants={formControls}>
              <Label htmlFor="message">Message or Shout-out</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Add a little message or shout-out (optional)"
                rows={3}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </motion.div>

            <motion.div custom={3} variants={formControls}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : songCount > 0 ? "Suggest Another Song" : "Submit Song Suggestion"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
