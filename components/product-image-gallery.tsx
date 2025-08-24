"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImage {
  url: string
  alt?: string
  is_primary?: boolean
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No image available</p>
      </Card>
    )
  }

  const currentImage = images[selectedIndex]

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-square overflow-hidden">
        <Image
          src={currentImage.url || "/placeholder.svg"}
          alt={currentImage.alt || productName}
          fill
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </Card>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <Card
              key={index}
              className={`aspect-square cursor-pointer overflow-hidden transition-all ${
                index === selectedIndex ? "ring-2 ring-primary" : "hover:opacity-80"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `${productName} ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
