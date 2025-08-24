"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrders } from "@/hooks/use-orders"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatPrice } from "@/lib/utils/product"
import { format } from "date-fns"

export function OrderHistory() {
  const { orders, loading } = useOrders()

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.orderId}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">Order #{order.orderId.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground">Placed on {format(new Date(order.createdAt), "PPP")}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {order.products.map((item) => (
                <div key={item.productId._id} className="flex gap-4">
                  <Image
                    src={item.productId.image_url || "/placeholder.svg"}
                    alt={item.productId.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.productId.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-primary">{formatPrice(order.totalPrice)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Delivery to: {order.deliveryLocation}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
