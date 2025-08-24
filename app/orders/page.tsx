import { Navigation } from "@/components/navigation"
import { OrderHistory } from "@/components/order-history"
import { requireAuth } from "@/lib/auth"

export default async function OrdersPage() {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Order History</h1>
            <p className="text-muted-foreground">Track your orders and view past purchases</p>
          </div>

          <OrderHistory />
        </div>
      </div>
    </div>
  )
}
