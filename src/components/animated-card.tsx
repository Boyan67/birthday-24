"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
}

export function AnimatedCard({ children }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      className="md:bg-white md:rounded-xl md:shadow-lg md:overflow-hidden"
    >
      {children}
    </motion.div>
  )
}
