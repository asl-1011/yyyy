"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export interface CartItem {
  productId: {
    _id: string
    name: string
    price: number
    image_url: string
    stock: number
    isActive: boolean
  }
  quantity: number
}

export interface Cart {
  _id: string
  cartId: string
  userId: string
  products: CartItem[]
  isActive: boolean
  itemCount: number
  totalPrice: number
}

export function useCart() {
  const { data: session } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cart")
      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const cartData = await response.json()
      setCart(cartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    if (!session) {
      setError("Please login to add items to cart")
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      const updatedCart = await response.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item to cart")
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update quantity")
      }

      const updatedCart = await response.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity")
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove item")
      }

      const updatedCart = await response.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item")
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cart")
      }

      setCart(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart")
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [session])

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
  }
}
