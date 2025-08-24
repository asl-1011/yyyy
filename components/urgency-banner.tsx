"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isEndingSoon = timeLeft.hours === 0 && timeLeft.minutes < 10

  return (
    <AnimatePresence>
      <motion.div
        className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 shadow-md"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-medium">
            {/* Text + Icon */}
            <motion.div
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Clock className="h-4 w-4 animate-pulse" />
              <span className="font-semibold">
                🔥 Limited Time Offer:{" "}
                <span className="underline">Free Shipping</span> on orders above ₹999!
              </span>
            </motion.div>

            {/* Countdown Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{
                scale: isEndingSoon ? [1, 1.2, 1] : [1, 1.05, 1],
                rotate: isEndingSoon ? [0, -5, 5, 0] : 0,
              }}
              transition={{ repeat: Infinity, duration: isEndingSoon ? 0.8 : 1.5 }}
            >
              <Badge
                variant="secondary"
                className="bg-white/20 text-white text-base px-3 py-1 rounded-xl shadow-lg"
              >
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </Badge>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
