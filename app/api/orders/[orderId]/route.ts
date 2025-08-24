import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import { requireAuth, requireAdmin } from "@/lib/auth"
import { z } from "zod"

// --- Types ---
type Session = {
  user: {
    id: string
    role: "admin" | "user"
    email?: string
    name?: string
  }
}

// --- Zod schema for order updates ---
const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  deliveryLocation: z.string().min(1).optional(),
})

// ------------------------- GET /api/orders/[orderId] -------------------------
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // --- Type-safe session ---
    const authResult = await requireAuth()
    if (!authResult || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const session: Session = authResult as Session

    await dbConnect()

    const order = await Order.findOne({ orderId: params.orderId }).populate({
      path: "products.productId",
      model: "Product",
      select: "name image_url category",
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Users can only view their own orders, admins can view any order
    if (session.user.role !== "admin" && order.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ------------------------- PUT /api/orders/[orderId] -------------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await requireAdmin()
    await dbConnect()

    const body = await request.json()
    const updateData = updateOrderSchema.parse(body)

    const order = await Order.findOneAndUpdate({ orderId: params.orderId }, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "products.productId",
      model: "Product",
      select: "name image_url category",
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
