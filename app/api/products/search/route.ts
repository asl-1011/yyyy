import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

// GET /api/products/search - Advanced search with suggestions
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ suggestions: [], products: [] })
    }

    // Get search suggestions (product names that match)
    const suggestions = await Product.find({
      isActive: true,
      name: { $regex: query, $options: "i" },
    })
      .select("name")
      .limit(5)

    // Get full text search results
    const products = await Product.find({
      isActive: true,
      $text: { $search: query },
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)

    return NextResponse.json({
      suggestions: suggestions.map((p) => p.name),
      products,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
