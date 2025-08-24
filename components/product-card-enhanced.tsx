"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils/product"
import { Star, Heart, Eye, ShoppingCart, ImageOff } from "lucide-react"

interface ProductImage {
  url: string
  public_id: string
  alt?: string
  is_primary?: boolean
}

interface ProductCardProps {
  product: {
    _id: string
    name: string
    description?: string
    price: number
    images?: ProductImage[]
    category: string
    stock: number
    rating?: number
    reviewCount?: number
    isPopular?: boolean
    discount?: number
  }
}

export function ProductCardEnhanced({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)

  // Pick primary image, otherwise first, otherwise placeholder
  const primaryImage =
    product.images?.find((img) => img.is_primary) ||
    product.images?.[0] ||
    { url: "/placeholder.svg", alt: "Product image" }

  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 50) + 10)
    if (!product.reviewCount) {
      setReviewCount(Math.floor(Math.random() * 100) + 10)
    }
  }, [product.reviewCount])

  const finalPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {product.isPopular && (
        <Badge className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground">
          🔥 Popular
        </Badge>
      )}

      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/product/${product._id}`}>
            {imageError ? (
              <div className="w-full h-60 flex items-center justify-center bg-gray-100 text-gray-400">
                <ImageOff className="w-10 h-10" />
              </div>
            ) : (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                width={300}
                height={240}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                priority={false}
              />
            )}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>

          {product.stock <= 5 && product.stock > 0 && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 bg-orange-100 text-orange-800"
            >
              ⚡ Only {product.stock} left!
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <Link href={`/product/${product._id}`}>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name || "Unnamed product"}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description || "No description available."}
          </p>

          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!)
                        ? "fill-primary text-primary"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({reviewCount ?? product.reviewCount ?? 0})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-lg font-bold text-primary">
                {formatPrice(finalPrice)}
              </span>
              {product.discount && product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <Badge variant="outline">
              {product.category?.replace("-", " ") || "Misc"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>
                {viewCount !== null ? `${viewCount} views` : "..."}
              </span>
            </div>
            <Button size="sm" className="h-8">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
