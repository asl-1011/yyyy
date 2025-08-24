import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const updateQuantitySchema = z.object({
  quantity: z.number().min(0, "Quantity must be non-negative"),
})

// PUT /api/cart/items/[productId] - Update item quantity
export async function PUT(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()
    const { quantity } = updateQuantitySchema.parse(body)

    const cart = await Cart.findOne({ userId: session.user.id, isActive: true })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const itemIndex = cart.products.findIndex((item: any) => item.productId.toString() === params.productId)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.products.splice(itemIndex, 1)
    } else {
      // Verify stock availability
      const product = await Product.findById(params.productId)
      if (!product || !product.isActive) {
        return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 })
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          {
            error: `Only ${product.stock} items available in stock`,
          },
          { status: 400 },
        )
      }

      // Update quantity
      cart.products[itemIndex].quantity = quantity
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

    console.error("Update cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/cart/items/[productId] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const cart = await Cart.findOne({ userId: session.user.id, isActive: true })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const itemIndex = cart.products.findIndex((item: any) => item.productId.toString() === params.productId)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    cart.products.splice(itemIndex, 1)
    await cart.save()

    // Return updated cart with product details
    await cart.populate({
      path: "products.productId",
      model: "Product",
      select: "name price image_url stock isActive",
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Remove cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
