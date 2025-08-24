"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export interface OrderItem {
  productId: {
    _id: string
    name: string
    image_url: string
    category: string
  }
  quantity: number
  price: number
}

export interface Order {
  _id: string
  orderId: string
  cartId: string
  userId: string
  products: OrderItem[]
  totalPrice: number
  deliveryLocation: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  whatsappSent: boolean
  createdAt: string
  updatedAt: string
}

export function useOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (deliveryLocation: string) => {
    if (!session) {
      setError("Please login to place an order")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryLocation }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const data = await response.json()

      // Refresh orders list
      await fetchOrders()

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
      return null
    } finally {
      setLoading(false)
    }
  }

  const getOrder = async (orderId: string) => {
    if (!session) return null

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch order")
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order")
      return null
    }
  }

  useEffect(() => {
    if (session) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [session])

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrder,
    refetch: fetchOrders,
  }
}
