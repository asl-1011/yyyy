export interface User {
  id: string
  name: string
  email: string
  phone?: string
  addresses: Address[]
  role: "user" | "admin"
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface Product {
  id: string
  name: string
  category: "spices" | "dry-fruits" | "tea"
  price: number
  stock: number
  description: string
  image_url: string
  tags: string[]
  isActive: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Cart {
  cartId: string
  userId: string
  products: CartItem[]
  isActive: boolean
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  orderId: string
  cartId: string
  userId: string
  products: OrderItem[]
  totalPrice: number
  deliveryLocation: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  whatsappSent: boolean
  createdAt: string
}
