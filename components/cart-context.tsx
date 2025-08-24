"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"

// Types
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

export interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (productId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>
  removeItem: (productId: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refetch: () => Promise<void>
  cartOpen: boolean
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // New state for cart UI open/close
  const [cartOpen, setCartOpen] = useState(false)

  // Fetch cart data
  const fetchCart = async () => {
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/cart")
      if (!res.ok) throw new Error("Failed to fetch cart")

      const cartData = await res.json()
      setCart(cartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  // Add to cart
  const addToCart = async (productId: string, quantity = 1) => {
    if (!session) {
      setError("Please login to add items to cart")
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      const updatedCart = await res.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item to cart")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update quantity")
      }

      const updatedCart = await res.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Remove item
  const removeItem = async (productId: string) => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to remove item")
      }

      const updatedCart = await res.json()
      setCart(updatedCart)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!session) return false

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/cart", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to clear cart")

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

  return (
    <CartContext.Provider
    
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refetch: fetchCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
