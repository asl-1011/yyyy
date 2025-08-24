import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import { requireAdminAPI } from "@/lib/auth"

// GET /api/orders/stats - Get order statistics (Admin only)
export async function GET() {
  try {
    const session = await requireAdminAPI()
    if (session instanceof NextResponse) return session

    await dbConnect()

    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalPrice" },
        },
      },
    ])

    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ])

    const recentOrders = await Order.find()
      .populate({
        path: "products.productId",
        model: "Product",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .limit(10)

    return NextResponse.json({
      statusStats: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    })
  } catch (error) {
    console.error("Get order stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
