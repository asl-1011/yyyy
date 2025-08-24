"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils/product"

export function CartSummary() {
  const { cart } = useCart()

  if (!cart || cart.products.length === 0) {
    return null
  }

  const subtotal = cart.totalPrice
  const shipping = subtotal >= 500 ? 0 : 50
  const total = subtotal + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          {shipping === 0 && <p className="text-xs text-green-600">Free shipping on orders above ₹500</p>}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
