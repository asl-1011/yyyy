import { requireAdmin } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { OrderManagement } from "@/components/admin/order-management"
import { cookies } from "next/headers"

async function getAllOrders() {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    console.log("[v0] Fetching orders from:", `${baseUrl}/api/orders?limit=50`)

    // Get cookies from current request
  
    const cookieStore = await cookies() 
    const allCookies = cookieStore.getAll() // ReadonlyRequestCookies[]
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ")

    const response = await fetch(`${baseUrl}/api/orders?limit=50`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader, // forward cookies for authentication
      },
    })

    console.log("[v0] Orders API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Orders API error response:", errorText)
      throw new Error(`Failed to fetch orders: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Orders fetched successfully:", data.orders?.length || 0, "orders")
    return data.orders || []
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export default async function AdminOrdersPage() {
  await requireAdmin() // Server-side admin check

  const orders = await getAllOrders()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground">Manage customer orders and track deliveries</p>
          </div>

          <OrderManagement initialOrders={orders} />
        </div>
      </div>
    </div>
  )
}
