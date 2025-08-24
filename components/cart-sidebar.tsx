// components/cart-sidebar.tsx
"use client"

import { useState } from "react"
import { useCart } from "./cart-context"
import { X, Plus, Minus, ShoppingBag, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/hooks/use-orders"
import { generateWhatsAppLink, WhatsAppOrderData } from "@/lib/whatsapp"
import { LocationModal } from "@/components/LocationModal"

export function CartSidebar({ deliveryLocation }: { deliveryLocation: string }) {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    loading,
  } = useCart()

  const { createOrder } = useOrders()

  // 🔹 State for location modal
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [location, setLocation] = useState(deliveryLocation)

  const subtotal =
    cart?.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) || 0
  const deliveryFee = subtotal > 299 ? 0 : 40
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return
    if (newQuantity === 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!location.trim()) {
      alert("Please provide a delivery location before proceeding.")
      return
    }

    try {
      const orderResponse = await createOrder(location.trim())
      if (!orderResponse) return

      const order: any = (orderResponse as any).order ?? orderResponse

      if (!order.products) {
        console.error("Order has no products:", order)
        alert("Something went wrong while creating your order. Please try again.")
        return
      }

      const orderData: WhatsAppOrderData = {
        orderId: order.orderId,
        cartId: order.cartId,
        products: order.products.map((p: any) => ({
          name: p.productId.name,
          quantity: p.quantity,
          price: p.price,
        })),
        totalPrice: order.totalPrice,
        deliveryLocation: order.deliveryLocation,
      }

      const whatsappLink = generateWhatsAppLink(orderData)
      window.open(whatsappLink, "_blank")
      setCartOpen(false)
    } catch (err) {
      console.error("Checkout failed:", err)
      alert("Something went wrong while placing the order. Please try again.")
    }
  }

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
          <SheetHeader className="px-4 py-6 border-b">
            <SheetTitle className="flex items-center space-x-2 text-left">
              <ShoppingBag className="h-5 w-5" />
              <span>Your Cart ({cart?.products?.length ?? 0} items)</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 flex flex-col min-h-0 px-4">
            {cart?.products?.length === 0 || !cart ? (
              <div className="flex-1 flex items-center justify-center text-center py-12">
                <div className="space-y-4">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-medium">Your cart is empty</h3>
                    <p className="text-sm text-muted-foreground">
                      Add some delicious items to get started!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Delivery Info */}
                <Card className="p-3 mb-4 mt-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">Delivering to</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {location || "No location selected"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => setLocationModalOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                </Card>

                {/* Items */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 min-h-0">
                  {cart.products.map((item) => (
                    <Card key={item.productId._id} className="p-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.productId.image_url}
                          alt={item.productId.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{item.productId.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            ₹{item.productId.price} × {item.quantity} ={" "}
                            <span className="font-semibold text-primary">
                              ₹{item.productId.price * item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleQuantityChange(item.productId._id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleQuantityChange(item.productId._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-background border-t p-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>₹{tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : `Proceed to Checkout - ₹${total}`}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 🔹 Location Modal Integration */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onLocationSelect={(newLocation) => {
          setLocation(newLocation)
          setLocationModalOpen(false)
        }}
      />
    </>
  )
}
