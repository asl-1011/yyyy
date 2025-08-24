import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User, { type IAddress } from "@/models/User"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

// -------------------------
// Validation schema
// -------------------------
const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().optional(),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode"),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
})

// -------------------------
// GET - Fetch user addresses
// -------------------------
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const user = await User.findById(session.user.id).select("addresses")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Transform addresses to match the expected format for the modal
    const transformedAddresses = user.addresses.map((addr) => ({
      id: addr._id.toString(),
      label: addr.label || "Address",
      address: `${addr.street}, ${addr.city}, ${addr.state}`,
      pincode: addr.pincode,
      type: addr.label?.toLowerCase() === 'home' ? 'home' : 
            addr.label?.toLowerCase() === 'work' ? 'work' : 'other'
    }))

    return NextResponse.json(transformedAddresses)
  } catch (error) {
    console.error("Get addresses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// -------------------------
// POST - Add new address
// -------------------------
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()
    const parsed = addressSchema.parse(body)

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If new address is default → reset others
    if (parsed.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    user.addresses.push(parsed as IAddress)
    await user.save()

    return NextResponse.json({
      message: "Address added successfully",
      addresses: user.addresses,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Add address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// -------------------------
// DELETE - Remove all addresses
// -------------------------
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ Correct way to clear a DocumentArray
    user.addresses.splice(0, user.addresses.length)
    await user.save()

    return NextResponse.json({ message: "All addresses deleted" })
  } catch (error) {
    console.error("Delete addresses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}