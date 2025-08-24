import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      if (!file.type.startsWith("image/")) {
        throw new Error(`Invalid file type: ${file.type}`)
      }

      return await uploadToCloudinary(file)
    })

    const uploadResults = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      images: uploadResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 })
  }
}
