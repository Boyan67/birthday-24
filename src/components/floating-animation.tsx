"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FloatingAnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
}

export function FloatingAnimation({ children, delay = 0, duration = 3, y = 10 }: FloatingAnimationProps) {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
