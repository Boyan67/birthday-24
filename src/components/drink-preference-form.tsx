"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitDrinkPreference } from "@/lib/actions"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wine,
  Beer,
  Martini,
  Sparkles as Cocktail,
  Check,
  BeerOff,
  Wheat,
  Citrus,
  Skull,
  AmphoraIcon
} from "lucide-react"

interface DrinkPreferenceFormProps {
  guestId: string
  guestName: string
}

const drinkOptions = [
  { value: "wine", label: "Вино", icon: Wine },
  { value: "beer", label: "Бира", icon: Beer },
  { value: "cocktail", label: "Коктейл", icon: Cocktail },
  { value: "vodka", label: "Водка", icon: Martini },
  { value: "whiskey", label: "Уиски", icon: Wheat  },
  { value: "tequila", label: "Текила", icon: Citrus  },
  { value: "rakia", label: "Ракиа", icon: AmphoraIcon },
  { value: "gin", label: "Джин", icon: Skull },
  { value: "non-alcoholic", label: "Безалкохолно?", icon: BeerOff },
]

export function DrinkPreferenceForm({ guestId, guestName }: DrinkPreferenceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedDrink) return

    setIsSubmitting(true)
    await submitDrinkPreference(guestId, selectedDrink)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Check className="h-8 w-8 text-blue-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-blue-700 text-center"
          >
            Благодаря! Ще се погрижим да имаме предпочитаната от вас напитка.
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
        >
          <h3 className="text-lg font-medium text-blue-800 mb-4 text-center">
            {guestName}, какво бихте искали да пиете на партито?
          </h3>

          <RadioGroup value={selectedDrink || ""} onValueChange={setSelectedDrink} className="gap-3">
            {drinkOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex">
                  <Label
                    htmlFor={option.value}
                    className={`flex items-center gap-3 p-3 w-full rounded-md border cursor-pointer ${
                      selectedDrink === option.value
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <Icon className={`h-5 w-5 ${selectedDrink === option.value ? "text-blue-600" : "text-gray-500"}`} />
                    <span className={selectedDrink === option.value ? "font-medium text-blue-700" : "text-gray-700"}>
                      {option.label}
                    </span>
                  </Label>
                </motion.div>
              )
            })}
          </RadioGroup>

          <motion.div className="mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || !selectedDrink}
            >
              {isSubmitting ? "Запазване..." : "Запази предпочитание"}
            </Button>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
