"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { submitRsvp } from "@/lib/actions"
import type { Guest } from "@/lib/types"
import { CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Confetti } from "./confetti"
import { DrinkPreferenceForm } from "./drink-preference-form"
import {useRouter} from "next/navigation";

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

  const router = useRouter()


  return (
    <>
      {showConfetti && <Confetti />}
      <div className="mt-10 mb-8 text-center">
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
                className={`font-medium ${response === "yes" ? "text-green-900" : "text-gray-700"}`}
              >
                {response === "yes"
                  ? `Благодаря ти, ${guest.name}! Очаквам с нетърпение да се забавляваме заедно!`
                  : `Ще ни липсваш, ${guest.name}. До следващия път!`}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xl font-medium text-gray-950 text-center mb-5">Ще се присъединиш ли?</p>
              <div className="flex justify-center gap-4">

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-500 bg-green-50 flex flex-1 p-6"
                    onClick={() => handleRsvp("yes")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="mr-1 -ml-1 h-5 w-5" />
                    Да
                  </Button>


                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-500 bg-red-50 hover:bg-red-50 flex flex-1 p-6"
                    onClick={() => handleRsvp("no")}
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-1 -ml-1 h-5 w-5 " />
                    Не
                  </Button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {response === "yes" && showDrinkForm &&  (
          <div ref={drinkFormRef}>
            <DrinkPreferenceForm guestId={guest.id} guestName={guest.name} />
          </div>
        )}

        {guest.drink_preference === "non-alcoholic" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 p-4 bg-red-100 rounded-lg text-red-700 text-sm"
          >
            <div className={"flex flex-col items-center text-base"}>
            <p>Ама ти верно ли няма да пиеш на моя рожден ден? 😱</p>
            <button
              onClick={() => {
                setShowDrinkForm(true)
              }}
              className="mt-4 px-4 py-3 bg-red-600 text-white rounded-lg transition duration-200 font-medium"
            >
              Пробай пак
            </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
