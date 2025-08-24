import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  cartId: string
  userId: mongoose.Types.ObjectId
  products: ICartItem[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const CartSchema = new Schema<ICart>(
  {
    cartId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [CartItemSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

// Ensure only one active cart per user
CartSchema.index({ userId: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } })

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
