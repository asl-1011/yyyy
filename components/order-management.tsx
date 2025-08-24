"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatPrice } from "@/lib/utils/product"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Eye } from "lucide-react"

interface Order {
  _id: string
  orderId: string
  totalPrice: number
  status: string
  createdAt: string
  deliveryLocation: string
  whatsappSent: boolean
  products: Array<{
    productId: {
      _id: string
      name: string
      image_url: string
    }
    quantity: number
    price: number
  }>
}

interface OrderManagementProps {
  initialOrders: Order[]
}

export function OrderManagement({ initialOrders }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      const updatedOrder = await response.json()
      setOrders((prev) => prev.map((order) => (order.orderId === orderId ? updatedOrder : order)))

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-600"
      case "confirmed":
        return "text-blue-600"
      case "processing":
        return "text-purple-600"
      case "shipped":
        return "text-indigo-600"
      case "delivered":
        return "text-green-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Orders Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {["pending", "confirmed", "shipped", "delivered"].map((status) => {
          const count = orders.filter((order) => order.status === status).length
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor(status)}`}>{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{status}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders found</p>
            ) : (
              orders.map((order) => (
                <div key={order.orderId} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">Order #{order.orderId.slice(-8)}</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), "PPP 'at' p")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">{formatPrice(order.totalPrice)}</span>
                      <OrderStatusBadge status={order.status as any} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Items ({order.products.length})</h4>
                      <div className="space-y-2">
                        {order.products.slice(0, 2).map((item) => (
                          <div key={item.productId._id} className="flex items-center gap-3">
                            <Image
                              src={item.productId.image_url || "/placeholder.svg"}
                              alt={item.productId.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.productId.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{order.products.length - 2} more items</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Delivery Location</h4>
                      <p className="text-sm text-muted-foreground">{order.deliveryLocation}</p>
                      {order.whatsappSent && (
                        <Badge variant="secondary" className="mt-2">
                          WhatsApp Sent
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.orderId, value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.orderId.slice(-8)}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && <OrderDetails order={selectedOrder} />}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Order Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Order ID:</span> {order.orderId}
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span> {format(new Date(order.createdAt), "PPP 'at' p")}
            </p>
            <p>
              <span className="text-muted-foreground">Status:</span> <OrderStatusBadge status={order.status as any} />
            </p>
            <p>
              <span className="text-muted-foreground">Total:</span> {formatPrice(order.totalPrice)}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Delivery Information</h4>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">Address:</p>
            <p>{order.deliveryLocation}</p>
            {order.whatsappSent && (
              <Badge variant="secondary" className="mt-2">
                WhatsApp Message Sent
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Order Items</h4>
        <div className="space-y-3">
          {order.products.map((item) => (
            <div key={item.productId._id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <Image
                src={item.productId.image_url || "/placeholder.svg"}
                alt={item.productId.name}
                width={60}
                height={60}
                className="w-15 h-15 object-cover rounded"
              />
              <div className="flex-1">
                <h5 className="font-medium">{item.productId.name}</h5>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
