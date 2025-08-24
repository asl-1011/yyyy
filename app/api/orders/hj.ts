
import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { requireAuthAPI, Session } from "@/lib/auth"
import { deactivateCart, getOrCreateActiveCart } from "@/lib/utils/cart"
import { generateWhatsAppLink } from "@/lib/utils/whatsapp"
import { rateLimit } from "@/lib/rate-limit"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

// Zod schema for creating orders
const createOrderSchema = z.object({
  deliveryLocation: z.string().min(1, "Delivery location is required"),
})

// ------------------------ GET /api/orders ------------------------
export async function GET(request: NextRequest) {
  try {
    const sessionOrResponse = await requireAuthAPI()
    if (sessionOrResponse instanceof NextResponse) return sessionOrResponse
    const session: Session = sessionOrResponse

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const query: any = {}

    if (session.user.role === "admin") {
      if (userId) query.userId = userId
    } else {
      query.userId = session.user.id
    }

    const orders = await Order.find(query)
      .populate({
        path: "products.productId",
        model: "Product",
        select: "name image_url",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments(query)

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ------------------------ POST /api/orders ------------------------
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 5, 60000) // 5 orders per minute
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many order attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        },
      )
    }

    const sessionOrResponse = await requireAuthAPI()
    if (sessionOrResponse instanceof NextResponse) return sessionOrResponse
    const session: Session = sessionOrResponse

    await dbConnect()

    const body = await request.json()
    const { deliveryLocation } = createOrderSchema.parse(body)

    const cart = await Cart.findOne({ userId: session.user.id, isActive: true }).populate({
      path: "products.productId",
      model: "Product",
    })

    if (!cart || cart.products.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Validate stock and calculate total
    let totalPrice = 0
    const orderProducts = []

    for (const item of cart.products) {
      const product = item.productId as any

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${product?.name || "unknown"} is no longer available` },
          { status: 400 },
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} units of ${product.name} available` },
          { status: 400 },
        )
      }

      totalPrice += product.price * item.quantity

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Generate order
    const orderId = uuidv4()
    const order = new Order({
      orderId,
      cartId: cart.cartId,
      userId: session.user.id,
      products: orderProducts,
      totalPrice,
      deliveryLocation,
      status: "pending",
      whatsappSent: false,
    })

    await order.save()

    // Update product stock
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    }

    // Deactivate cart and create new one
    await deactivateCart(cart.cartId)
    await getOrCreateActiveCart(session.user.id)

    // Populate for WhatsApp
    await order.populate({
      path: "products.productId",
      model: "Product",
      select: "name",
    })

    const whatsappData = {
      orderId: order.orderId,
      cartId: order.cartId,
      products: order.products.map((item: any) => ({
        name: item.productId.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: order.totalPrice,
      deliveryLocation: order.deliveryLocation,
    }

    const whatsappLink = generateWhatsAppLink(whatsappData)
    order.whatsappSent = true
    await order.save()

    return NextResponse.json(
      { order, whatsappLink, message: "Order created successfully" },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
        },
      },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
