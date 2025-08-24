import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { formatPrice } from "@/lib/utils/product"
import { format } from "date-fns"

interface RecentOrdersProps {
  orders: Array<{
    orderId: string
    totalPrice: number
    status: string
    createdAt: string
    products: Array<{
      productId: { name: string }
      quantity: number
    }>
  }>
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent orders</p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">#{order.orderId.slice(-8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.products.length} item(s) • {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
                  <OrderStatusBadge status={order.status as any} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
