"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-context"
import { useSession } from "next-auth/react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  productName: string
  stock: number
  className?: string
}

export function AddToCartButton({ productId, productName, stock, className }: AddToCartButtonProps) {
  const { data: session } = useSession()
  const { cart, addToCart, updateQuantity, loading } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  // Find if product is already in cart
  const cartItem = cart?.products.find((item) => item.productId._id === productId)
  const currentQuantity = cartItem?.quantity || 0

  const handleAddToCart = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      return
    }

    if (stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      })
      return
    }

    const success = await addToCart(productId, quantity)
    if (success) {
      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart`,
      })
      setQuantity(1) // Reset quantity after adding
    }
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0) return

    const success = await updateQuantity(productId, newQuantity)
    if (success) {
      toast({
        title: "Cart Updated",
        description: newQuantity === 0 ? "Item removed from cart" : "Quantity updated",
      })
    }
  }

  if (stock === 0) {
    return (
      <Button disabled className={className}>
        Out of Stock
      </Button>
    )
  }

  if (cartItem) {
    // Product is in cart - show quantity controls
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(currentQuantity - 1)}
          disabled={loading}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-8 text-center font-medium">{currentQuantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(currentQuantity + 1)}
          disabled={loading || currentQuantity >= stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Product not in cart - show add to cart button
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {stock > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button onClick={handleAddToCart} disabled={loading}>
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  )
}
