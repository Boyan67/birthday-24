"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
}

export function Confetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3", "#33FFF3"]
    const pieces: ConfettiPiece[] = []

    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      })
    }

    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size > 8 ? "50%" : "0",
            transform: `rotate(${piece.rotation}deg)`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [
              `${piece.x}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
            ],
            rotate: [piece.rotation, piece.rotation + 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            ease: "linear",
            times: [0, 1],
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
