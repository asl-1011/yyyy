// app/api/products/route.ts
import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import { requireAdmin } from "@/lib/auth"
import { z } from "zod"

/* ------------------------- Zod validation schemas ------------------------- */

const imageZ = z.object({
  url: z.string().url("Invalid image URL"),
  public_id: z.string().optional(),
  alt: z.string().optional(),
  is_primary: z.boolean().optional().default(false),
})

const productZ = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(["spices", "dry-fruits", "tea"]),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().min(0, "Stock must be non-negative"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(imageZ).min(1, "At least one image is required"),
  isActive: z.boolean().optional().default(true),
})

/* ------------------------------- Utilities -------------------------------- */

function normalizeTags(tags?: string[]) {
  if (!tags) return []
  return [...new Set(tags.map(t => t.trim()).filter(Boolean))]
}

function enforceSinglePrimary(images: Array<z.infer<typeof imageZ>>) {
  const primaries = images.filter(i => i.is_primary)
  if (primaries.length === 0) images[0].is_primary = true
  else if (primaries.length > 1) {
    let found = false
    for (const img of images) {
      if (img.is_primary && !found) found = true
      else img.is_primary = false
    }
  }
  return images
}

/* ---------------------------------- GET ----------------------------------- */
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1
    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const query: Record<string, any> = { isActive: true }
    if (category && category !== "all") query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    let products
    if (search) {
      products = await Product.find({
        ...query,
        $text: { $search: search },
      })
        .sort({ score: { $meta: "textScore" }, [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
    } else {
      const sortOptions: Record<string, 1 | -1> = {}
      if (sortBy === "popular") sortOptions.createdAt = -1
      else if (sortBy === "price") sortOptions.price = sortOrder as 1 | -1
      else if (sortBy === "name") sortOptions.name = sortOrder as 1 | -1
      else sortOptions.createdAt = sortOrder as 1 | -1

      products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean()
    }

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products: products.map(p => ({ ...p, id: p._id })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/* ---------------------------------- POST ---------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request) // pass request to identify user

    await dbConnect()
    const raw = await request.json()

    // Wrap single image_url
    if (!raw.images && raw.image_url) {
      raw.images = [
        {
          url: raw.image_url,
          public_id: raw.public_id || undefined,
          is_primary: true,
        },
      ]
    }

    const parsed = productZ.parse(raw)
    const images = enforceSinglePrimary(parsed.images)
    const tags = normalizeTags(parsed.tags)

    const product = await Product.create({
      ...parsed,
      images,
      tags,
    })

    return NextResponse.json({ product: { ...product.toObject(), id: product._id } }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
