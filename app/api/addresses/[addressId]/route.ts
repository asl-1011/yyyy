import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User, { type IAddress } from "@/models/User"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"
import type { Types } from "mongoose"

const updateSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode").optional(),
  country: z.string().optional(),
  label: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
})

// --------------------
// PUT - Update address
// --------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()
    const updates = updateSchema.parse(body)

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ TS-safe access
    const address = user.addresses.id(params.addressId as unknown as Types.ObjectId)
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Handle default flag
    if (updates.isDefault) {
      user.addresses.forEach((addr: IAddress & { _id: Types.ObjectId }) => {
        addr.isDefault = false
      })
      address.isDefault = true
    }

    Object.assign(address, updates)
    await user.save()

    return NextResponse.json({
      message: "Address updated",
      addresses: user.addresses,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Update address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// --------------------
// DELETE - Remove address
// --------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ TS-safe
    const address = user.addresses.id(params.addressId as unknown as Types.ObjectId)
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    address.deleteOne()
    await user.save()

    return NextResponse.json({
      message: "Address deleted",
      addresses: user.addresses,
    })
  } catch (error) {
    console.error("Delete address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
