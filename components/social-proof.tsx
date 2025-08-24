"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart } from "lucide-react"

export function SocialProof() {
  const [viewerCount, setViewerCount] = useState(42)
  const [recentPurchase, setRecentPurchase] = useState({
    product: "Premium Cardamom",
    location: "Mumbai",
    time: "12 minutes ago",
  })

  useEffect(() => {
    // 👀 Update viewers every 20–40 seconds
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3 // -3 to +3 viewers
        return Math.max(20, prev + change) // never go below 20
      })
    }, Math.floor(Math.random() * 20000) + 20000)

    // 🛒 Update purchases every 45–90 minutes
    const purchaseInterval = setInterval(() => {
      const products = ["Premium Cardamom", "Organic Turmeric", "Masala Tea", "Black Pepper", "Cinnamon Powder"]
      const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]

      setRecentPurchase({
        product: products[Math.floor(Math.random() * products.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: `${Math.floor(Math.random() * 40) + 20} minutes ago`, // 20–60 mins
      })
    }, Math.floor(Math.random() * 2700000) + 2700000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(purchaseInterval)
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Viewer Count (optional) */}
      {/*
      <Badge
        variant="secondary"
        className="bg-white/90 backdrop-blur-sm shadow-md border 
                   text-[10px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl"
      >
        <Eye className="h-3 w-3 mr-1 text-green-600" />
        {viewerCount} people are viewing this product
      </Badge>
      */}

      {/* Purchase Activity */}
      <Badge
        variant="secondary"
        className="bg-white/90 backdrop-blur-sm shadow-md border 
                   text-[10px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl"
      >
        <ShoppingCart className="h-3 w-3 mr-1 text-orange-600" />
        Someone from {recentPurchase.location} purchased{" "}
        <span className="font-semibold">{recentPurchase.product}</span> {recentPurchase.time}
      </Badge>
    </div>
  )
}
