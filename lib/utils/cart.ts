import { v4 as uuidv4 } from "uuid"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import type { ICart } from "@/models/Cart"

export async function getOrCreateActiveCart(userId: string): Promise<ICart> {
  await dbConnect()

  // Try to find existing active cart
  let cart = await Cart.findOne({ userId, isActive: true })

  if (!cart) {
    // Create new cart if none exists
    cart = new Cart({
      cartId: uuidv4(),
      userId,
      products: [],
      isActive: true,
    })
    await cart.save()
  }

  return cart
}

export async function deactivateCart(cartId: string): Promise<void> {
  await dbConnect()
  await Cart.findOneAndUpdate({ cartId }, { isActive: false })
}
