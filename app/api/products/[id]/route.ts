import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import { requireAdmin } from "@/lib/auth"
import { z } from "zod"

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(["spices", "dry-fruits", "tea"]).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  description: z.string().min(1).optional(),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await dbConnect()

    const body = await request.json()
    const updateData = productUpdateSchema.parse(body)

    const product = await Product.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    await dbConnect()

    const product = await Product.findByIdAndDelete(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
