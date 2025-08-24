export interface WhatsAppOrderData {
  orderId: string
  cartId: string
  products: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalPrice: number
  deliveryLocation: string
}

export function generateWhatsAppLink(orderData: WhatsAppOrderData): string {
  const storeNumber = process.env.NEXT_PUBLIC_WHATSAPP_STORE_NUMBER|| ""

  const productList = orderData.products.map((p) => `${p.name} x${p.quantity} - ₹${p.price}`).join("%0A")

  const message =
    `🛒 *New Order Received*%0A%0A` +
    `📋 *Order ID:* ${orderData.orderId}%0A` +
    `🛍️ *Cart ID:* ${orderData.cartId}%0A%0A` +
    `📦 *Products:*%0A${productList}%0A%0A` +
    `💰 *Total Amount:* ₹${orderData.totalPrice}%0A%0A` +
    `📍 *Delivery Location:*%0A${orderData.deliveryLocation}%0A%0A` +
    `Please confirm this order and provide payment details. Thank you! 🙏`

  return `https://wa.me/+91${storeNumber}?text=${message}`
}

export function formatWhatsAppMessage(orderData: WhatsAppOrderData): string {
  const productList = orderData.products.map((p) => `${p.name} x${p.quantity} - ₹${p.price}`).join("\n")

  return `🛒 New Order Received

📋 Order ID: ${orderData.orderId}
🛍️ Cart ID: ${orderData.cartId}

📦 Products:
${productList}

💰 Total Amount: ₹${orderData.totalPrice}

📍 Delivery Location:
${orderData.deliveryLocation}

Please confirm this order and provide payment details. Thank you! 🙏`
}
