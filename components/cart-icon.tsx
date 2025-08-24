"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartCount } from "@/hooks/use-cart-count"
import { useSession } from "next-auth/react"

export function CartIcon() {
  const { data: session } = useSession()
  const { count } = useCartCount()

  if (!session) {
    return null
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  )
}
