import { Navigation } from "@/components/navigation"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
// import { requireAuth } from "@/lib/auth"

export default async function CartPage() {
  let session = null
  try {
    const { requireAuth } = await import("@/lib/auth")
    session = await requireAuth()
  } catch (error) {
    console.error("Auth not configured:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {session ? "Review your items and proceed to checkout" : "Please sign in to view your cart"}
            </p>
          </div>

          {session ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CartItems />
              </div>
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Authentication is required to access your cart.</p>
              <p className="text-sm text-muted-foreground">
                Please configure environment variables to enable authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
