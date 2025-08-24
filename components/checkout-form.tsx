"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOrders } from "@/hooks/use-orders"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils/product"
import { useToast } from "@/hooks/use-toast"

export function CheckoutForm() {
  const { cart } = useCart()
  const { createOrder, loading } = useOrders()
  const { toast } = useToast()
  const [deliveryLocation, setDeliveryLocation] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!deliveryLocation.trim()) {
      setError("Please enter delivery location")
      return
    }

    if (!cart || cart.products.length === 0) {
      setError("Your cart is empty")
      return
    }

    const result = await createOrder(deliveryLocation.trim())

    if (result) {
      toast({
        title: "Order Placed Successfully!",
        description: "You will be redirected to WhatsApp to complete your order.",
      })

      // Redirect to WhatsApp
      if (result.whatsappLink) {
        window.open(result.whatsappLink, "_blank")
      }
    }
  }

  if (!cart || cart.products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Your cart is empty</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your order and proceed to WhatsApp</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Order Summary */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Order Summary</Label>
            <div className="border rounded-lg p-4 space-y-2">
              {cart.products.map((item) => (
                <div key={item.productId._id} className="flex justify-between items-center">
                  <span className="text-sm">
                    {item.productId.name} x {item.quantity}
                  </span>
                  <span className="text-sm font-medium">{formatPrice(item.productId.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="space-y-2">
            <Label htmlFor="deliveryLocation">Delivery Location *</Label>
            <Textarea
              id="deliveryLocation"
              placeholder="Enter your complete delivery address..."
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              required
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Place Order & Continue to WhatsApp"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            After placing your order, you'll be redirected to WhatsApp to complete the payment and confirm delivery
            details.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
