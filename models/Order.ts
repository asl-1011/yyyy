import mongoose, { type Document, Schema } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  orderId: string
  cartId: string
  userId: mongoose.Types.ObjectId
  products: IOrderItem[]
  totalPrice: number
  deliveryLocation: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  whatsappSent: boolean
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    cartId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [OrderItemSchema],
    totalPrice: { type: Number, required: true, min: 0 },
    deliveryLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    whatsappSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
