"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { submitRsvp } from "@/lib/actions"
import type { Guest } from "@/lib/types"
import { CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Confetti } from "./confetti"
import { DrinkPreferenceForm } from "./drink-preference-form"

interface RsvpButtonsProps {
  guest: Guest
}

export function RsvpButtons({ guest }: RsvpButtonsProps) {
  const [response, setResponse] = useState<"yes" | "no" | null>(guest.rsvp)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDrinkForm, setShowDrinkForm] = useState(false)
  const drinkFormRef = useRef<HTMLDivElement>(null)

  const handleRsvp = async (answer: "yes" | "no") => {
    setIsSubmitting(true)
    await submitRsvp(guest.id, answer)
    setResponse(answer)
    setIsSubmitting(false)

    if (answer === "yes") {
      setShowConfetti(true)
      setTimeout(() => {
        setShowDrinkForm(true)
      }, 1500)

      window.scrollTo({
        top: window.scrollY + 2000,
        behavior: "smooth",
      })

      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  useEffect(() => {
    if (showDrinkForm && drinkFormRef.current) {
      setTimeout(() => {
        drinkFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 100)
    }
  }, [showDrinkForm])

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          {response ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg ${
                response === "yes" ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {response === "yes" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-gray-500" />
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-lg font-medium ${response === "yes" ? "text-green-700" : "text-gray-700"}`}
              >
                {response === "yes"
                  ? `Благодарим ти, ${guest.name}! Очаквам с нетърпение да се забавляваме заедно!`
                  : `Ще ни липсваш, ${guest.name}. До следващия път!`}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xl font-medium text-center mb-4">Ще се присъединиш ли към нас?</p>
              <div className="flex justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleRsvp("yes")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Да
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleRsvp("no")}
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Не
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {response === "yes" && showDrinkForm && !guest.drinkPreference && (
          <div ref={drinkFormRef}>
            <DrinkPreferenceForm guestId={guest.id} guestName={guest.name} />
          </div>
        )}

        {response === "yes" && guest.drinkPreference && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm"
          >
            Твоето предпочитание за питие ({guest.drinkPreference}) е запазено!
          </motion.div>
        )}
      </div>
    </>
  )
}
