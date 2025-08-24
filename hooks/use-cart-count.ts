"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useCartCount() {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)

  const fetchCount = async () => {
    if (!session) {
      setCount(0)
      return
    }

    try {
      const response = await fetch("/api/cart/count")
      if (response.ok) {
        const data = await response.json()
        setCount(data.count)
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error)
    }
  }

  useEffect(() => {
    fetchCount()
  }, [session])

  return { count, refetch: fetchCount }
}
