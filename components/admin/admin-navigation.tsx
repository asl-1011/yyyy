import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthStatus } from "@/components/auth-status"
import { Package, ShoppingCart, BarChart3, Settings, Home } from "lucide-react"

export function AdminNavigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SB</span>
            </div>
            <span className="font-bold text-xl text-foreground">Admin Panel</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                View Store
              </Link>
            </Button>
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  )
}
