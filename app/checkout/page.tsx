import { Navigation } from "@/components/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import { requireAuth } from "@/lib/auth"

export default async function CheckoutPage() {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>

            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  )
}
