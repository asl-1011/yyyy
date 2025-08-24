import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

// GET /api/products/categories - Get all categories with product counts
export async function GET() {
  try {
    await dbConnect()

    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    const formattedCategories = categories.map((cat) => ({
      name: cat._id,
      count: cat.count,
      displayName: cat._id
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
