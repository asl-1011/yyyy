"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

interface UploadedImage {
  url: string
  public_id: string
  alt?: string
  is_primary?: boolean
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`)
        return
      }

      setUploading(true)
      try {
        const formData = new FormData()
        acceptedFiles.forEach((file) => {
          formData.append("files", file)
        })

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()
        const newImages = result.images.map((img: any, index: number) => ({
          ...img,
          is_primary: images.length === 0 && index === 0, // First image is primary if no images exist
        }))

        onImagesChange([...images, ...newImages])
      } catch (error) {
        console.error("Upload error:", error)
        alert("Failed to upload images")
      } finally {
        setUploading(false)
      }
    },
    [images, onImagesChange, maxImages],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If we removed the primary image, make the first remaining image primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true
    }
    onImagesChange(newImages)
  }

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }))
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={image.public_id} className="relative group">
            <div className="aspect-square relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `Product image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant={image.is_primary ? "default" : "secondary"}
                  onClick={() => setPrimaryImage(index)}
                >
                  {image.is_primary ? "Primary" : "Set Primary"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeImage(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {images.length < maxImages && (
        <Card className="border-dashed">
          <div
            {...getRootProps()}
            className={`p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "bg-primary/10" : "hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Upload className="h-8 w-8 animate-spin" />
                  <p>Uploading images...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive
                      ? "Drop images here..."
                      : `Drag & drop images here, or click to select (${images.length}/${maxImages})`}
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
