import { requireAdmin } from "@/lib/auth"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { ProductManagement } from "@/components/admin/product-management"

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products?limit=50`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch products")
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function AdminProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>

          <ProductManagement initialProducts={products} />
        </div>
      </div>
    </div>
  )
}
