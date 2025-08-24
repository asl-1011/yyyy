import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { requireAuth } from "@/lib/auth"
import { getOrCreateActiveCart } from "@/lib/utils/cart"
import { z } from "zod"

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
})

// GET /api/cart - Get user's active cart
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const cart = await getOrCreateActiveCart(session.user.id)

    // Populate product details
    await cart.populate({
      path: "products.productId",
      model: "Product",
      select: "name price image_url stock isActive",
    })

    // Filter out inactive products and calculate totals
    const activeProducts = cart.products.filter((item: any) => item.productId && item.productId.isActive)

    const cartWithTotals = {
      ...cart.toObject(),
      products: activeProducts,
      itemCount: activeProducts.reduce((sum: number, item: any) => sum + item.quantity, 0),
      totalPrice: activeProducts.reduce((sum: number, item: any) => sum + item.productId.price * item.quantity, 0),
    }

    return NextResponse.json(cartWithTotals)
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()
    const { productId, quantity } = addToCartSchema.parse(body)

    // Verify product exists and is active
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 })
    }

    // Check stock availability
    if (product.stock < quantity) {
      return NextResponse.json(
        {
          error: `Only ${product.stock} items available in stock`,
        },
        { status: 400 },
      )
    }

    const cart = await getOrCreateActiveCart(session.user.id)

    // Check if product already exists in cart
    const existingItemIndex = cart.products.findIndex((item: any) => item.productId.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.products[existingItemIndex].quantity + quantity

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            error: `Cannot add ${quantity} more. Only ${product.stock - cart.products[existingItemIndex].quantity} more available`,
          },
          { status: 400 },
        )
      }

      cart.products[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item to cart
      cart.products.push({ productId, quantity })
    }

    await cart.save()

    // Return updated cart with product details
    await cart.populate({
      path: "products.productId",
      model: "Product",
      select: "name price image_url stock isActive",
    })

    return NextResponse.json(cart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const cart = await Cart.findOne({ userId: session.user.id, isActive: true })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    cart.products = []
    await cart.save()

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
