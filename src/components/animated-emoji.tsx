"use client"

import { motion } from "framer-motion"

interface AnimatedEmojiProps {
  emoji: string
  size?: string
  animation?: "bounce" | "pulse" | "shake" | "spin"
}

export function AnimatedEmoji({ emoji, size = "text-4xl", animation = "bounce" }: AnimatedEmojiProps) {
  const animations = {
    bounce: {
      y: ["0%", "-30%", "0%"],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
    shake: {
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        repeatDelay: 1,
      },
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "linear",
      },
    },
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <motion.span className={`inline-block ${size}`} animate={animations[animation] as any}>
      {emoji}
    </motion.span>
  )
}
