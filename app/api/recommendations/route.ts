import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import Order from "@/models/Order"
import { getCurrentUser } from "@/lib/auth"

// GET /api/recommendations - Get product recommendations
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "8")

    let recommendations: any[] = []

    // If productId is provided, get similar products
    if (productId) {
      const currentProduct = await Product.findById(productId)
      if (currentProduct) {
        // Find products in same category or with similar tags
        recommendations = await Product.find({
          _id: { $ne: productId },
          isActive: true,
          $or: [{ category: currentProduct.category }, { tags: { $in: currentProduct.tags } }],
        })
          .limit(limit)
          .sort({ createdAt: -1 })
      }
    }

    // If user is logged in, get personalized recommendations
    if (userId && recommendations.length < limit) {
      const user = await getCurrentUser()
      if (user) {
        // Get user's order history
        const userOrders = await Order.find({ userId }).populate("products.productId").sort({ createdAt: -1 }).limit(10)

        // Extract categories and tags from user's purchase history
        const purchasedCategories: string[] = []
        const purchasedTags: string[] = []

        userOrders.forEach((order) => {
          order.products.forEach((item: any) => {
            if (item.productId) {
              purchasedCategories.push(item.productId.category)
              purchasedTags.push(...item.productId.tags)
            }
          })
        })

        // Get products based on user's preferences
        const personalizedRecs = await Product.find({
          isActive: true,
          _id: { $nin: recommendations.map((p) => p._id) },
          $or: [{ category: { $in: purchasedCategories } }, { tags: { $in: purchasedTags } }],
        })
          .limit(limit - recommendations.length)
          .sort({ createdAt: -1 })

        recommendations = [...recommendations, ...personalizedRecs]
      }
    }

    // If still need more recommendations, get popular products
    if (recommendations.length < limit) {
      // Get most ordered products (popular items)
      const popularProducts = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalOrdered: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: limit - recommendations.length },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        { $match: { "product.isActive": true } },
        { $replaceRoot: { newRoot: "$product" } },
      ])

      // Filter out already recommended products
      const existingIds = recommendations.map((p) => p._id.toString())
      const filteredPopular = popularProducts.filter((p: any) => !existingIds.includes(p._id.toString()))

      recommendations = [...recommendations, ...filteredPopular]
    }

    // If still need more, get newest products
    if (recommendations.length < limit) {
      const existingIds = recommendations.map((p) => p._id.toString())
      const newestProducts = await Product.find({
        isActive: true,
        _id: { $nin: existingIds },
      })
        .sort({ createdAt: -1 })
        .limit(limit - recommendations.length)

      recommendations = [...recommendations, ...newestProducts]
    }

    return NextResponse.json(recommendations.slice(0, limit))
  } catch (error) {
    console.error("Get recommendations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
