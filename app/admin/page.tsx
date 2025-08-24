import { requireAdmin } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getAdminStats() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/orders/stats`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch stats")
    return await response.json()
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      statusStats: [],
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    }
  }
}

export default async function AdminDashboard() {
  const session = await requireAdmin()
  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
          </div>

          <AdminStats stats={stats} />

          <div className="grid lg:grid-cols-2 gap-8">
            <RecentOrders orders={stats.recentOrders} />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-primary font-bold">+</span>
                      </div>
                      <h3 className="font-semibold">Add Product</h3>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-secondary font-bold">📦</span>
                      </div>
                      <h3 className="font-semibold">Manage Orders</h3>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
