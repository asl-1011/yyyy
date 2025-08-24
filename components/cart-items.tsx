"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils/product"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CartItems() {
  const { cart, loading, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    const success = await updateQuantity(productId, newQuantity)
    if (success) {
      toast({
        title: "Cart Updated",
        description: newQuantity === 0 ? "Item removed from cart" : "Quantity updated",
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    const success = await removeItem(productId)
    if (success) {
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart",
      })
    }
  }

  if (!cart || cart.products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground">Add some products to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cart.products.map((item) => (
        <Card key={item.productId._id}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Image
                src={item.productId.image_url || "/placeholder.svg"}
                alt={item.productId.name}
                width={100}
                height={100}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground">{item.productId.name}</h3>
                <p className="text-lg font-bold text-primary">{formatPrice(item.productId.price)}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                      disabled={loading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                      disabled={loading || item.quantity >= item.productId.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId._id)}
                    disabled={loading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{formatPrice(item.productId.price * item.quantity)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
