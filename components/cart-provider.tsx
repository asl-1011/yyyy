"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ShoppingBag } from "lucide-react"
import { CartSidebar } from "./cart-sidebar"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  cartItems: CartItem[]
  setCartItems: (items: CartItem[]) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState("123 Main Street, City")

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      } else {
        return [...prev, item]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const handleCheckout = () => {
    alert("Proceeding to checkout...")
  }

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart, updateQuantity, isCartOpen, setCartOpen }}
    >
      {children}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
        deliveryLocation={deliveryLocation}
      />

      {/* Optional floating cart button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg z-50 flex items-center justify-center"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>
    </CartContext.Provider>
  )
}
