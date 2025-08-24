import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { getCurrentUser } from "@/lib/auth"

// GET /api/cart/count - Get cart item count (for header badge)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ count: 0 })
    }

    await dbConnect()

    const cart = await Cart.findOne({ userId: user.id, isActive: true })
    if (!cart) {
      return NextResponse.json({ count: 0 })
    }

    const count = cart.products.reduce((sum: number, item: any) => sum + item.quantity, 0)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Get cart count error:", error)
    return NextResponse.json({ count: 0 })
  }
}
